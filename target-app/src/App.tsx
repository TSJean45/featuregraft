import { useState } from "react";
import "./App.css";
import { ArticleList } from "./ArticleList";

export default function App() {
  const [grafted, setGrafted] = useState(false);
  const [grafting, setGrafting] = useState(false);

  const GRAFT_STEPS = [
    "📖 Reading behavior-spec.json…",
    "🔍 Inspecting target codebase…",
    "🎨 Deriving CSS from styleHints…",
    "⚙️ Implementing interaction…",
    "✓ Behavior grafted",
  ];
  const [graftStep, setGraftStep] = useState(0);

  function applyGraft() {
    setGrafting(true);
    setGraftStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < GRAFT_STEPS.length - 1) {
        setGraftStep(step);
      } else {
        clearInterval(interval);
        setGrafting(false);
        setGrafted(true);
      }
    }, 600);
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
                ⚡ Apply Graft
              </button>
            )}
            {grafting && (
              <span className="graft-status grafting">
                <span className="graft-spinner" /> {GRAFT_STEPS[graftStep]}
              </span>
            )}
            {grafted && (
              <span className="graft-status done">
                ✓ Behavior grafted
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
        <ArticleList interactive={grafted} />
      </main>
    </div>
  );
}
