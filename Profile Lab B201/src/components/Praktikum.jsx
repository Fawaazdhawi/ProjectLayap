import React, { useState, useEffect } from 'react';
import { praktikumData } from '../data/content';
import { supabase } from '../config/supabase';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/main.css';

const Praktikum = () => {
  const [sectionRef, isVisible] = useScrollReveal(0.1);
  const [settings, setSettings] = useState(null);
  const [courses, setCourses] = useState(praktikumData.courses);

  useEffect(() => {
    let mounted = true;
    supabase.from('site_settings').select('*').single().then(({ data, error }) => {
      if (!error && mounted) setSettings(data);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const fetchPracticums = async () => {
      const { data, error } = await supabase
        .from('practicums')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setCourses(data && data.length > 0 ? data : praktikumData.courses);
    };
    fetchPracticums();

    const channel = supabase
      .channel('public:practicums')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'practicums' }, fetchPracticums)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <section className="praktikum-section" id="practicum">
      <div className="container" ref={sectionRef}>
        <h2 className={`reveal-up ${isVisible ? 'active' : ''}`}>
          {settings?.practicum_title ?? praktikumData.title}
        </h2>
        <div className="praktikum-grid">
          {courses.map((course, index) => (
            <div
              key={course.id ?? index}
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
          {settings?.practicum_description ?? praktikumData.description}
        </p>
      </div>
    </section>
  );
};

export default Praktikum;
