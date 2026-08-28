import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import '../../styles/edit2.css';

const EMPTY_FORM = { label: '', content: '', sort_order: 1 };

const AdminCultureTabs = () => {
  const [tabs, setTabs] = useState([]);
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
    const fetchTabs = async () => {
      const { data, error } = await supabase
        .from('culture_tabs')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error) setTabs(data ?? []);
      setLoading(false);
    };
    fetchTabs();

    const channel = supabase
      .channel('admin:culture_tabs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'culture_tabs' }, fetchTabs)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM, sort_order: tabs.length + 1 });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ label: item.label, content: item.content, sort_order: item.sort_order });
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
    const filePath = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('culture').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('culture').getPublicUrl(filePath);
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
        label: formData.label,
        content: formData.content,
        image: imageUrl,
        sort_order: Number(formData.sort_order) || 0,
      };

      if (editingId) {
        const { error } = await supabase.from('culture_tabs').update(payload).eq('id', editingId);
        if (error) throw error;
        showToast('Tab updated successfully');
      } else {
        const { error } = await supabase.from('culture_tabs').insert(payload);
        if (error) throw error;
        showToast('Tab added successfully');
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
      const { error } = await supabase.from('culture_tabs').delete().eq('id', id);
      if (error) throw error;
      showToast('Tab deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete tab.', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">Culture & Values Tabs</h1>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : (
        <div className="card-grid">
          <div className="add-card-glass" onClick={openAddModal}>
            <Plus size={48} className="add-icon-large" />
            <span className="add-text">Add Tab</span>
          </div>

          {tabs.map((item) => (
            <div key={item.id} className="practicum-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.label} className="card-image" />
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
                <h3 className="card-title">{item.label} (#{item.sort_order})</h3>
                <p className="card-desc">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close-btn" onClick={closeModal}>✕</button>
            <h2 className="modal-title">{editingId ? 'Edit Tab' : 'Add Tab'}</h2>

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
                    <label className="form-label">Tab Label<span className="required">*</span></label>
                    <input
                      name="label"
                      className="modal-input"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="e.g. Collaboration"
                      required
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

              <div className="form-group">
                <label className="form-label">Tab Content</label>
                <textarea
                  name="content"
                  className="modal-textarea"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter tab content"
                  required
                />
              </div>

              <button type="submit" className="btn-publish" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Tab' : 'Publish Tab'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default AdminCultureTabs;
