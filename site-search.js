(function () {
  'use strict';

  var btn = document.getElementById('site-search-btn');
  var panel = document.getElementById('site-search-panel');
  var input = document.getElementById('site-search-input');
  var results = document.getElementById('site-search-results');
  if (!btn || !panel || !input || !results || typeof WESTON_SEARCH_INDEX === 'undefined') return;

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function render(query) {
    var q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '<div class="site-search-hint">Start typing to search pages, services, and articles.</div>';
      return;
    }
    var matches = WESTON_SEARCH_INDEX.filter(function (item) {
      return item.title.toLowerCase().indexOf(q) !== -1 ||
             item.desc.toLowerCase().indexOf(q) !== -1 ||
             item.category.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);

    if (!matches.length) {
      results.innerHTML = '<div class="site-search-empty">No results for &ldquo;' + escapeHtml(query) + '&rdquo;.</div>';
      return;
    }
    results.innerHTML = matches.map(function (item) {
      return '<a class="site-search-result" href="' + item.url + '">' +
        '<div class="site-search-result-tag">' + escapeHtml(item.category) + '</div>' +
        '<div class="site-search-result-title">' + escapeHtml(item.title) + '</div>' +
        '<div class="site-search-result-desc">' + escapeHtml(item.desc) + '</div>' +
        '</a>';
    }).join('');
  }

  function openPanel() {
    panel.classList.add('open');
    setTimeout(function () { input.focus(); }, 10);
  }
  function closePanel() {
    panel.classList.remove('open');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (panel.classList.contains('open')) closePanel();
    else openPanel();
  });
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== btn) closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });
  input.addEventListener('input', function () { render(input.value); });

  render('');
})();
