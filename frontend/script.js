// script.js
const API_BASE = '/api/news'; // backend proxy or external if configured
const DEFAULT_CATEGORY = 'politics';
const categories = ['politics','economy','technology','sports','climate'];

const headlineEl = document.getElementById('headline');
const subheadlineEl = document.getElementById('subheadline');
const heroPhotoEl = document.getElementById('hero-photo');
const articleBodyEl = document.getElementById('article-body');
const errorEl = document.getElementById('error');

async function fetchNews() {
  try {
    showLoading();
    const res = await fetch(API_BASE, { cache: 'no-store' });
    if (!res.ok) {
      const err = await res.json().catch(()=>({message:res.statusText}));
      throw new Error(err.error || err.message || 'Failed to fetch news');
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  } finally {
    hideLoading();
  }
}

function renderCategory(data, cat) {
  const item = data?.[cat];
  if (!item) {
    showError('No data for selected category');
    return;
  }
  hideError();
  headlineEl.textContent = item.article?.headline || 'Headline not available';
  subheadlineEl.textContent = item.article?.subheadline || '';
  articleBodyEl.innerHTML = formatBody(item.article?.body || '');
  heroPhotoEl.style.backgroundImage = `url("${item.photo}")`;
}

function formatBody(text) {
  if (!text) return '<p>Article body not available.</p>';
  const paragraphs = text.split('\n').filter(Boolean);
  return paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function showError(msg) {
  errorEl.hidden = false;
  errorEl.textContent = msg;
}
function hideError(){ errorEl.hidden = true; errorEl.textContent = '' }
function showLoading(){
  headlineEl.textContent = 'Loading headline...';
  subheadlineEl.textContent = 'Please wait';
  articleBodyEl.innerHTML = '<p>Loading article...</p>';
  heroPhotoEl.style.backgroundImage = '';
}
function hideLoading(){ /* no-op */ }

// Nav buttons
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    if (window._newsData) renderCategory(window._newsData, cat);
  });
});

// Initial load
(async function init(){
  try {
    const data = await fetchNews();
    window._newsData = data;
    renderCategory(data, DEFAULT_CATEGORY);
  } catch (err) {
    showError(err.message || 'Unable to load news');
  }
})();
