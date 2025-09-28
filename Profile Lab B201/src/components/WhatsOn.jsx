import React, { useRef } from 'react';
import { whatsOnData } from '../data/content';
import '../styles/main.css';

const WhatsOn = () => {
  const scrollContainerRef = useRef(null);

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

  return (
    <section className="whats-on-section">
      <div className="container">
        <div className="whats-on-header">
          <h2>{whatsOnData.title}</h2>
          <div className="news-nav-buttons">
            <button onClick={scrollLeft} aria-label="Scroll Left">&lt;</button>
            <button onClick={scrollRight} aria-label="Scroll Right">&gt;</button>
          </div>
        </div>
        <div className="news-scroll-container" ref={scrollContainerRef}>
          {whatsOnData.news.map((item, index) => (
            <div key={index} className={`news-card news-card-${item.type}`}>
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