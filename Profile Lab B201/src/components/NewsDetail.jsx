import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { supabase } from '../config/supabase';
import { defaultNewsData } from '../data/content';

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(undefined);

  useEffect(() => {
    if (id.startsWith('default-')) {
      setNews(defaultNewsData.find((n) => n.id === id) ?? null);
      return;
    }
    supabase.from('news').select('*').eq('id', id).single().then(({ data, error }) => {
      setNews(error ? null : data);
    });
  }, [id]);

  if (news === undefined) {
    return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'white' }}>Loading...</div>;
  }

  if (news === null) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'white' }}>
        <h2>News not found</h2>
        <Link to="/" style={{ color: '#c0392b' }}>Back to home</Link>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem 6rem', color: 'white' }}>
      <Link to="/" style={{ color: '#c0392b', display: 'inline-block', marginBottom: '2rem' }}>&larr; Back to home</Link>
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', borderRadius: '16px', marginBottom: '2rem' }}
        />
      )}
      {news.category && (
        <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#c0392b' }}>
          {news.category}
        </span>
      )}
      <h1 style={{ marginTop: '0.75rem', marginBottom: '1.5rem' }}>{news.title}</h1>
      <p style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-wrap' }}>
        {news.content || 'No further details available.'}
      </p>
    </article>
  );
};

export default NewsDetail;
