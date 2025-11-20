import { useState, useRef } from "react";
import "../styles/edit.css";
import { Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import newsData from "../data/content";

const EditHomeSection = () => {
  const [showModal, setShowModal] = useState(false);

  // State untuk upload
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Klik area upload
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Saat user pilih file
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImage(imageURL);
    }
  };

  const handlePublish = () => {
    alert("News Published!");
    setSelectedImage(null);
    setShowModal(false);
  };

  return (
    <section className="edit-home-section">
      <h1 className="section-title">What's On B201</h1>

      <div className="news-container">
        {/* Card Tambah News */}
        <div className="news-card add-card" onClick={() => setShowModal(true)}>
          <div className="add-icon">
            <Plus size={113} />
          </div>
          <h3 style={{ fontSize: 28 }}>Add News</h3>
        </div>

        {/* Card Berita */}
        {newsData.map((item) => (
          <div className="news-card" key={item.id}>
            <img src={item.image} alt={item.title} className="news-image" />

            <div className="news-overlay">
              <div className="news-buttons">
                <button className="edit-btn">
                  <Edit size={18} />
                </button>
                <button className="delete-btn">
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
                            MODAL ADD NEWS
      =============================================================== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            {/* Close Modal */}
            <button
              className="modal-close"
              onClick={() => {
                setShowModal(false);
                setSelectedImage(null);
              }}
            >
              X
            </button>

            <h2 className="modal-title">Add News</h2>

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
                <input type="text" placeholder="Enter Title" />

                <label>Tag*</label>
                <input type="text" placeholder="Add Tag" />
              </div>
            </div>

            {/* Description */}
            <div className="desc-box">
              <label>News Content</label>
              <textarea placeholder="Enter News Description"></textarea>
            </div>

            <button className="btn-publish" onClick={handlePublish}>Publish News</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EditHomeSection;
