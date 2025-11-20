import React from 'react';
import { teamData } from '../data/content';
import '../styles/main.css';

const Team = () => {
  return (
    <section className="team-section" id="lectures">
      <div className="container">
        <h2>{teamData.title}</h2>
        <div className="team-grid">
          {teamData.members.map((member, index) => (
            <div key={index} className="team-member-card">
              <img src={member.image} alt={member.name} className="profile-pic" />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
        <p className="section-description team-description">{teamData.description}</p>
      </div>

      <div className="container">
        <h2 style={{ marginTop: '50px' }}>{teamData.teamTeachingTitle}</h2>
        <div className="team-grid">
          {teamData.teamTeaching.map((member, index) => (
            <div key={index} className="team-member-card">
              <img src={member.image} alt={member.name} className="profile-pic" />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
        <p className="section-description team-description">{teamData.teamTeachingDescription}</p>
      </div>
    </section>
  );
};

export default Team;