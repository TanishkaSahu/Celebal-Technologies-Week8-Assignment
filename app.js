const express = require('express');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// === ROUTES ===

// GET: Random Cat Fact (no API key needed)
app.get('/catfact', async (req, res, next) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

// POST: Upload a file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

// POST: Sample JSON input
app.post('/data', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) return res.status(400).json({ error: 'Missing fields' });
  res.json({ message: `Hello, ${name}. You are ${age} years old.` });
});

// Route to simulate an error (for testing)
app.get('/error-test', (req, res, next) => {
  next(new Error('This is a test error'));
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
