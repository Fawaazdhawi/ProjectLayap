import { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import '../../styles/edit2.css';

const EMPTY_FORM = { title: '', description: '' };

const AdminWhatWeDo = () => {
  const [services, setServices] = useState([]);
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
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('whatwedo_services')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error) setServices(data ?? []);
      setLoading(false);
    };
    fetchServices();

    const channel = supabase
      .channel('admin:whatwedo_services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatwedo_services' }, fetchServices)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ title: item.title, description: item.description });
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
    const { error: uploadError } = await supabase.storage.from('whatwedo').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('whatwedo').getPublicUrl(filePath);
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

      if (editingId) {
        const { error } = await supabase
          .from('whatwedo_services')
          .update({ title: formData.title, description: formData.description, image: imageUrl })
          .eq('id', editingId);
        if (error) throw error;
        showToast('Service updated successfully');
      } else {
        const { error } = await supabase
          .from('whatwedo_services')
          .insert({ title: formData.title, description: formData.description, image: imageUrl });
        if (error) throw error;
        showToast('Service added successfully');
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
      const { error } = await supabase.from('whatwedo_services').delete().eq('id', id);
      if (error) throw error;
      showToast('Service deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete service.', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">What We Do</h1>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : (
        <div className="card-grid">
          <div className="add-card-glass" onClick={openAddModal}>
            <Plus size={48} className="add-icon-large" />
            <span className="add-text">Add Service</span>
          </div>

          {services.map((item) => (
            <div key={item.id} className="practicum-card">
              <div className="card-image-wrapper">
                <img src={item.image} alt={item.title} className="card-image" />
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
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close-btn" onClick={closeModal}>✕</button>
            <h2 className="modal-title">{editingId ? 'Edit Service' : 'Add Service'}</h2>

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
                    <label className="form-label">Title<span className="required">*</span></label>
                    <input
                      name="title"
                      className="modal-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter Title"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="modal-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter Description"
                  required
                />
              </div>

              <button type="submit" className="btn-publish" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Service' : 'Publish Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default AdminWhatWeDo;
