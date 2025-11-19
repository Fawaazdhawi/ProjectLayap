const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// API untuk data lab
app.get('/api/labs', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Lab B201', type: 'Telematics', capacity: 40 },
      { id: 2, name: 'Lab B202', type: 'Networking', capacity: 35 }
    ]
  });
});

// API untuk reservasi
app.get('/api/reservations', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, pcName: 'RTX 5090', date: '2025-01-20', status: 'available' },
      { id: 2, pcName: 'RTX 4090-1', date: '2025-01-20', status: 'booked' }
    ]
  });
});

// API status
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