import { useState, useEffect, useRef } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { db, storage } from '../../config/firebase';
import { useToast } from '../../hooks/useToast';
import Toast from '../Toast';
import '../../styles/edit2.css';

const EMPTY_FORM = { title: '', description: '' };

const AdminPracticum = () => {
  const [practicums, setPracticums] = useState([]);
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
    const q = query(collection(db, 'practicums'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPracticums(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
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
    const storageRef = ref(storage, `practicums/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
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
        await updateDoc(doc(db, 'practicums', editingId), {
          title: formData.title,
          description: formData.description,
          image: imageUrl,
        });
        showToast('Practicum updated successfully');
      } else {
        await addDoc(collection(db, 'practicums'), {
          title: formData.title,
          description: formData.description,
          image: imageUrl,
          createdAt: serverTimestamp(),
        });
        showToast('Practicum added successfully');
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
      await deleteDoc(doc(db, 'practicums', id));
      showToast('Practicum deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete practicum.', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">Practicum List</h1>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : (
        <div className="card-grid">
          <div className="add-card-glass" onClick={openAddModal}>
            <Plus size={48} className="add-icon-large" />
            <span className="add-text">Add Practicum</span>
          </div>

          {practicums.map((item) => (
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
            <h2 className="modal-title">{editingId ? 'Edit Practicum' : 'Add Practicum'}</h2>

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
                <label className="form-label">Practicum Description</label>
                <textarea
                  name="description"
                  className="modal-textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter Practicum Description"
                  required
                />
              </div>

              <button type="submit" className="btn-publish" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update Practicum' : 'Publish Practicum'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default AdminPracticum;
