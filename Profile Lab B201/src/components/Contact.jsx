import React, { useState, useEffect } from 'react';
import { contactData } from '../data/content';
import { supabase } from '../config/supabase';
import '../styles/main.css';

const Contact = () => {
  const [details, setDetails] = useState(contactData.details);

  useEffect(() => {
    const fetchDetails = async () => {
      const { data, error } = await supabase
        .from('contact_details')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error) setDetails(data && data.length > 0 ? data : contactData.details);
    };
    fetchDetails();

    const channel = supabase
      .channel('public:contact_details')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_details' }, fetchDetails)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <section className="contact-section">
      <div className="container contact-container">
        <h2>{contactData.title}</h2>
        <div className="contact-content-grid">
          <div className="contact-details">
            {details.map((detail, index) => (
              <div key={detail.id ?? index} className="contact-box">
                <img
                  src={detail.icon}
                  alt={`${detail.label} icon`}
                  className="contact-icon"
                />

                  <p className="contact-label">{detail.label}</p>
                  <p className="contact-value">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
