# FeatureGraft

> **Don't describe the feature. Show it.**

You ever see a sick interaction on another app and think "I want that in mine"? So you spend an hour writing a prompt describing every tiny detail — and it still doesn't quite work. FeatureGraft skips that entirely. You demonstrate the interaction once, and IBM Bob implements it in your codebase.

**Behavior transplanted. CSS derived from scratch. No source code stolen.**

---

## The Problem

```
See feature you like
  → try to describe it in words
  → miss half the edge cases
  → AI gets it wrong
  → repeat 6 times
```

The issue is that a screenshot captures *appearance*. A text description misses implicit rules. Neither captures *state transitions* — what actually happens when you click, drag, hover, release.

## The Solution

FeatureGraft has two layers:

**1. Capture layer — `recorder.ts`**  
A generic DOM observer (same code as a Chrome extension content script). It watches:
- `MutationObserver` — class changes, DOM additions/removals  
- `click` events — with target context  
- `transitionend` — with live computed styles captured at transition time  

No AI, no screenshots. Pure deterministic browser observation.

**2. Adaptation layer — IBM Bob**  
Bob reads `behavior-spec.json` + your codebase. Understands your components. Implements equivalent behavior using your own CSS variables and component structure. The `styleHints` block in the spec tells Bob the *intent* — Bob derives the actual CSS for your app.

---

## Demo

**Reference app** (dark, Codrop-style) → **Record** → interact → **Stop** → spec generated live

```json
{
  "featureName": "Expandable Card with Overlay",
  "styleHints": {
    "transitionDuration": "0.32s",
    "expandedElevation": "z-index: 100",
    "overlay": "fixed full-page backdrop, semi-transparent dark",
    "expandedSize": "~680px wide, centered, max 80vh"
  },
  "steps": [
    { "step": 1, "action": "click", "effect": "triggers expand — \"Motion Design in UI\"" },
    { "step": 2, "action": "class_added", "value": "expanded" },
    { "step": 3, "action": "element_appeared", "target": "div.backdrop" },
    { "step": 4, "action": "style_transition", "effect": "card expands to center" },
    { "step": 5, "action": "click", "target": "div.backdrop", "effect": "dismiss" },
    { "step": 6, "action": "class_removed", "value": "expanded" },
    { "step": 7, "action": "element_disappeared", "target": "div.backdrop" },
    { "step": 8, "action": "style_transition", "effect": "card collapses back" }
  ]
}
```

**Target app** (light blog) → click **⚡ Apply Graft** → Bob reads spec → derives CSS → injects behavior → same interaction, different app.

---

## Architecture

```
REFERENCE APP (dark, Codrop-style)
        │
        │  user demonstrates interaction
        ▼
recorder.ts
  MutationObserver + click + transitionend
  captures live computed styles at transition time
        │
        ▼
behavior-spec.json
  steps[]  +  styleHints{}
        │
        ├─────────────────────────┐
        ▼                         ▼
IBM BOB                     TARGET APP
  reads spec                  own components
  reads codebase              own CSS variables
  derives CSS from styleHints
        └─────────────────────────►
                                  ▼
                       FEATURE TRANSPLANTED
```

---

## How We Used IBM Bob

Two distinct roles:

**Building FeatureGraft**  
Bob scaffolded and iterated on the entire prototype — both apps, the recorder, the spec algorithm, the graft UI, the multi-step animation.

**The actual feature transplant**  
This is where Bob is part of the product, not just the toolchain:

1. FeatureGraft records an interaction → produces `behavior-spec.json` with `steps[]` and `styleHints{}`
2. Bob reads the spec
3. Bob reads `target-app/src/` — `ArticleCard.tsx`, `ArticleList.tsx`, `App.tsx`
4. Bob identifies which components need modifying
5. Bob derives CSS from `styleHints` using the target app's own design tokens — not copying from the reference app
6. Bob adds `useState` for expand state, modifies `ArticleCard` props, creates an independent `Backdrop` component
7. Bob runs the app, fixes TypeScript errors, confirms it works

Bob isn't generating boilerplate here. Bob is performing the adaptation between an observed behavior spec and a foreign codebase. That's the core FeatureGraft value.

---

## What Makes It Different

| | Screenshot-to-code | Website cloning | FeatureGraft |
|---|---|---|---|
| Captures | Appearance | Everything | **Behavior + style intent** |
| CSS source | Copied | Copied | **Derived fresh for target** |
| Works across different apps | No | No | **Yes** |
| Copies source code | No | Yes | **No** |

---

## Project Structure

```
featuregraft/
├── reference-app/          # Dark Codrop-style, 8 expandable cards
│   └── src/recorder.ts     # Generic DOM observer — content-script-ready
│
├── target-app/             # Light blog, 7 articles
│   └── src/App.tsx         # ⚡ Apply Graft button with multi-step animation
│
├── behavior-spec.json      # Example spec — generated by recorder, read by Bob
└── README.md
```

## Running Locally

```bash
# Reference app — port 5173
cd reference-app && npm install && npm run dev

# Target app — port 5174
cd target-app && npm install && npm run dev -- --port 5174
```

---

## The recorder is content-script-ready

Drop `recorder.ts` into a Chrome extension manifest v3 content script and it works on any site:

```ts
const recorder = new Recorder();
recorder.start(document.body);
// user interacts with the page...
const events = recorder.stop();
const spec = recorder.generateSpec(events);
// send spec to extension popup → to Bob
```

The reference app exists because cross-origin packaging takes time we didn't have in 30 minutes. The recorder code is identical.

---

## Future Work

- Chrome extension (content script is already written — just needs packaging)
- MCP server: extension → Bob via local WebSocket, zero file transfer
- AI-enhanced distillation: LLM cleans up noisy event streams
- Interaction library: community-shared behavior specs
- Framework transfer: React → Vue, React → Svelte

---

**Built at IBM Build with BOB — Mini Bob-a-thon**  
*Don't describe the feature. Show it.*
