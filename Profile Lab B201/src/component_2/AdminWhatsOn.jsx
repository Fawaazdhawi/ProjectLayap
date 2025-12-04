import { useState, useRef, useEffect } from "react";
import "../styles/edit.css";
import { Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";

const EditHomeSection = () => {
  // ✅ State untuk manage news list
  const [newsList, setNewsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', description: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // ✅ Fetch news dari backend saat component mount
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/content?section=whats-on');
      const data = await response.json();
      
      console.log('Fetched data from API:', data);
      
      if (response.ok) {
        // Format data dari API - extract category dari title atau gunakan section
        const formattedNews = data.map(item => ({
          ...item,
          image: item.image_url ? `http://localhost:3000${item.image_url}` : item.image_url,
          category: item.category || 'whats-on'
        }));
        console.log('Formatted news:', formattedNews);
        setNewsList(formattedNews || []);
      } else {
        setError('Gagal mengambil data');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open modal for ADD
  const handleOpenModal = () => {
    setShowModal(true);
    setEditingId(null);
    setFormData({ title: '', category: '', description: '' });
    setSelectedImage(null);
  };

  // ✅ Open modal for EDIT
  const handleEditModal = (item) => {
    setShowModal(true);
    setEditingId(item.id);
    setFormData({ 
      title: item.title, 
      category: item.category || '',
      description: item.content || ''
    });
    // Build full URL untuk images dari database
    const imageUrl = item.image_url ? `http://localhost:3000${item.image_url}` : (item.image || null);
    setSelectedImage(imageUrl);
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
      // Simpan file object untuk di-upload nanti
      setSelectedImage(file);
      console.log('Image file selected:', file.name);
    }
  };

  // ✅ Upload image ke backend
  const uploadImage = async (imageFile) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', imageFile);

      console.log('Uploading image:', imageFile.name, imageFile.size, imageFile.type);

      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Upload response status:', response.status);
      const data = await response.json();
      console.log('Upload response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Image upload failed');
      }

      return data.imageUrl; // Return URL dari server
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // ✅ Handle SUBMIT (Add or Edit)
  const handlePublish = async (e) => {
    e.preventDefault();

    if (!formData.title || !selectedImage) {
      alert("Please complete all required fields (Title and Image)!");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login first!");
        return;
      }

      let imageUrl = selectedImage;

      // Jika selectedImage adalah File object, upload terlebih dahulu
      if (selectedImage instanceof File) {
        console.log('Uploading image file...');
        imageUrl = await uploadImage(selectedImage);
      }

      const contentData = {
        title: formData.title,
        section: 'whats-on',
        content: formData.description || '',
        image_url: imageUrl,
        category: formData.category || 'NEWS'
      };

      console.log('Sending content data:', contentData);

      if (editingId) {
        // UPDATE existing content
        const response = await fetch(`http://localhost:3000/api/content/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(contentData)
        });

        const responseData = await response.json();
        console.log('Update response:', responseData);

        if (response.ok) {
          alert("News updated successfully!");
          fetchNews();
        } else {
          alert(`Gagal update news: ${responseData.error}`);
        }
      } else {
        // ADD new content
        const response = await fetch('http://localhost:3000/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(contentData)
        });

        const responseData = await response.json();
        console.log('Create response:', responseData);

        if (response.ok) {
          alert("News published successfully!");
          fetchNews();
        } else {
          alert(`Gagal publish news: ${responseData.error}`);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      alert(`Terjadi kesalahan saat menyimpan data: ${error.message}`);
    }
  };

  // ✅ Handle DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this news?");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        console.log('Token untuk delete:', token);
        
        if (!token) {
          alert("Please login first!");
          return;
        }

        const response = await fetch(`http://localhost:3000/api/content/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Delete response status:', response.status);
        const responseData = await response.json();
        console.log('Delete response data:', responseData);

        if (response.ok) {
          alert("News deleted successfully!");
          fetchNews();
        } else {
          alert(`Gagal delete news: ${responseData.error}`);
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert(`Terjadi kesalahan saat menghapus data: ${error.message}`);
      }
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
                      src={selectedImage instanceof File ? URL.createObjectURL(selectedImage) : selectedImage}
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

                  <label>Tag (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Add Tag (e.g., PROJECTS, PRACTICUM, NEWS)"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="desc-box">
                <label>News Content</label>
                <textarea 
                  placeholder="Enter News Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

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
