import { useState, useRef } from "react";
import "../styles/edit.css";
import { Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import newsData from "../data/content";

const EditHomeSection = () => {
  // ✅ State untuk manage news list
  const [newsList, setNewsList] = useState(newsData);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // ✅ Track editing item
  const [formData, setFormData] = useState({ title: '', category: '', description: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ Open modal for ADD
  const handleOpenModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ title: '', category: '',});
    setSelectedImage(null);
  };

  // ✅ Open modal for EDIT
  const handleEditModal = (item) => {
    setShowModal(true);
    setEditingId(item.id);
    setFormData({ 
      title: item.title, 
      category: item.category,
      description: item.description || ''
    });
    setSelectedImage(item.image);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ title: '', category: '', description: '' });
    setSelectedImage(null);
  };

  // ✅ Handle file upload
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  // ✅ Handle SUBMIT (Add or Edit)
  const handlePublish = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !selectedImage) {
      alert("Please complete all required fields!");
      return;
    }

    if (editingId) {
      // UPDATE existing news
      setNewsList(newsList.map(item => 
        item.id === editingId 
          ? { 
              ...item, 
              title: formData.title, 
              category: formData.category,
              description: formData.description,
              image: selectedImage 
            }
          : item
      ));
      alert("News updated successfully!");
    } else {
      // ADD new news
      const newItem = {
        id: Date.now(),
        title: formData.title,
        category: formData.category,
        image: selectedImage
      };
      setNewsList([newItem, ...newsList]);
      alert("News published successfully!");
    }

    handleCloseModal();
  };

  // ✅ Handle DELETE
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this news?");
    if (confirmDelete) {
      setNewsList(newsList.filter(item => item.id !== id));
      alert("News deleted successfully!");
    }
  };

  return (
    <section className="edit-home-section">
      <h1 className="section-title">What's On B201</h1>

      <div className="news-container">
        {/* Card Tambah News */}
        <div className="news-card-admin add-card" onClick={handleOpenModal}>
          <div className="add-icon">
            <Plus size={113} />
          </div>
          <h3 style={{ fontSize: 28 }}>Add News</h3>
        </div>

        {/* Card Berita */}
        {newsList.map((item) => (
          <div className="news-card-admin" key={item.id}>
            <img src={item.image} alt={item.title} className="news-image" />

            <div className="news-overlay">
              <div className="news-buttons">
                {/* ✅ EDIT BUTTON */}
                <button 
                  className="edit-btn"
                  onClick={() => handleEditModal(item)}
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                {/* ✅ DELETE BUTTON */}
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="news-text">
                <h3>{item.title}</h3>
                <span>{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ==============================================================
                            MODAL ADD/EDIT NEWS
      =============================================================== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {/* Close Modal */}
            <button
              className="modal-close"
              onClick={handleCloseModal}
            >
              X
            </button>

            {/* ✅ Dynamic modal title */}
            <h2 className="modal-title">
              {editingId ? 'Edit News' : 'Add News'}
            </h2>

            <form onSubmit={handlePublish}>
              <div className="modal-content">
                {/* Upload Image */}
                <div className="image-upload" onClick={handleUploadClick}>
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="preview"
                      className="image-preview"
                    />
                  ) : (
                    <>
                      <ImageIcon size={50} className="upload-icon" />
                      <p className="upload-text">Add Image</p>
                    </>
                  )}
                </div>

                {/* hidden input file */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden-file-input"
                  onChange={handleImageChange}
                />

                {/* Input Fields */}
                <div className="input-side">
                  <label>Title*</label>
                  <input 
                    type="text" 
                    placeholder="Enter Title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />

                  <label>Tag*</label>
                  <input 
                    type="text" 
                    placeholder="Add Tag (e.g., PROJECTS, PRACTICUM)"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              {/* <div className="desc-box">
                <label>News Content</label>
                <textarea 
                  placeholder="Enter News Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div> */}

              {/* ✅ Dynamic button text */}
              <button type="submit" className="btn-publish">
                {editingId ? 'Update News' : 'Publish News'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditHomeSection;
