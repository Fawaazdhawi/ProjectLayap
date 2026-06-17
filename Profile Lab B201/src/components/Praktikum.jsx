import React from 'react';
import { praktikumData } from '../data/content';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const Praktikum = () => {
  const [sectionRef, isVisible] = useScrollReveal(0.1);

  return (
    <section className="praktikum-section" id="practicum">
      <div className="container" ref={sectionRef}>
        <h2 className={`reveal-up ${isVisible ? 'active' : ''}`}>{praktikumData.title}</h2>
        <div className="praktikum-grid">
          {praktikumData.courses.map((course, index) => (
            <div
              key={index}
              className={`praktikum-card reveal-card ${isVisible ? 'active' : ''}`}
              style={{ transitionDelay: `${150 + index * 150}ms` }}
            >
              <img src={course.image} alt={course.title} className="praktikum-img" />
              <h4>{course.title}</h4>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
        <p
          className={`section-description reveal-up ${isVisible ? 'active' : ''}`}
          style={{ transitionDelay: '500ms' }}
        >
          {praktikumData.description}
        </p>
      </div>
    </section>
  );
};

export default Praktikum;
