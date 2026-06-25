// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cors());

// Basic rate limiter
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Serve frontend static files
app.use('/', express.static(path.join(__dirname, 'frontend')));

// Helper: validate category
const CATEGORIES = ['politics','economy','technology','sports','climate'];

// Mode 1: Proxy to external news API if NEWS_API_URL is set
// Mode 2: Accept manual POST entries to /api/news (for your manual links/content)
app.get('/api/news', async (req, res) => {
  try {
    const externalUrl = process.env.NEWS_API_URL;
    if (externalUrl) {
      const resp = await axios.get(externalUrl, { timeout: 8000 });
      return res.json(resp.data);
    }
    return res.status(400).json({ error: 'No external NEWS_API_URL configured. Use POST /api/news to add data.' });
  } catch (err) {
    const message = err.response?.data || err.message || 'Failed to fetch external news';
    return res.status(502).json({ error: 'Proxy fetch failed', detail: message });
  }
});

// Accept manual news entry for one category
app.post('/api/news', (req, res) => {
  try {
    const { category, photoLink, content } = req.body;
    if (!category || !photoLink || !content) {
      return res.status(400).json({ error: 'category, photoLink and content are required' });
    }
    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ error: `category must be one of ${CATEGORIES.join(', ')}` });
    }

    // Minimal sanitization
    const safe = {
      category,
      photo: String(photoLink),
      article: {
        headline: String(content.headline || '').trim(),
        subheadline: String(content.subheadline || '').trim(),
        body: String(content.body || '').trim()
      }
    };

    // In this minimal version we return the object.
    // Later you can save to DB.
    return res.json({ success: true, data: safe });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Fallback to index.html for SPA routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
