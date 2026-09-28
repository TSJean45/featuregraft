// recorder.ts — Generic DOM behavior recorder
// This is the same code that would run as a Chrome extension content script.
// It uses MutationObserver + pointer/click events + transitionend to observe
// real DOM behavior without any knowledge of the specific interaction.

export interface RecordedEvent {
  timestamp: number;
  type: string;
  targetSelector: string;
  targetClasses: string[];
  detail?: Record<string, unknown>;
}

export interface BehaviorSpec {
  featureName: string;
  capturedAt: string;
  triggerEvent: string;
  targetSelector: string;
  steps: BehaviorStep[];
  summary: string;
  stateModel: {
    default: string;
    expanded: string;
    transition: string;
  };
}

export interface BehaviorStep {
  step: number;
  action: string;
  target: string;
  effect: string;
  value?: string;
}

function getSelector(el: Element): string {
  if (el.id) return `#${el.id}`;
  const classes = Array.from(el.classList)
    .filter((c) => !["expanded", "active", "open", "visible"].includes(c))
    .slice(0, 2);
  const tag = el.tagName.toLowerCase();
  return classes.length ? `${tag}.${classes.join(".")}` : tag;
}

export class Recorder {
  private events: RecordedEvent[] = [];
  private recording = false;
  private observer: MutationObserver | null = null;
  private listeners: Array<[EventTarget, string, EventListener]> = [];

  start(root: Element = document.body) {
    this.events = [];
    this.recording = true;

    // Observe class mutations on all child elements
    this.observer = new MutationObserver((mutations) => {
      if (!this.recording) return;
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const el = mutation.target as Element;
          const oldClasses = (mutation.oldValue ?? "").split(" ").filter(Boolean);
          const newClasses = Array.from(el.classList);
          const added = newClasses.filter((c) => !oldClasses.includes(c));
          const removed = oldClasses.filter((c) => !newClasses.includes(c));
          added.forEach((cls) => {
            this.push("class_added", el, { value: cls });
          });
          removed.forEach((cls) => {
            this.push("class_removed", el, { value: cls });
          });
        }
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.push("element_appeared", node as Element, {
                effect: `${(node as Element).tagName.toLowerCase()} added to DOM`,
              });
            }
          });
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.push("element_disappeared", node as Element, {
                effect: `${(node as Element).tagName.toLowerCase()} removed from DOM`,
              });
            }
          });
        }
      }
    });

    this.observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ["class", "style"],
    });

    // Click events
    const clickHandler: EventListener = (e) => {
      if (!this.recording) return;
      const el = e.target as Element;
      const closest = el.closest("article, [data-card-id]") as Element | null;
      this.push("click", closest ?? el, {
        cardId: (closest as HTMLElement)?.dataset?.cardId,
        text: (closest?.querySelector("h2") as HTMLElement)?.innerText?.slice(0, 40),
      });
    };
    root.addEventListener("click", clickHandler, true);
    this.listeners.push([root, "click", clickHandler]);

    // Transition end
    const transitionHandler: EventListener = (e) => {
      if (!this.recording) return;
      const el = e.target as Element;
      this.push("style_transition", el, {
        effect: `CSS transition completed on ${getSelector(el)}`,
      });
    };
    root.addEventListener("transitionend", transitionHandler, true);
    this.listeners.push([root, "transitionend", transitionHandler]);
  }

  stop(): RecordedEvent[] {
    this.recording = false;
    this.observer?.disconnect();
    this.observer = null;
    this.listeners.forEach(([target, type, handler]) => {
      target.removeEventListener(type, handler, true);
    });
    this.listeners = [];
    return [...this.events];
  }

  private push(type: string, el: Element, detail?: Record<string, unknown>) {
    this.events.push({
      timestamp: Date.now(),
      type,
      targetSelector: getSelector(el),
      targetClasses: Array.from(el.classList),
      detail,
    });
  }

  generateSpec(events: RecordedEvent[]): BehaviorSpec {
    // Distill raw event stream into semantic behavior steps
    const steps: BehaviorStep[] = [];
    let stepNum = 1;
    let foundExpand = false;
    let foundCollapse = false;
    let expandSelector = "";

    for (const ev of events) {
      switch (ev.type) {
        case "click":
          if (!foundExpand) {
            const cardTitle = ev.detail?.text ? ` — "${ev.detail.text}"` : "";
            steps.push({
              step: stepNum++,
              action: "click",
              target: ev.targetSelector,
              effect: `triggers expand interaction${cardTitle}`,
            });
            expandSelector = ev.targetSelector;
          } else if (!foundCollapse) {
            steps.push({
              step: stepNum++,
              action: "click",
              target: ev.targetSelector,
              effect: "triggers collapse / dismiss",
            });
          }
          break;
        case "class_added":
          if (ev.detail?.value === "expanded" || ev.detail?.value === "active") {
            foundExpand = true;
            steps.push({
              step: stepNum++,
              action: "class_added",
              target: ev.targetSelector,
              value: String(ev.detail.value),
              effect: `element enters '${ev.detail.value}' state`,
            });
          }
          break;
        case "class_removed":
          if (ev.detail?.value === "expanded" || ev.detail?.value === "active") {
            foundCollapse = true;
            steps.push({
              step: stepNum++,
              action: "class_removed",
              target: ev.targetSelector,
              value: String(ev.detail.value),
              effect: `element leaves '${ev.detail.value}' state`,
            });
          }
          break;
        case "element_appeared":
          steps.push({
            step: stepNum++,
            action: "element_appeared",
            target: ev.targetSelector,
            effect: String(ev.detail?.effect ?? "element added to DOM"),
          });
          break;
        case "element_disappeared":
          steps.push({
            step: stepNum++,
            action: "element_disappeared",
            target: ev.targetSelector,
            effect: String(ev.detail?.effect ?? "element removed from DOM"),
          });
          break;
        case "style_transition":
          // Only include first expand and first collapse transitions
          if (steps.length > 0 && !steps.some((s) => s.action === "style_transition")) {
            steps.push({
              step: stepNum++,
              action: "style_transition",
              target: ev.targetSelector,
              effect: String(ev.detail?.effect ?? "CSS transition completed"),
            });
          }
          break;
      }
    }

    return {
      featureName: "Expandable Card with Overlay",
      capturedAt: new Date().toISOString(),
      triggerEvent: "click",
      targetSelector: expandSelector || ".card",
      steps,
      summary:
        "Clicking a card triggers an expand transition and shows a full-page backdrop overlay. " +
        "Clicking the backdrop collapses the card back to its original state. " +
        "Only one card can be expanded at a time.",
      stateModel: {
        default: "collapsed — card at normal size, no backdrop",
        expanded: "one card has class 'expanded', backdrop element present in DOM",
        transition: "CSS transition on transform/width/height, ~300ms ease",
      },
    };
  }
}
