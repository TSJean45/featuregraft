import { useState } from "react";
import type { Article } from "./ArticleCard";
import { ArticleCard } from "./ArticleCard";
import "./ArticleList.css";

// Backdrop — independent implementation, NOT copied from reference app
function Backdrop({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="article-backdrop"
      onClick={onDismiss}
      aria-label="Close article"
    />
  );
}

const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "The Hidden Cost of Slow Interfaces",
    author: "Maya Okafor",
    date: "Jun 12, 2025",
    tag: "Performance",
    excerpt:
      "Every 100ms of added latency costs 1% of user engagement. We examined how response time affects trust, retention, and revenue across three product categories.",
    body: "In a study across e-commerce, SaaS, and media platforms, we found that latency above 200ms consistently correlated with lower conversion and higher abandonment. The mechanism isn't purely rational — users interpret slowness as a signal of unreliability. Perceived performance is as important as measured performance. Techniques like optimistic UI, skeleton screens, and instant feedback loops address the perception gap even before the data arrives.",
  },
  {
    id: "a2",
    title: "Designing for Uncertainty",
    author: "Luca Ferretti",
    date: "May 28, 2025",
    tag: "UX Research",
    excerpt:
      "Users don't just want answers — they want confidence. Here's how progressive disclosure and honest system states build trust in complex tools.",
    body: "The most frustrating interfaces aren't slow ones — they're opaque ones. When a system can't tell users what it's doing or why, uncertainty fills the gap. Progressive disclosure, clear loading states, and honest error messages aren't just UX polish — they're trust infrastructure. In complex tools like data pipelines or AI assistants, the difference between 'processing…' and 'analyzing 2,400 records across 3 data sources' is the difference between anxiety and confidence.",
  },
  {
    id: "a3",
    title: "When to Break the Grid",
    author: "Sana Nakamura",
    date: "May 14, 2025",
    tag: "Visual Design",
    excerpt:
      "Grids create harmony. Strategic violations create emphasis. The difference between a chaotic layout and a bold one is intentionality.",
    body: "Every design system worth using has a grid. But the designers who produce memorable layouts know when to violate it. A full-bleed image that ignores the column structure, a headline that bleeds into the margin, a card that spans an unexpected number of columns — these violations work because they contrast against an established order. Chaos without a system is just noise. Chaos within a system is emphasis.",
  },
  {
    id: "a4",
    title: "Composable Systems at Scale",
    author: "Eli Rosenberg",
    date: "Apr 30, 2025",
    tag: "Engineering",
    excerpt:
      "How we refactored a 200-component design system into primitives that compose predictably — and what we'd do differently if starting over today.",
    body: "The warning sign was when adding a new variant to Button required changing seven files. We had built a component library, not a component system. The refactor replaced monolithic components with small, single-responsibility primitives: a Pressable, a Text, a Surface. Compositions of these primitives replaced the original components entirely. The result was fewer components, more flexibility, and — counterintuitively — easier onboarding for new engineers.",
  },
];

export function ArticleList({ interactive }: { interactive: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleExpand(id: string) {
    if (!interactive) return;
    setExpandedId(id);
  }

  function handleCollapse() {
    setExpandedId(null);
  }

  return (
    <>
      {expandedId && <Backdrop onDismiss={handleCollapse} />}
      <div className="article-list">
        {ARTICLES.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            expanded={expandedId === article.id}
            interactive={interactive}
            onExpand={handleExpand}
          />
        ))}
      </div>
    </>
  );
}
