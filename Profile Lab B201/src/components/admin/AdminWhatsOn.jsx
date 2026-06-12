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
import '../../styles/edit.css';

const EMPTY_FORM = { title: '', category: '' };

const AdminWhatsOn = () => {
  const [newsList, setNewsList] = useState([]);
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
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNewsList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
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
    setFormData({ title: item.title, category: item.category });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const storageRef = ref(storage, `news/${Date.now()}_${file.name}`);
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
        await updateDoc(doc(db, 'news', editingId), {
          title: formData.title,
          category: formData.category,
          image: imageUrl,
        });
        showToast('News updated successfully');
      } else {
        await addDoc(collection(db, 'news'), {
          title: formData.title,
          category: formData.category,
          image: imageUrl,
          createdAt: serverTimestamp(),
        });
        showToast('News published successfully');
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
      await deleteDoc(doc(db, 'news', id));
      showToast('News deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete news.', 'error');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <section className="edit-home-section">
      <h1 className="section-title">What's On B201</h1>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Loading...</p>
      ) : (
        <div className="news-container">
          <div className="news-card-admin add-card" onClick={openAddModal}>
            <div className="add-icon"><Plus size={113} /></div>
            <h3 style={{ fontSize: 28 }}>Add News</h3>
          </div>

          {newsList.map((item) => (
            <div className="news-card-admin" key={item.id}>
              <img src={item.image} alt={item.title} className="news-image" />
              <div className="news-overlay">
                <div className="news-buttons">
                  {deleteConfirmId === item.id ? (
                    <div className="confirm-delete-inline">
                      <span>Delete?</span>
                      <button className="confirm-yes-btn" onClick={() => handleDelete(item.id)}>Yes</button>
                      <button className="confirm-no-btn" onClick={() => setDeleteConfirmId(null)}>No</button>
                    </div>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => openEditModal(item)} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="delete-btn" onClick={() => setDeleteConfirmId(item.id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
                <div className="news-text">
                  <h3>{item.title}</h3>
                  <span>{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2 className="modal-title">{editingId ? 'Edit News' : 'Add News'}</h2>

            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="image-upload" onClick={() => fileInputRef.current.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="image-preview" />
                  ) : (
                    <>
                      <ImageIcon size={50} className="upload-icon" />
                      <p className="upload-text">Add Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden-file-input"
                  onChange={handleImageChange}
                />

                <div className="input-side">
                  <label>Title*</label>
                  <input
                    type="text"
                    placeholder="Enter Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <label>Tag*</label>
                  <input
                    type="text"
                    placeholder="e.g. PROJECTS, PRACTICUM"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-publish" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update News' : 'Publish News'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </section>
  );
};

export default AdminWhatsOn;
