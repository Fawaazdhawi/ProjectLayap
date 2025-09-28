import React from 'react';
import { praktikumData } from '../data/content';
import '../styles/main.css';

const Praktikum = () => {
  return (
    <section className="praktikum-section" id="practicum">
      <div className="container">
        <h2>{praktikumData.title}</h2>
        <div className="praktikum-grid">
          {praktikumData.courses.map((course, index) => (
            <div key={index} className="praktikum-card">
              <img src={course.image} alt={course.title} className="praktikum-img" />
              <h4>{course.title}</h4>
              <p>{course.description}</p>
            </div>
          ))}
        </div>
        <p className="section-description">{praktikumData.description}</p>
      </div>
    </section>
  );
};

export default Praktikum;