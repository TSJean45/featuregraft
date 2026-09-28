import "./Card.css";

interface CardProps {
  id: string;
  title: string;
  category: string;
  description: string;
  expanded: boolean;
  onExpand: (id: string) => void;
}

export function Card({ id, title, category, description, expanded, onExpand }: CardProps) {
  return (
    <article
      className={`card${expanded ? " expanded" : ""}`}
      onClick={() => { if (!expanded) onExpand(id); }}
      data-card-id={id}
    >
      <div className="card-inner">
        <span className="card-category">{category}</span>
        <h2 className="card-title">{title}</h2>
        <p className="card-desc">{description}</p>
        {expanded && (
          <div className="card-expanded-content">
            <p className="card-body">
              This interaction was captured live by FeatureGraft's recorder. The recorder observed
              the click trigger, the class mutation, the backdrop appearing, and the CSS transition —
              all without any prior knowledge of this component's implementation.
            </p>
            <p className="card-body">
              The behavior specification it produced describes <em>what happens</em>, not <em>how it was built</em>.
              IBM Bob can now read that spec and recreate equivalent behavior in any target application.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
