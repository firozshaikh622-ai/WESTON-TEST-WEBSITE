(function () {
  'use strict';

  var btn = document.getElementById('theme-toggle-btn');
  var menu = document.getElementById('theme-toggle-menu');
  if (!btn || !menu) return;

  var swatches = menu.querySelectorAll('.theme-swatch');

  function markActive(theme) {
    swatches.forEach(function (s) {
      s.classList.toggle('active', s.dataset.swatch === theme);
    });
  }
  markActive(document.documentElement.dataset.theme || 'onyx');

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    menu.classList.toggle('open');
  });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && e.target !== btn) menu.classList.remove('open');
  });

  swatches.forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      var theme = swatch.dataset.swatch;
      if (theme === 'onyx') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('westonTheme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('westonTheme', theme);
      }
      markActive(theme);
      menu.classList.remove('open');
    });
  });
})();
