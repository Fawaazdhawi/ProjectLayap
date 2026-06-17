import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { defaultNewsData } from '../data/content';

const CARD_BACKGROUNDS = [
  'linear-gradient(145deg, #6b0f0f, #a01515)',
  'linear-gradient(145deg, #1e1b4b, #4338ca)',
  'linear-gradient(145deg, #064e3b, #0f766e)',
  'linear-gradient(145deg, #3b0764, #7c3aed)',
  'linear-gradient(145deg, #7c2d12, #c2410c)',
  'linear-gradient(145deg, #0c1a3d, #1d4ed8)',
];

const WhatsOn = () => {
  const navigate = useNavigate();
  const [news] = useState(defaultNewsData);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const activeIndexRef = useRef(0);
  const resettingRef = useRef(false);
  const inViewRef = useRef(true);

  // Track whether this section is actually visible in the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Duplicate list: [0,1,2,  0,1,2]
  // Scroll through real cards 0→n-1, then scroll to clone-0 (index n),
  // then instantly reset to real card-0 (index 0) — seamless left loop.
  const looped = [...news, ...news];

  const scrollToCard = (domIndex, instant = false) => {
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('[data-card]');
    const card = cards[domIndex];
    if (!card) return;

    const target = Math.max(0, card.offsetLeft + card.offsetWidth / 2 - container.clientWidth / 2);

    if (instant) {
      container.style.scrollSnapType = 'none';
      container.scrollLeft = target;
      requestAnimationFrame(() => {
        container.style.scrollSnapType = 'x mandatory';
      });
    } else {
      // scrollTo on the container — never touches page vertical scroll
      container.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  // Track active card on manual scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const updateActive = () => {
      if (resettingRef.current) return;
      const cards = container.querySelectorAll('[data-card]');
      const centerX = container.scrollLeft + container.clientWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centerX);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      const normalized = closest % news.length;
      activeIndexRef.current = normalized;
      setActiveIndex(normalized);
    };
    container.addEventListener('scroll', updateActive, { passive: true });
    return () => container.removeEventListener('scroll', updateActive);
  }, [news.length]);

  // Auto-advance: always scroll left, loop seamlessly
  useEffect(() => {
    if (news.length <= 1) return;
    const interval = setInterval(() => {
      // Don't touch scroll if user has moved to another section
      if (!inViewRef.current) return;

      const current = activeIndexRef.current;
      const next = current + 1;

      if (next >= news.length) {
        // Smooth-scroll to clone of card 0 (DOM index = news.length)
        scrollToCard(news.length);
        activeIndexRef.current = 0;
        setActiveIndex(0);
        // After smooth scroll settles, silently jump to real card 0
        setTimeout(() => {
          resettingRef.current = true;
          scrollToCard(0, true);
          setTimeout(() => { resettingRef.current = false; }, 80);
        }, 550);
      } else {
        activeIndexRef.current = next;
        setActiveIndex(next);
        scrollToCard(next);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [news.length]);

  const handleDotClick = (i) => {
    activeIndexRef.current = i;
    setActiveIndex(i);
    scrollToCard(i);
  };

  return (
    <section
      id="news"
      ref={sectionRef}
      className="whats-on-section"
      style={{ background: '#0a0a0a', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div
        ref={scrollRef}
        className="whats-on-track"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          touchAction: 'pan-x',
          scrollbarWidth: 'none',
          gap: '14px',
          paddingTop: '20px',
          paddingLeft: '5vw',
          paddingRight: '5vw',
        }}
      >
        {looped.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            data-card={index}
            onClick={() => navigate(`/news/${item.id}`)}
            style={{
              width: '90vw',
              maxWidth: '900px',
              flexShrink: 0,
              scrollSnapAlign: 'center',
              borderRadius: '28px',
              overflow: 'hidden',
              background: CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length],
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
          >
            <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
              <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  draggable="false"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 45%, transparent 72%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  {item.category && (
                    <span style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                      {item.category}
                    </span>
                  )}
                  <p style={{ color: 'white', fontSize: '30px', fontWeight: 700, lineHeight: 1.25, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.title}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/news/${item.id}`); }}
                    style={{ background: 'white', color: 'black', fontSize: '16px', fontWeight: 600, borderRadius: '999px', padding: '10px 24px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' }}
                  >
                    Read more
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div style={{ height: '52px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {news.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.10)', borderRadius: '999px', padding: '9px 14px' }}>
            {news.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                aria-label={`Card ${i + 1}`}
                style={{
                  borderRadius: '999px',
                  background: i === activeIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  width: i === activeIndex ? '20px' : '6px',
                  height: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhatsOn;
