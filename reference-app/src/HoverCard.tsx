import "./HoverCard.css";

interface HoverCardProps {
  id: string;
  title: string;
  category: string;
  stat: string;
  statLabel: string;
  previewText: string;
}

export function HoverCard({ title, category, stat, statLabel, previewText }: HoverCardProps) {
  return (
    <div className="hover-card">
      <div className="hover-card-front">
        <span className="hover-card-category">{category}</span>
        <h3 className="hover-card-title">{title}</h3>
        <div className="hover-card-stat">
          <span className="stat-value">{stat}</span>
          <span className="stat-label">{statLabel}</span>
        </div>
        <span className="hover-hint">Hover to preview ↗</span>
      </div>
      <div className="hover-card-preview">
        <p className="preview-text">{previewText}</p>
        <span className="preview-label">— live preview on hover</span>
      </div>
    </div>
  );
}
