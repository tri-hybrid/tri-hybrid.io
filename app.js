/* No build step, account, analytics, or server required. */
(() => {
  'use strict';
  const config = window.THOR_SITE || { news: [], releases: [], roadmap: [] };
  const el = id => document.getElementById(id);
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = (tag, attributes) => {
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };

  // A native SVG aperture illustration, deliberately separate from simulation data.
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const x = 108 + col * 25 + row * 24;
      const y = 215 - col * 14 + row * 14;
      el('aperture-elements').appendChild(svg('path', {
        d: `M${x} ${y}l9 -5 8 5 -9 5Z`,
        opacity: String(0.4 + ((row + col) % 4) * 0.2)
      }));
    }
  }

  const layers = {
    digital: { label: 'LAYER 01 / DIGITAL BASEBAND', title: 'Start with the signal.', description: 'Digital processing maps information streams to the available RF chains. It adapts precoding or combining to the effective channel created by all three layers.', constraint: 'Design question: how should streams share the available RF chains?', visualLabel: 'STREAMS → RF CHAINS', left: 3, right: 4 },
    analog: { label: 'LAYER 02 / ANALOG RF', title: 'Connect signals to ports.', description: 'A hardware-constrained RF network maps chains to active antenna feeds. Phase shifters, switches, or delay elements shape which signals reach each port.', constraint: 'Design question: what can the RF hardware actually realize?', visualLabel: 'RF CHAINS → ACTIVE FEEDS', left: 4, right: 7 },
    electromagnetic: { label: 'LAYER 03 / ELECTROMAGNETIC APERTURE', title: 'Let the aperture adapt.', description: 'A transceiver-integrated reconfiguration layer changes how driven ports become currents, patterns, or radiation locations. Its state changes the effective channel and can change radiated power.', constraint: 'Design question: which antenna states remain feasible under coupling, loss, and bandwidth constraints?', visualLabel: 'ACTIVE FEEDS → RADIATED FIELD', left: 4, right: 9 }
  };
  const layerTabs = [...document.querySelectorAll('[data-layer]')];
  function showLayer(key) {
    const layer = layers[key];
    layerTabs.forEach(tab => {
      const active = tab.dataset.layer === key;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    el('layer-panel').setAttribute('aria-labelledby', `tab-${key}`);
    el('layer-label').textContent = layer.label;
    el('layer-title').textContent = layer.title;
    el('layer-description').textContent = layer.description;
    el('layer-constraint').textContent = layer.constraint;
    document.querySelector('.signal-visual-label').textContent = layer.visualLabel;
    const paths = el('signal-paths');
    paths.replaceChildren();
    for (let i = 0; i < layer.left; i++) {
      const y1 = 18 + i * 86 / (layer.left - 1);
      for (let j = 0; j < layer.right; j++) {
        const y2 = 12 + j * 98 / (layer.right - 1);
        paths.appendChild(svg('path', { d: `M38 ${y1}C180 ${y1} 250 ${y2} 394 ${y2}`, fill: 'none', stroke: '#1455ed', 'stroke-width': '1', opacity: '.19' }));
      }
      paths.appendChild(svg('rect', { x: '29', y: y1 - 5, width: '10', height: '10', fill: '#1455ed' }));
    }
    for (let j = 0; j < layer.right; j++) paths.appendChild(svg('circle', { cx: '394', cy: 12 + j * 98 / (layer.right - 1), r: '4', fill: '#1455ed' }));
  }
  function keyboardTabs(event, tabs, activate) {
    const index = tabs.indexOf(event.currentTarget);
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); activate(tabs[next]); }
  }
  layerTabs.forEach(tab => {
    tab.addEventListener('click', () => showLayer(tab.dataset.layer));
    tab.addEventListener('keydown', event => keyboardTabs(event, layerTabs, item => showLayer(item.dataset.layer)));
  });
  showLayer('digital');

  let updateType = 'news';
  const updateTabs = [...document.querySelectorAll('[data-update]')];
  function safeHref(value) {
    if (typeof value !== 'string') return '';
    if (/^#[a-z][a-z0-9-]*$/i.test(value)) return value;
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
  }
  function renderUpdates() {
    const all = Array.isArray(config[updateType]) ? config[updateType] : [];
    const query = el('update-search').value.trim().toLocaleLowerCase();
    const items = all.filter(item => [item.title, item.summary, item.category, item.version].some(value => String(value || '').toLocaleLowerCase().includes(query)));
    const results = el('update-results');
    results.replaceChildren();
    if (!items.length) {
      const empty = make('div', 'empty-state');
      empty.appendChild(make('h3', '', query ? 'No matching updates.' : updateType === 'releases' ? 'The first release is still ahead.' : 'More news is ahead.'));
      empty.appendChild(make('p', '', query ? 'Try another search term or switch between news and releases.' : updateType === 'releases' ? 'No public releases have been published here yet. Planned research outputs are outlined below; release notes and downloadable artifacts will appear here when available.' : 'Project announcements will appear here as they become available.'));
      if (!query) { const link = make('a', '', updateType === 'releases' ? 'Explore planned outputs ↗' : 'Explore the research ↗'); link.href = updateType === 'releases' ? '#roadmap' : '#research'; empty.appendChild(link); }
      results.appendChild(empty);
    }
    items.forEach(item => {
      const article = make('article', 'update-card');
      const meta = make('div', 'update-meta');
      meta.appendChild(make('span', 'eyebrow', item.category || (updateType === 'news' ? 'PROJECT NEWS' : 'PUBLIC RELEASE')));
      const validDate = item.date && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && !Number.isNaN(Date.parse(item.date));
      if (validDate) {
        const date = make('time', '', new Date(`${item.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }));
        date.dateTime = item.date;
        meta.appendChild(date);
      }
      const content = make('div', 'update-content');
      content.appendChild(make('h3', '', `${item.version ? `${item.version} · ` : ''}${item.title}`));
      content.appendChild(make('p', 'update-summary', item.summary));
      const href = safeHref(item.href);
      if (href) { const link = make('a', '', item.linkLabel || 'Read more'); link.href = href; link.appendChild(make('span', '', '↗')); content.appendChild(link); }
      article.append(meta, content);
      results.appendChild(article);
    });
    el('update-status').textContent = `${items.length} ${updateType === 'news' ? 'news item' : 'release'}${items.length === 1 ? '' : 's'} shown${query ? ` for “${el('update-search').value.trim()}”` : ''}.`;
  }
  function showUpdates(type) {
    updateType = type;
    updateTabs.forEach(tab => { const active = tab.dataset.update === type; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
    el('updates-panel').setAttribute('aria-labelledby', `${type}-tab`);
    renderUpdates();
  }
  updateTabs.forEach(tab => {
    tab.addEventListener('click', () => showUpdates(tab.dataset.update));
    tab.addEventListener('keydown', event => keyboardTabs(event, updateTabs, item => showUpdates(item.dataset.update)));
  });
  el('update-search').addEventListener('input', renderUpdates);
  el('news-count').textContent = (config.news || []).length;
  el('releases-count').textContent = (config.releases || []).length;
  renderUpdates();

  (config.roadmap || []).forEach((item, index) => {
    const article = make('article', 'roadmap-item');
    article.append(make('span', 'roadmap-number', `0${index + 1}`), make('span', 'planned-tag', 'PLANNED'), make('h3', '', item.title), make('p', '', item.detail));
    el('roadmap-items').appendChild(article);
  });

  const menu = document.querySelector('.menu-toggle');
  const nav = el('navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });

})();
