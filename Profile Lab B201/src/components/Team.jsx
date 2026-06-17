import React from 'react';
import { teamData } from '../data/content';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const Team = () => {
  const [ref2, isVisible2] = useScrollReveal(0.1);

  return (
    <section className="team-section" id="lectures">
      <div className="container" ref={ref2}>
        <h2 className={`reveal-up ${isVisible2 ? 'active' : ''}`}>
          {teamData.title}
        </h2>
        <div className="team-grid">
          {teamData.teamTeaching.map((member, index) => {
            const cardContent = (
              <>
                <img src={member.image} alt={member.name} className="profile-pic" />
                <h4>{member.name}</h4>
                <p>{member.role}</p>
              </>
            );

            return member.link ? (
              <a
                key={index}
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`team-member-card reveal-card ${isVisible2 ? 'active' : ''}`}
                style={{ transitionDelay: `${150 + index * 80}ms`, textDecoration: 'none', color: 'inherit' }}
              >
                {cardContent}
              </a>
            ) : (
              <div
                key={index}
                className={`team-member-card reveal-card ${isVisible2 ? 'active' : ''}`}
                style={{ transitionDelay: `${150 + index * 80}ms` }}
              >
                {cardContent}
              </div>
            );
          })}
        </div>
        <p
          className={`section-description team-description reveal-up ${isVisible2 ? 'active' : ''}`}
          style={{ transitionDelay: '600ms' }}
        >
          {teamData.teamTeachingDescription}
        </p>
      </div>
    </section>
  );
};

export default Team;
