import { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import '../../styles/edit2.css';

const EMPTY_FORM = {
  logo_url: '', lab_title: '', lab_subtitle: '',
  about_heading_line1: '', about_heading_line2: '', about_description: '', about_background_image: '',
  video_heading: '', video_subtitle: '', video_url: '', culture_title: '',
  whatwedo_title: '', whatwedo_description: '',
  team_title: '', team_lecturers_title: '', team_assistants_title: '', team_teaching_description: '',
  practicum_title: '', practicum_description: '',
  footer_text: '',
};

const AdminSiteSettings = () => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [aboutBgFile, setAboutBgFile] = useState(null);
  const [aboutBgPreview, setAboutBgPreview] = useState(null);
  const logoInputRef = useRef(null);
  const aboutBgInputRef = useRef(null);
  const { toast, showToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (!error && data) {
        setFormData({ ...EMPTY_FORM, ...data });
        setLogoPreview(data.logo_url);
        setAboutBgPreview(data.about_background_image);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const set = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleAboutBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAboutBgFile(file);
      setAboutBgPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const filePath = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('site-settings').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('site-settings').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...formData };
      if (logoFile) payload.logo_url = await uploadImage(logoFile);
      if (aboutBgFile) payload.about_background_image = await uploadImage(aboutBgFile);

      const { error } = await supabase.from('site_settings').update(payload).eq('id', 1);
      if (error) throw error;
      showToast('Settings saved successfully');
      setLogoFile(null);
      setAboutBgFile(null);
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '720px', margin: '0 auto' }}>

        <h2>Header</h2>
        <div className="form-group">
          <label className="form-label">Logo</label>
          <div
            className="image-upload-box"
            style={{ height: '140px', maxWidth: '220px' }}
            onClick={() => logoInputRef.current.click()}
          >
            {logoPreview ? (
              <img src={logoPreview} className="image-preview" alt="Logo preview" />
            ) : (
              <>
                <ImageIcon size={40} style={{ color: '#888' }} />
                <span style={{ color: '#888' }}>Add Logo</span>
              </>
            )}
          </div>
          <input type="file" hidden ref={logoInputRef} onChange={handleLogoChange} accept="image/*" />
        </div>
        <div className="form-group">
          <label className="form-label">Lab Title</label>
          <input name="lab_title" className="modal-input" value={formData.lab_title} onChange={set('lab_title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Lab Subtitle</label>
          <input name="lab_subtitle" className="modal-input" value={formData.lab_subtitle} onChange={set('lab_subtitle')} />
        </div>

        <h2>About</h2>
        <div className="form-group">
          <label className="form-label">Background Image</label>
          <div
            className="image-upload-box"
            style={{ height: '160px', maxWidth: '320px' }}
            onClick={() => aboutBgInputRef.current.click()}
          >
            {aboutBgPreview ? (
              <img src={aboutBgPreview} className="image-preview" alt="About background preview" />
            ) : (
              <>
                <ImageIcon size={40} style={{ color: '#888' }} />
                <span style={{ color: '#888' }}>Add Background</span>
              </>
            )}
          </div>
          <input type="file" hidden ref={aboutBgInputRef} onChange={handleAboutBgChange} accept="image/*" />
        </div>
        <div className="form-group">
          <label className="form-label">Heading Line 1</label>
          <input name="about_heading_line1" className="modal-input" value={formData.about_heading_line1} onChange={set('about_heading_line1')} />
        </div>
        <div className="form-group">
          <label className="form-label">Heading Line 2</label>
          <input name="about_heading_line2" className="modal-input" value={formData.about_heading_line2} onChange={set('about_heading_line2')} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="about_description" className="modal-textarea" value={formData.about_description} onChange={set('about_description')} />
        </div>

        <h2>Video &amp; Culture</h2>
        <div className="form-group">
          <label className="form-label">Video Heading</label>
          <input name="video_heading" className="modal-input" value={formData.video_heading} onChange={set('video_heading')} />
        </div>
        <div className="form-group">
          <label className="form-label">Video Subtitle</label>
          <input name="video_subtitle" className="modal-input" value={formData.video_subtitle} onChange={set('video_subtitle')} />
        </div>
        <div className="form-group">
          <label className="form-label">Video Embed URL</label>
          <input name="video_url" className="modal-input" value={formData.video_url} onChange={set('video_url')} />
        </div>
        <div className="form-group">
          <label className="form-label">Culture Section Title</label>
          <input name="culture_title" className="modal-input" value={formData.culture_title} onChange={set('culture_title')} />
        </div>

        <h2>What We Do</h2>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input name="whatwedo_title" className="modal-input" value={formData.whatwedo_title} onChange={set('whatwedo_title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Intro Description</label>
          <textarea name="whatwedo_description" className="modal-textarea" value={formData.whatwedo_description} onChange={set('whatwedo_description')} />
        </div>

        <h2>Team</h2>
        <div className="form-group">
          <label className="form-label">Section Title</label>
          <input name="team_title" className="modal-input" value={formData.team_title} onChange={set('team_title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Lecturers List Title</label>
          <input name="team_lecturers_title" className="modal-input" value={formData.team_lecturers_title} onChange={set('team_lecturers_title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Lab Assistants List Title</label>
          <input name="team_assistants_title" className="modal-input" value={formData.team_assistants_title} onChange={set('team_assistants_title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Teaching Team Description</label>
          <textarea name="team_teaching_description" className="modal-textarea" value={formData.team_teaching_description} onChange={set('team_teaching_description')} />
        </div>

        <h2>Practicum</h2>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input name="practicum_title" className="modal-input" value={formData.practicum_title} onChange={set('practicum_title')} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="practicum_description" className="modal-textarea" value={formData.practicum_description} onChange={set('practicum_description')} />
        </div>

        <h2>Footer</h2>
        <div className="form-group">
          <label className="form-label">Footer Text</label>
          <input name="footer_text" className="modal-input" value={formData.footer_text} onChange={set('footer_text')} />
        </div>

        <button type="submit" className="btn-publish" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Settings'}
        </button>
      </form>

      <Toast toast={toast} />
    </div>
  );
};

export default AdminSiteSettings;
