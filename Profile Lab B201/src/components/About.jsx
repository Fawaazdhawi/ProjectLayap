import { aboutData } from '../data/content';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const About = () => {
  const [ref, isVisible] = useScrollReveal(0.1);

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '420px',
        height: '55vh',
        maxHeight: '580px',
      }}
    >
      {/* Static background */}
      <img
        src="/images/Kondisi_lab1.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.62)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        className={`container reveal-up ${isVisible ? 'active' : ''}`}
        ref={ref}
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 0',
        }}
      >
        <div style={{ borderLeft: '4px solid #c0392b', paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>
          <h2 style={{ color: '#fff', lineHeight: 1.2, marginBottom: '0.5rem' }}>
            Welcome to<br />B201 Lab
          </h2>
        </div>

        <p
          style={{
            color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.8,
            fontSize: '1rem',
            maxWidth: '560px',
          }}
        >
          {aboutData.description}
        </p>
      </div>
    </section>
  );
};

export default About;
