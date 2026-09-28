import { useState } from "react";
import "./App.css";
import { ArticleList } from "./ArticleList";

const EXPAND_STEPS = [
  "📖 Reading behavior-spec.json…",
  "🔍 Inspecting target codebase…",
  "🎨 Deriving CSS from styleHints…",
  "⚙️ Implementing expand interaction…",
];

const HOVER_STEPS = [
  "📖 Reading hover-spec.json…",
  "🔍 Inspecting ArticleCard component…",
  "🎨 Deriving hover transition from styleHints…",
  "⚙️ Implementing hover preview panel…",
];

export default function App() {
  const [grafted, setGrafted] = useState(false);
  const [grafting, setGrafting] = useState(false);
  const [hoverGrafted, setHoverGrafted] = useState(false);
  const [hoverGrafting, setHoverGrafting] = useState(false);
  const [graftStep, setGraftStep] = useState(0);
  const [hoverGraftStep, setHoverGraftStep] = useState(0);

  function runGraft(
    steps: string[],
    setStep: (n: number) => void,
    setRunning: (b: boolean) => void,
    setDone: (b: boolean) => void
  ) {
    setRunning(true);
    setStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setStep(step);
      } else {
        clearInterval(interval);
        setRunning(false);
        setDone(true);
      }
    }, 600);
  }

  function applyGraft() {
    runGraft(EXPAND_STEPS, setGraftStep, setGrafting, setGrafted);
  }

  function applyHoverGraft() {
    runGraft(HOVER_STEPS, setHoverGraftStep, setHoverGrafting, setHoverGrafted);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-name">The Brief</span>
            <span className="brand-tag">target app</span>
          </div>
          <div className="graft-controls">
            {!grafted && !grafting && (
              <button className="btn-graft" onClick={applyGraft}>
                ⚡ Graft Expand
              </button>
            )}
            {grafting && (
              <span className="graft-status grafting">
                <span className="graft-spinner" /> {EXPAND_STEPS[graftStep]}
              </span>
            )}
            {grafted && !hoverGrafted && !hoverGrafting && (
              <button className="btn-graft btn-graft-hover" onClick={applyHoverGraft}>
                ⚡ Graft Hover Preview
              </button>
            )}
            {hoverGrafting && (
              <span className="graft-status grafting">
                <span className="graft-spinner" /> {HOVER_STEPS[hoverGraftStep]}
              </span>
            )}
            {grafted && (
              <span className="graft-status done">
                ✓ {hoverGrafted ? "2 behaviors grafted" : "Expand grafted"}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="page-hero">
          <h1 className="page-title">Latest Articles</h1>
          <p className="page-sub">
            {grafted
              ? "Expandable card interaction transplanted from behavior-spec.json by IBM Bob."
              : "A clean reading list. Cards are static — no interactions yet."}
          </p>
        </div>
        <ArticleList interactive={grafted} hoverInteractive={hoverGrafted} />
      </main>
    </div>
  );
}
