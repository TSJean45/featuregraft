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
  {
    id: "a5",
    title: "Accessibility Is Not a Checklist",
    author: "Priya Nair",
    date: "Apr 15, 2025",
    tag: "Accessibility",
    excerpt:
      "WCAG compliance is the floor, not the ceiling. Real accessibility means designing for the full spectrum of how people experience your product.",
    body: "Screen readers, keyboard navigation, and color contrast ratios matter. But so does cognitive load, motor impairments, and situational disabilities — like using your phone in bright sunlight one-handed. Accessibility audits catch violations. Accessibility design anticipates them. The shift from reactive to proactive is what separates compliant products from genuinely inclusive ones.",
  },
  {
    id: "a6",
    title: "The Great State Management Rethink",
    author: "Jonas Weber",
    date: "Mar 28, 2025",
    tag: "Engineering",
    excerpt:
      "From Redux to Zustand to server state — why the pendulum swung and where it's settling in 2025.",
    body: "Redux wasn't wrong. It was just used for everything, including things it was never designed for. Server state (React Query, SWR) handles async data. Local UI state belongs in components. Global client state is often much smaller than we thought. The result is less boilerplate, better colocation, and dramatically simpler mental models. The lesson isn't 'Redux bad' — it's 'right tool, right scope'.",
  },
  {
    id: "a7",
    title: "Designing with Real Data",
    author: "Ama Asante",
    date: "Mar 10, 2025",
    tag: "UX Research",
    excerpt:
      "Mockups with Lorem Ipsum lie. How testing with production-realistic data catches an entire category of UI bugs before they ship.",
    body: "A username field that fits 'John Doe' breaks with 'Bartholomäus Klingelschmitt'. A price that fits '$9.99' overflows at '$1,249,999.99'. Edge cases aren't edge cases when they represent real users. Designing with realistic data — long strings, empty states, maximum values — surfaces layout bugs, truncation issues, and hierarchy problems that pixel-perfect Figma mocks will never reveal.",
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
