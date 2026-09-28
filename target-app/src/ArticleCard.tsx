import "./ArticleCard.css";

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  tag: string;
  excerpt: string;
  body?: string;
}

interface ArticleCardProps {
  article: Article;
  expanded: boolean;
  interactive: boolean;
  hoverInteractive: boolean;
  onExpand: (id: string) => void;
}

export function ArticleCard({ article, expanded, interactive, hoverInteractive, onExpand }: ArticleCardProps) {
  const classes = [
    "article-card",
    expanded ? "expanded" : "",
    interactive ? "interactive" : "",
    hoverInteractive ? "hover-interactive" : "",
  ].filter(Boolean).join(" ");

  return (
    <article
      className={classes}
      onClick={() => { if (!expanded && interactive) onExpand(article.id); }}
      data-card-id={article.id}
    >
      <div className="article-front">
        <div className="article-tag">{article.tag}</div>
        <h2 className="article-title">{article.title}</h2>
        <p className="article-excerpt">{article.excerpt}</p>
        <div className="article-meta">
          <span className="article-author">{article.author}</span>
          <span className="article-sep">·</span>
          <span className="article-date">{article.date}</span>
        </div>
      </div>
      {hoverInteractive && (
        <div className="article-hover-preview">
          <p className="article-hover-body">{article.body}</p>
          <span className="article-hover-label">hover preview — grafted from hover-spec.json</span>
        </div>
      )}
      {expanded && (
        <div className="article-expanded-body">
          <p>{article.body}</p>
          <div className="article-close-hint">Click outside to close</div>
        </div>
      )}
    </article>
  );
}
