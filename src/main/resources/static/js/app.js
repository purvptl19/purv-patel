(() => {
  const API = '/api';
  let state = { profile: {}, education: [], skills: [], projects: [] };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---------------------------------------------------------------------
  // Load
  // ---------------------------------------------------------------------
  async function loadAll() {
    try {
      const res = await fetch(`${API}/biodata`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      state = await res.json();
      renderProfile();
      renderEducation();
      renderSkills();
      renderProjects();
      watchSections();
    } catch (err) {
      console.error(err);
      setText('#p-summary', 'Could not load the profile. Refresh the page to try again.');
    }
  }

  // ---------------------------------------------------------------------
  // Profile + connect buttons
  // ---------------------------------------------------------------------
  function renderProfile() {
    const p = state.profile || {};

    setText('#s-name', p.name || 'Your Name');
    setText('#s-title', p.title || '');
    setText('#s-location', p.location || '');
    setText('#p-summary', p.summary || '');
    setText('#footer-name', p.name || 'Your Name');

    // Sidebar buttons
    setLink('#s-linkedin', p.linkedin);
    setLink('#s-github', p.github);
    setLink('#s-gmail', p.email ? `mailto:${p.email}` : null);
    setLink('#s-phone-btn', p.phone ? `tel:${telHref(p.phone)}` : null);

    // Contact block
    setLink('#c-email', p.email ? `mailto:${p.email}` : null, p.email);
    setLink('#c-phone', p.phone ? `tel:${telHref(p.phone)}` : null, p.phone);
    setText('#c-location', p.location || '—');

    setupCopy(p.email);
  }

  // Digits only, with the Indian country code when none is given.
  function telHref(phone) {
    const digits = String(phone).replace(/[^\d+]/g, '');
    if (digits.startsWith('+')) return digits;
    return digits.length === 10 ? `+91${digits}` : digits;
  }

  function setText(sel, value) {
    const el = $(sel);
    if (el) el.textContent = value;
  }

  function setLink(sel, url, label) {
    const el = $(sel);
    if (!el) return;
    if (url) {
      el.href = url;
      el.hidden = false;
      if (label) el.textContent = label;
    } else {
      el.hidden = true;
    }
  }

  function setupCopy(email) {
    const btn = $('#copy-email');
    if (!btn) return;
    if (!email) { btn.hidden = true; return; }

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('done');
        }, 1800);
      } catch {
        btn.textContent = 'Press Ctrl+C';
      }
    });
  }

  // ---------------------------------------------------------------------
  // Education
  // ---------------------------------------------------------------------
  function renderEducation() {
    const container = $('#education-list');
    container.innerHTML = '';
    (state.education || []).forEach(item => container.appendChild(educationRow(item)));
  }

  function educationRow(item) {
    const row = document.createElement('div');
    row.className = 'record';
    row.dataset.id = item.id ?? '';

    const degreeLine = [item.degree, item.field].filter(Boolean).join(' · ');
    const years = [item.startYear, item.endYear].filter(Boolean).join('–');

    row.innerHTML = `
      <div class="record-heading">${escapeHtml(item.institution || '')}</div>
      <div class="record-years">${escapeHtml(years)}</div>
      <div class="record-sub">${escapeHtml(degreeLine)}</div>
      ${item.description ? `<div class="record-desc">${escapeHtml(item.description)}</div>` : ''}
    `;
    return row;
  }

  // ---------------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------------
  function renderSkills() {
    const container = $('#skills-list');
    container.innerHTML = '';
    (state.skills || []).forEach(item => container.appendChild(skillItem(item)));
  }

  function skillItem(item) {
    const el = document.createElement('div');
    el.className = 'skill';
    el.dataset.id = item.id ?? '';

    const level = Math.max(0, Math.min(5, Number(item.level) || 0));
    const cells = Array.from({ length: 5 },
      (_, i) => `<span class="cell${i < level ? ' on' : ''}"></span>`).join('');

    el.innerHTML = `
      <div class="skill-top">
        <span class="skill-name">${escapeHtml(item.name || '')}</span>
        <span class="skill-cat">${escapeHtml(item.category || '')}</span>
      </div>
      <div class="cells" role="img" aria-label="Level ${level} out of 5">${cells}</div>
    `;
    return el;
  }

  // ---------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------
  function renderProjects() {
    const container = $('#projects-list');
    container.innerHTML = '';
    (state.projects || []).forEach(item => container.appendChild(projectRow(item)));
  }

  function projectRow(item) {
    const row = document.createElement('div');
    row.className = 'record';
    row.dataset.id = item.id ?? '';

    const chips = (item.techStack || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
      .map(t => `<span class="chip">${escapeHtml(t)}</span>`)
      .join('');

    row.innerHTML = `
      <div class="record-heading">${escapeHtml(item.title || '')}</div>
      <div class="record-years"></div>
      ${item.description ? `<div class="record-desc">${escapeHtml(item.description)}</div>` : ''}
      ${chips ? `<div class="record-tech">${chips}</div>` : ''}
      ${item.link ? `<div class="record-link"><a href="${escapeAttr(item.link)}" target="_blank" rel="noopener">Open project</a></div>` : ''}
    `;
    return row;
  }

  // ---------------------------------------------------------------------
  // Highlight the section being read
  // ---------------------------------------------------------------------
  function watchSections() {
    const links = $$('.index a');
    const sections = $$('.block');
    if (!('IntersectionObserver' in window) || !sections.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => {
          a.classList.toggle('current', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
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

  loadAll();
})();
