(() => {
  const API = '/api';
  let state = { profile: {}, education: [], skills: [], projects: [] };

  const $ = (sel, root = document) => root.querySelector(sel);

  // ---------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------
  async function loadAll() {
    const res = await fetch(`${API}/biodata`);
    const data = await res.json();
    state = data;
    renderProfile();
    renderEducation();
    renderSkills();
    renderProjects();
  }

  // ---------------------------------------------------------------------
  // Profile
  // ---------------------------------------------------------------------
  function renderProfile() {
    const p = state.profile || {};
    setText('#s-name', p.name || 'Your Name');
    setText('#s-title', p.title || '');
    setText('#s-email', p.email || '');
    setText('#s-phone', p.phone || '');
    setText('#s-location', p.location || '');
    setText('#p-summary', p.summary || '');
    setText('#footer-name', p.name || 'Your Name');

    setLink('#s-linkedin', p.linkedin);
    setLink('#s-github', p.github);
    setLink('#s-website', p.website);
  }

  function setText(sel, value) {
    const el = $(sel);
    if (el) el.textContent = value;
  }

  function setLink(sel, url) {
    const el = $(sel);
    if (!el) return;
    if (url) {
      el.href = url;
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }

  // ---------------------------------------------------------------------
  // Education
  // ---------------------------------------------------------------------
  function renderEducation() {
    const container = $('#education-list');
    container.innerHTML = '';
    state.education.forEach(item => container.appendChild(educationRow(item)));
  }

  function educationRow(item) {
    const row = document.createElement('div');
    row.className = 'ledger-row';
    row.dataset.id = item.id ?? '';

    const degreeLine = [item.degree, item.field].filter(Boolean).join(', ');
    row.innerHTML = `
      <div class="ledger-heading">${escapeHtml(item.institution || '')}</div>
      <div class="ledger-dates">${escapeHtml(item.startYear || '')} &mdash; ${escapeHtml(item.endYear || '')}</div>
      <div class="ledger-subheading">${escapeHtml(degreeLine)}</div>
      ${item.description ? `<div class="ledger-desc">${escapeHtml(item.description)}</div>` : ''}
    `;
    return row;
  }

  // ---------------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------------
  function renderSkills() {
    const container = $('#skills-list');
    container.innerHTML = '';
    state.skills.forEach(item => container.appendChild(skillItem(item)));
  }

  function skillItem(item) {
    const el = document.createElement('div');
    el.className = 'skill-item';
    el.dataset.id = item.id ?? '';
    const level = Math.max(0, Math.min(5, item.level || 0));

    el.innerHTML = `
      <div class="skill-name-row">
        <span>${escapeHtml(item.name || '')}</span>
        <span class="skill-category">${escapeHtml(item.category || '')}</span>
      </div>
      <div class="skill-bar"><div class="skill-bar-fill" style="width:${level * 20}%"></div></div>
    `;
    return el;
  }

  // ---------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------
  function renderProjects() {
    const container = $('#projects-list');
    container.innerHTML = '';
    state.projects.forEach(item => container.appendChild(projectRow(item)));
  }

  function projectRow(item) {
    const row = document.createElement('div');
    row.className = 'ledger-row';
    row.dataset.id = item.id ?? '';

    row.innerHTML = `
      <div class="ledger-heading">${escapeHtml(item.title || '')}</div>
      <div class="ledger-dates"></div>
      <div class="ledger-desc" style="grid-column:1/-1;">${escapeHtml(item.description || '')}</div>
      ${item.techStack ? `<div class="ledger-tech">${escapeHtml(item.techStack)}</div>` : ''}
      ${item.link ? `<div class="ledger-link"><a href="${escapeAttr(item.link)}" target="_blank" rel="noopener">View project</a></div>` : ''}
    `;
    return row;
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  function escapeAttr(str) {
    return escapeHtml(str).replaceAll('"', '&quot;');
  }

  // ---------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------
  loadAll();
})();
