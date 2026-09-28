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
  onExpand: (id: string) => void;
}

export function ArticleCard({ article, expanded, interactive, onExpand }: ArticleCardProps) {
  return (
    <article
      className={`article-card${expanded ? " expanded" : ""}${interactive ? " interactive" : ""}`}
      onClick={() => { if (!expanded && interactive) onExpand(article.id); }}
      data-card-id={article.id}
    >
      <div className="article-tag">{article.tag}</div>
      <h2 className="article-title">{article.title}</h2>
      <p className="article-excerpt">{article.excerpt}</p>
      <div className="article-meta">
        <span className="article-author">{article.author}</span>
        <span className="article-sep">·</span>
        <span className="article-date">{article.date}</span>
      </div>
      {expanded && (
        <div className="article-expanded-body">
          <p>{article.body}</p>
          <div className="article-close-hint">Click outside to close</div>
        </div>
      )}
    </article>
  );
}
