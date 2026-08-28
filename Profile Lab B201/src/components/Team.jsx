import React, { useState, useEffect } from 'react';
import { teamData } from '../data/content';
import { supabase } from '../config/supabase';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const Team = () => {
  const [ref2, isVisible2] = useScrollReveal(0.1);
  const [settings, setSettings] = useState(null);
  const [lecturers, setLecturers] = useState(teamData.teamTeaching);
  const [assistants, setAssistants] = useState(teamData.members);

  useEffect(() => {
    let mounted = true;
    supabase.from('site_settings').select('*').single().then(({ data, error }) => {
      if (!error && mounted) setSettings(data);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const fetchLecturers = async () => {
      const { data, error } = await supabase
        .from('team_lecturers')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error) setLecturers(data && data.length > 0 ? data : teamData.teamTeaching);
    };
    fetchLecturers();

    const channel = supabase
      .channel('public:team_lecturers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_lecturers' }, fetchLecturers)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    const fetchAssistants = async () => {
      const { data, error } = await supabase
        .from('team_assistants')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error) setAssistants(data && data.length > 0 ? data : teamData.members);
    };
    fetchAssistants();

    const channel = supabase
      .channel('public:team_assistants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_assistants' }, fetchAssistants)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <section className="team-section" id="lectures">
      <div className="container" ref={ref2}>
        <h2 className={`reveal-up ${isVisible2 ? 'active' : ''}`}>
          {settings?.team_title ?? teamData.title}
        </h2>

        <h3 className={`reveal-up ${isVisible2 ? 'active' : ''}`}>
          {settings?.team_lecturers_title ?? teamData.teamTeachingTitle}
        </h3>
        <div className="team-grid">
          {lecturers.map((member, index) => (
            <div
              key={member.id ?? index}
              className={`team-member-card reveal-card ${isVisible2 ? 'active' : ''}`}
              style={{ transitionDelay: `${150 + index * 80}ms` }}
            >
              <img src={member.image} alt={member.name} className="profile-pic" />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
        <p
          className={`section-description team-description reveal-up ${isVisible2 ? 'active' : ''}`}
          style={{ transitionDelay: '600ms' }}
        >
          {settings?.team_teaching_description ?? teamData.teamTeachingDescription}
        </p>

        <h3 className={`reveal-up ${isVisible2 ? 'active' : ''}`}>
          {settings?.team_assistants_title ?? 'Lab Assistants'}
        </h3>
        <div className="team-grid">
          {assistants.map((member, index) => (
            <div
              key={member.id ?? index}
              className={`team-member-card reveal-card ${isVisible2 ? 'active' : ''}`}
              style={{ transitionDelay: `${150 + index * 80}ms` }}
            >
              <img src={member.image} alt={member.name} className="profile-pic" />
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
