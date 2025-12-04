import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import '../styles/main.css';

const WhatsOn = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/content?section=whats-on');
      const data = await response.json();
      
      if (response.ok && data.length > 0) {
        // Format data dari API agar sesuai dengan struktur lama
        const formattedNews = data.map((item, index) => ({
          id: item.id,
          type: index === 0 ? 'large' : 'small', // Card pertama besar, sisanya kecil
          image: item.image_url ? `http://localhost:3000${item.image_url}` : item.image_url,
          title: item.title,
          description: item.content || '',
          category: item.category || 'NEWS', // Gunakan category dari API
          path: `/news/${item.id}`
        }));
        setNews(formattedNews);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (path) => {
    if (path) navigate(path);
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  if (loading) return <section className="whats-on-section"><div className="container"><p>Loading...</p></div></section>;

  return (
    <section className="whats-on-section">
      <div className="container">
        <div className="whats-on-header">
          <h2>What's on B201</h2>
          <div className="news-nav-buttons">
            <button onClick={scrollLeft} aria-label="Scroll Left">&lt;</button>
            <button onClick={scrollRight} aria-label="Scroll Right">&gt;</button>
          </div>
        </div>
        <div className="news-scroll-container" ref={scrollContainerRef}>
          {news.map((item) => (
            <div 
              key={item.id} 
              className={`news-card news-card-${item.type}`}
              onClick={() => handleClick(item.path)}
              role="button"
              style={{ cursor: 'pointer' }}
            >
              <img src={item.image} alt={item.title} className="news-card-image" />
              <div className="news-card-overlay"></div>
              <div className="news-card-content">
                {item.type === 'large' ? <h3>{item.title}</h3> : <h4>{item.title}</h4>}
                {item.description && <p>{item.description}</p>}
                <span className="news-card-category">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatsOn;