# FeatureGraft

> **Don't describe the feature. Show it.**

You ever see a sick interaction on another app and think "I want that"? So you spend 2 hours describing it to an AI and it still doesn't get it. FeatureGraft fixes that. Show it once, Bob figures out the rest. Behavior transplanted. CSS generated from scratch for your app. No source code stolen.

**FeatureGraft transfers behavior — not source code.**

---

## The Problem

Developers constantly find useful interactions in other products:

- expandable card previews
- drag-to-reorder lists
- contextual hover menus
- keyboard navigation patterns

Recreating these requires manually describing every tiny detail:

```
See feature → describe it in words → explain edge cases → implement → repeatedly correct
```

A screenshot captures appearance. It cannot capture **state transitions**.

## The Solution

```
See feature → demonstrate it once → Bob adapts it into your project
```

FeatureGraft has two layers:

1. **Capture layer** — a generic DOM recorder (`recorder.ts`) that observes real browser events: `MutationObserver` watching class changes, `addEventListener` for clicks, `transitionend` for CSS animations. No AI, no screenshots — pure deterministic observation.

2. **Adaptation layer** — IBM Bob reads the structured `behavior-spec.json` alongside the target codebase, identifies the relevant components, and implements equivalent behavior using the target app's own architecture and styling.

---

## Demo Flow

```
1. Open reference app (dark, Codrop-style)
         ↓
2. Click "🔴 Record Feature"
         ↓
3. Demonstrate interaction: click card → expand → click backdrop → collapse
         ↓
4. Click "⏹ Stop Recording"
         ↓
5. behavior-spec.json generated live — 8 behavioral steps captured
         ↓
6. Open target app (light blog) — cards are static
         ↓
7. Click "⚡ Apply Graft"
         ↓
8. IBM Bob reads spec + target codebase → transplants behavior
         ↓
9. Same interaction. Completely different app. Zero manual description.
```

---

## Architecture

```
REFERENCE APP (dark, Codrop-style)
        │
        │  user demonstrates interaction
        ▼
RECORDER (recorder.ts)
        │  MutationObserver + click + transitionend
        │  pure DOM observation, no AI
        ▼
BEHAVIOR-SPEC.JSON
        │  8-step semantic description of the interaction
        │
        ├──────────────────────────┐
        ▼                          ▼
IBM BOB                     TARGET APP (light blog)
        │  reads spec               │  existing components
        │  reads target codebase    │  own styling
        └──────────────────────────►
                                   ▼
                        FEATURE TRANSPLANTED
                        same behavior, different app
```

---

## How We Used IBM Bob

IBM Bob was central to this project at two distinct levels:

### 1. Building FeatureGraft itself
Bob scaffolded and iterated on the entire prototype — both the reference app and the target app, the recorder module, the spec generation algorithm, and the graft UI.

### 2. Performing the feature transplant (the core product demo)
This is where Bob is part of the actual product workflow:

1. FeatureGraft records an interaction on the reference app and produces `behavior-spec.json`
2. Bob reads `behavior-spec.json` — a structured 8-step behavioral description
3. Bob inspects `target-app/src/` — reads `ArticleCard.tsx`, `ArticleList.tsx`, `App.tsx`
4. Bob identifies which components need modification to support expand/collapse behavior
5. Bob implements the interaction using the target app's own CSS variables, component structure, and design system — no styles copied from the reference app
6. Bob adds state management (`useState` for `expandedId`), modifies `ArticleCard` props, creates an independent `Backdrop` component, and adds CSS transitions
7. Bob runs the app and resolves TypeScript and build errors

**Bob is not just a code generator here — Bob performs the adaptation between an observed behavior specification and an unfamiliar codebase.** That is the core FeatureGraft value proposition.

---

## What Makes FeatureGraft Different

| | Screenshot-to-code | Website cloning | FeatureGraft |
|---|---|---|---|
| Captures | Appearance | Everything | **Behavior only** |
| Copies source code | No | Yes | **No** |
| Works across different apps | No | No | **Yes** |
| Requires AI for capture | Sometimes | No | **No — pure DOM** |
| AI role | Generate UI | N/A | **Adapt behavior** |

---

## Project Structure

```
featuregraft/
├── reference-app/          # Dark Codrop-style app with expandable cards
│   └── src/
│       ├── recorder.ts     # Generic DOM observer (content-script-ready)
│       ├── App.tsx         # Record/stop UI, spec display
│       ├── Card.tsx        # Expandable card component
│       └── Backdrop.tsx    # Overlay component
│
├── target-app/             # Light blog app — receives the transplanted behavior
│   └── src/
│       ├── App.tsx         # Apply Graft button + before/after state
│       ├── ArticleList.tsx # State management for expand behavior
│       └── ArticleCard.tsx # Card component (static → interactive after graft)
│
├── behavior-spec.json      # Generated by recorder, read by IBM Bob
└── README.md
```

---

## Running Locally

```bash
# Reference app (port 5173)
cd reference-app
npm install
npm run dev

# Target app (port 5174)
cd target-app
npm install
npm run dev
```

---

## The recorder.ts — Content Script Ready

`recorder.ts` is written as a standalone class with no framework dependencies. It can be dropped directly into a Chrome extension as a content script:

```ts
const recorder = new Recorder();
recorder.start(document.body);   // observe entire page
// ... user interacts ...
const events = recorder.stop();
const spec = recorder.generateSpec(events);
// → send spec to extension popup or local server
```

The only reason we run it on our own reference page rather than injecting it into an arbitrary external site is **cross-origin packaging** — the recorder code is identical to what a content script would run.

---

## Future Work

- Chrome extension packaging (manifest v3 content script)
- MCP server: browser extension → Bob via local WebSocket
- VS Code extension: Bob receives spec and opens relevant files automatically
- AI-enhanced spec distillation: LLM summarises noisy event streams into cleaner specs
- Interaction library: sharable community specs for common patterns
- Framework-to-framework transfer: React → Vue, React → Svelte

---

## Submission

**Title:** FeatureGraft  
**Tagline:** Don't describe the feature. Show it.  
**Built at:** IBM Build with BOB — Mini Bob-a-thon  
