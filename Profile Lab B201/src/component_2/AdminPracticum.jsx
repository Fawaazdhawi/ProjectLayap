import React, { useState, useRef } from 'react';
import '../styles/edit2.css';

const EditIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
);

const MOCK_DATA = [
  { 
    id: 1, 
    title: "Advanced Programming Practicum", 
    description: "Developing advanced programming skills using modern technologies and structured software development methodologies.", 
    image: "images/Proglan-Layap2.jpg" 
  },
  { 
    id: 2, 
    title: "Database Management System", 
    description: "Concepts and implementation of databases, including database design, query optimization, and data management.", 
    image: "images/Basdat-Layap.jpeg" 
  }
];

const AdminPracticum = () => {
  const [practicums, setPracticums] = useState(MOCK_DATA);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleOpenModal = () => {
    setShowModal(true);
    setFormData({ title: '', description: '' });
    setImagePreview(null);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !imageFile) {
        alert("Please complete all fields"); return;
    }
    const newItem = { id: Date.now(), title: formData.title, description: formData.description, image: imagePreview };
    setPracticums([newItem, ...practicums]);
    handleCloseModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="page-title">Practicum List</h1>
      </div>

      <div className="card-grid">
        {/* ADD CARD */}
        <div className="add-card-glass" onClick={handleOpenModal}>
            <span className="add-icon-large">+</span>
            <span className="add-text">Add Practicum</span>
        </div>

        {/* LIST CARDS */}
        {practicums.map((item) => (
          <div key={item.id} className="practicum-card">
            <div className="card-image-wrapper">
                {/*x */}
                <img src={item.image} alt={item.title} className="card-image" />
                <div className="card-actions-overlay">
                    <button className="action-btn" title="Edit"><EditIcon/></button>
                    <button className="action-btn" title="Delete"><TrashIcon/></button>
                </div>
            </div>
            <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="modal-close-btn" onClick={handleCloseModal}>&times;</button>
            <h2 className="modal-title">Add Practicum</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-top-section">
                
                {/*image */}
                <div className="image-upload-box" onClick={() => fileInputRef.current.click()}>
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                    {imagePreview ? (
                        <img src={imagePreview} className="image-preview" alt="Preview"/>
                    ) : (
                        <>
                            <span className="upload-icon">📷</span>
                            <span style={{color:'#888'}}>Add Image</span>
                        </>
                    )}
                </div>

                {/*image right */}
                <div className="modal-inputs-right">
                    <div className="form-group">
                        <label className="form-label">Title<span className="required">*</span></label>
                        <input 
                            name="title" 
                            className="modal-input" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            placeholder="Enter Title" 
                        />
                    </div>
                </div>
              </div>

              {/* desc */}
              <div className="form-group">
                  <label className="form-label">Practicum Description</label>
                  <textarea 
                      name="description" 
                      className="modal-textarea" 
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      placeholder="Enter Practicum Description" 
                  />
              </div>

              <button type="submit" className="btn-publish">Publish Practicum</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPracticum;