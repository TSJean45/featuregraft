import { useRef, useState } from "react";
import "./App.css";
import { Backdrop } from "./Backdrop";
import { Card } from "./Card";
import type { BehaviorSpec } from "./recorder";
import { Recorder } from "./recorder";

const CARDS = [
  {
    id: "c1",
    title: "Motion Design in UI",
    category: "Interaction",
    description:
      "Explore how purposeful animation guides attention, communicates state, and creates spatial metaphors that make interfaces feel alive.",
  },
  {
    id: "c2",
    title: "CSS Grid Mastery",
    category: "Layout",
    description:
      "A deep dive into two-dimensional layout — from named template areas to auto-placement algorithms and subgrid inheritance.",
  },
  {
    id: "c3",
    title: "Component Architecture",
    category: "Engineering",
    description:
      "How to design component APIs that are composable, testable, and resilient to future requirements without over-abstraction.",
  },
  {
    id: "c4",
    title: "The Psychology of Feedback",
    category: "UX Research",
    description:
      "Why response latency, micro-animations, and sound design determine whether users feel confident or confused after every action.",
  },
];

type RecorderState = "idle" | "recording" | "done";

export default function App() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recorderState, setRecorderState] = useState<RecorderState>("idle");
  const [spec, setSpec] = useState<BehaviorSpec | null>(null);
  const [copied, setCopied] = useState(false);
  const recorderRef = useRef<Recorder | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  function startRecording() {
    const recorder = new Recorder();
    recorderRef.current = recorder;
    if (containerRef.current) {
      recorder.start(containerRef.current);
    }
    setSpec(null);
    setRecorderState("recording");
  }

  function stopRecording() {
    if (!recorderRef.current) return;
    const events = recorderRef.current.stop();
    const generated = recorderRef.current.generateSpec(events);
    setSpec(generated);
    setRecorderState("done");
    recorderRef.current = null;

    // Write to root behavior-spec.json via download (Bob will read the file)
    const blob = new Blob([JSON.stringify(generated, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "behavior-spec.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExpand(id: string) {
    setExpandedId(id);
  }

  function handleCollapse() {
    setExpandedId(null);
  }

  async function copySpec() {
    if (!spec) return;
    await navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-dot" />
            <span className="brand-name">FeatureGraft</span>
            <span className="brand-sub">reference layer</span>
          </div>
          <div className="recorder-controls">
            {recorderState === "idle" && (
              <button className="btn btn-record" onClick={startRecording}>
                <span className="rec-dot" /> Record Feature
              </button>
            )}
            {recorderState === "recording" && (
              <button className="btn btn-stop" onClick={stopRecording}>
                <span className="rec-dot active" /> Stop Recording
              </button>
            )}
            {recorderState === "done" && (
              <button className="btn btn-reset" onClick={() => setRecorderState("idle")}>
                Record Again
              </button>
            )}
          </div>
        </div>
        {recorderState === "recording" && (
          <div className="recording-banner">
            🔴 Recording interaction — click a card to expand it, then click the backdrop to dismiss
          </div>
        )}
      </header>

      <main className="main" ref={containerRef}>
        <div className="hero">
          <h1 className="hero-title">Interactions Worth Grafting</h1>
          <p className="hero-sub">
            Click any card to see the expand interaction. Hit <strong>Record Feature</strong> first
            to capture the behavior as a specification.
          </p>
        </div>

        <div className="cards-grid">
          {CARDS.map((card) => (
            <Card
              key={card.id}
              {...card}
              expanded={expandedId === card.id}
              onExpand={handleExpand}
            />
          ))}
        </div>
      </main>

      <Backdrop visible={expandedId !== null} onClick={handleCollapse} />

      {spec && (
        <section className="spec-panel">
          <div className="spec-header">
            <div className="spec-title-row">
              <h2 className="spec-title">
                ✓ Behavior Captured — <code>{spec.featureName}</code>
              </h2>
              <button className="btn btn-copy" onClick={copySpec}>
                {copied ? "Copied!" : "📋 Copy Spec"}
              </button>
            </div>
            <p className="spec-summary">{spec.summary}</p>
          </div>
          <pre className="spec-code">{JSON.stringify(spec, null, 2)}</pre>
          <p className="spec-hint">
            💡 This file was also downloaded as <strong>behavior-spec.json</strong> — move it to
            the monorepo root, then ask IBM Bob to read it and implement equivalent behavior in{" "}
            <code>target-app/</code>.
          </p>
        </section>
      )}
    </div>
  );
}
