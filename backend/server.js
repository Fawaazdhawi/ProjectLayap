const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Setup upload folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(uploadDir));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'database',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'labuser',
  password: process.env.DB_PASSWORD || 'labpass123',
  database: process.env.DB_NAME || 'lab_b201',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database tables with retry
async function initDb() {
  let retries = 5;
  while (retries > 0) {
    try {
      const connection = await pool.getConnection();
      
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS admins (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS content (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          section VARCHAR(100) NOT NULL,
          content LONGTEXT NOT NULL,
          image_url VARCHAR(255),
          category VARCHAR(100),
          admin_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (admin_id) REFERENCES admins(id)
        )
      `);

      connection.release();
      console.log('✅ Database tables initialized');
      return;
    } catch (err) {
      retries--;
      if (retries === 0) {
        console.error('❌ Error initializing database after retries:', err.message);
      } else {
        console.log(`⏳ Retrying database connection... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
  }
}

// Initialize DB on startup
initDb();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.admin = admin;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Upload image endpoint with error handling
app.post('/api/upload', authenticateToken, (req, res) => {
  console.log('Upload request received, admin:', req.admin);
  
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.log('No file provided');
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('File uploaded:', req.file.filename);
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ 
      success: true,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully'
    });
  });
});

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, email, password FROM admins WHERE email = ?',
      [email]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create Admin (run once to create first admin)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO admins (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    connection.release();

    res.status(201).json({ 
      admin: { id: result.insertId, email: email },
      message: 'Admin created successfully'
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Get all content or by section
app.get('/api/content', async (req, res) => {
  try {
    const { section } = req.query;
    const connection = await pool.getConnection();
    
    let query = 'SELECT * FROM content';
    let params = [];
    
    if (section) {
      query += ' WHERE section = ?';
      params.push(section);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const [rows] = await connection.execute(query, params);
    connection.release();
    
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get content by ID
app.get('/api/content/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM content WHERE id = ?',
      [id]
    );
    connection.release();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create content
app.post('/api/content', authenticateToken, async (req, res) => {
  try {
    const { title, section, content, image_url, category } = req.body;

    if (!title || !section) {
      return res.status(400).json({ error: 'Title and section required' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO content (title, section, content, image_url, category, admin_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, section, content, image_url, category || '', req.admin.id]
    );
    connection.release();

    res.status(201).json({ 
      id: result.insertId,
      message: 'Content created successfully'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update content
app.put('/api/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, section, content, image_url, category } = req.body;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'UPDATE content SET title = ?, section = ?, content = ?, image_url = ?, category = ? WHERE id = ?',
      [title, section, content, image_url, category || '', id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ message: 'Content updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete content
app.delete('/api/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'DELETE FROM content WHERE id = ?',
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Lab B201 Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend API running on port ${PORT}`);
});