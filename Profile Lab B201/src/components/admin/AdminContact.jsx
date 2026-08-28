import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import '../../styles/edit2.css';

const EMPTY_FORM = { label: '', value: '', sort_order: 1 };

const AdminContact = () => {
  const [details, setDetails] = useState([]);
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
    const fetchDetails = async () => {
      const { data, error } = await supabase
        .from('contact_details')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error) setDetails(data ?? []);
      setLoading(false);
    };
    fetchDetails();

    const channel = supabase
      .channel('admin:contact_details')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_details' }, fetchDetails)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM, sort_order: details.length + 1 });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ label: item.label, value: item.value, sort_order: item.sort_order });
    setImageFile(null);
    setImagePreview(item.icon);
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
    const { error: uploadError } = await supabase.storage.from('contact').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('contact').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) {
      showToast('Please select an icon first', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const iconUrl = imageFile ? await uploadImage(imageFile) : imagePreview;
      const payload = {
        label: formData.label,
        value: formData.value,
        icon: iconUrl,
        sort_order: Number(formData.sort_order) || 0,
      };

      if (editingId) {
        const { error } = await supabase.from('contact_details').update(payload).eq('id', editingId);
        if (error) throw error;
        showToast('Contact detail updated successfully');
      } else {
        const { error } = await supabase.from('contact_details').insert(payload);
        if (error) throw error;
        showToast('Contact detail added successfully');
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
      const { error } = await supabase.from('contact_details').delete().eq('id', id);
      if (error) throw error;
      showToast('Contact detail deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete contact detail.', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">Contact Details</h1>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : (
        <div className="card-grid">
          <div className="add-card-glass" onClick={openAddModal}>
            <Plus size={48} className="add-icon-large" />
            <span className="add-text">Add Detail</span>
          </div>

          {details.map((item) => (
            <div key={item.id} className="practicum-card">
              <div className="card-image-wrapper">
                <img src={item.icon} alt={item.label} className="card-image" />
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
                <h3 className="card-title">{item.label}</h3>
                <p className="card-desc">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close-btn" onClick={closeModal}>✕</button>
            <h2 className="modal-title">{editingId ? 'Edit Contact Detail' : 'Add Contact Detail'}</h2>

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
                      <span style={{ color: '#888' }}>Add Icon</span>
                    </>
                  )}
                </div>

                <div className="modal-inputs-right">
                  <div className="form-group">
                    <label className="form-label">Label<span className="required">*</span></label>
                    <input
                      name="label"
                      className="modal-input"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      placeholder="e.g. Address"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Value<span className="required">*</span></label>
                    <input
                      name="value"
                      className="modal-input"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="Enter value"
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

              <button type="submit" className="btn-publish" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Detail' : 'Publish Detail'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default AdminContact;
