import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import '../../styles/edit2.css';

const TABS = {
  lecturers: { table: 'team_lecturers', folder: 'lecturers', label: 'Lecturers' },
  assistants: { table: 'team_assistants', folder: 'assistants', label: 'Lab Assistants' },
};

const EMPTY_FORM = { name: '', role: '', sort_order: 1 };

const AdminTeam = () => {
  const [activeTab, setActiveTab] = useState('lecturers');
  const cfg = TABS[activeTab];

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const fileInputRef = useRef(null);
  const { toast, showToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from(cfg.table)
        .select('*')
        .order('sort_order', { ascending: true });
      if (cancelled) return;
      if (!error) setMembers(data ?? []);
      setLoading(false);
    };
    fetchMembers();

    const channel = supabase
      .channel(`admin:${cfg.table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: cfg.table }, fetchMembers)
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [activeTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setDeleteConfirmId(null);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM, sort_order: members.length + 1 });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, role: item.role, sort_order: item.sort_order });
    setImageFile(null);
    setImagePreview(item.image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const filePath = `${cfg.folder}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('team').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('team').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      showToast('Please select an image first', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const imageUrl = imageFile ? await uploadImage(imageFile) : imagePreview;
      const payload = {
        name: formData.name,
        role: formData.role,
        image: imageUrl,
        sort_order: Number(formData.sort_order) || 0,
      };

      if (editingId) {
        const { error } = await supabase.from(cfg.table).update(payload).eq('id', editingId);
        if (error) throw error;
        showToast('Member updated successfully');
      } else {
        const { error } = await supabase.from(cfg.table).insert(payload);
        if (error) throw error;
        showToast('Member added successfully');
      }
      closeModal();
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from(cfg.table).delete().eq('id', id);
      if (error) throw error;
      showToast('Member deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete member.', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">Team</h1>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {Object.entries(TABS).map(([key, val]) => (
          <button
            key={key}
            type="button"
            onClick={() => switchTab(key)}
            className="team-tab-btn"
            style={{
              opacity: activeTab === key ? 1 : 0.5,
              width: 'auto',
              padding: '10px 20px',
              background: '#b80000',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : (
        <div className="card-grid">
          <div className="add-card-glass" onClick={openAddModal}>
            <Plus size={48} className="add-icon-large" />
            <span className="add-text">Add {cfg.label.slice(0, -1)}</span>
          </div>

          {members.map((item) => (
            <div key={item.id} className="practicum-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.name} className="card-image" />
                <div className="card-actions-overlay">
                  {deleteConfirmId === item.id ? (
                    <div className="confirm-delete-inline">
                      <span>Delete?</span>
                      <button className="confirm-yes-btn" onClick={() => handleDelete(item.id)}>Yes</button>
                      <button className="confirm-no-btn" onClick={() => setDeleteConfirmId(null)}>No</button>
                    </div>
                  ) : (
                    <>
                      <button className="action-btn" title="Edit" onClick={() => openEditModal(item)}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn" title="Delete" onClick={() => setDeleteConfirmId(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-desc">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close-btn" onClick={closeModal}>✕</button>
            <h2 className="modal-title">{editingId ? 'Edit Member' : 'Add Member'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="modal-top-section">
                <div className="image-upload-box" onClick={() => fileInputRef.current.click()}>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} className="image-preview" alt="Preview" />
                  ) : (
                    <>
                      <ImageIcon size={48} style={{ color: '#888' }} />
                      <span style={{ color: '#888' }}>Add Image</span>
                    </>
                  )}
                </div>

                <div className="modal-inputs-right">
                  <div className="form-group">
                    <label className="form-label">Name<span className="required">*</span></label>
                    <input
                      name="name"
                      className="modal-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input
                      name="role"
                      className="modal-input"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Lecturer"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Display Order<span className="required">*</span></label>
                    <input
                      name="sort_order"
                      type="number"
                      className="modal-input"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-publish" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Member' : 'Publish Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default AdminTeam;
