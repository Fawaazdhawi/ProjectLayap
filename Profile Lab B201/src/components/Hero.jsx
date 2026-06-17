import '../styles/main.css';

const Hero = () => {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="container hero-container">
        <div className="hero-left">
          <span className="hero-eyebrow">LAB B201 · Institut Teknologi Sepuluh Nopember</span>
          <h1 className="hero-title">
            Telematics &<br />
            Intelligent<br />
            Multimedia<br />
            Laboratory
          </h1>
          <p className="hero-sub">
            Research and education in deep learning, game technology,
            multimedia processing, and computer networks.
          </p>
          <div className="hero-ctas">
            <a href="#about" className="hero-cta-primary">Explore Lab</a>
            <a href="#news" className="hero-cta-secondary">What's On</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-stat">
            <span className="hero-stat-number">4</span>
            <span className="hero-stat-label">Research Domains</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">2</span>
            <span className="hero-stat-label">Practicum Courses</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">ITS</span>
            <span className="hero-stat-label">Surabaya</span>
          </div>
        </div>
      </div>
      <a href="#about" className="hero-scroll" aria-label="Scroll to content">
        <span className="hero-scroll-line" />
        <span>scroll</span>
      </a>
    </section>
  );
};

export default Hero;
