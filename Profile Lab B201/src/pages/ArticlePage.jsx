import { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { defaultNewsData } from '../data/content';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ArticlePage = () => {
  const { id } = useParams();
  const article = defaultNewsData.find((n) => n.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <>
      <Header />
      <main className="article-page">
        {!article ? (
          <div className="article-state">
            <h1>Article not found</h1>
            <Link to="/" className="article-back">← Back to home</Link>
          </div>
        ) : (
          <article className="article-wrap">
            <Link to="/#news" className="article-back">← Back to News</Link>

            <header className="article-head">
              {article.category && <span className="article-category">{article.category}</span>}
              <h1 className="article-title">{article.title}</h1>
              {article.date && <p className="article-meta">{article.date}</p>}
            </header>

            {article.image && (
              <figure className="article-hero">
                <img src={article.image} alt={article.title} />
              </figure>
            )}

            <div className="article-body">
              {article.content ? (
                article.content
                  .split(/\n\s*\n/)
                  .filter((p) => p.trim())
                  .map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p className="article-empty">No additional details have been published for this article yet.</p>
              )}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ArticlePage;
