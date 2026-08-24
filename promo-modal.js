(function () {
  'use strict';

  var STORAGE_KEY = 'westonPromoEchoTowerSeen';
  var SHOW_DELAY_MS = 1500;

  var overlay = document.getElementById('promo-modal-overlay');
  var closeBtn = document.getElementById('promo-modal-close');
  if (!overlay || !closeBtn) return;

  function closeModal() {
    overlay.classList.remove('open');
  }

  function openModal() {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      // sessionStorage unavailable (private browsing etc.) — show once, no persistence
    }
    overlay.classList.add('open');
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  setTimeout(openModal, SHOW_DELAY_MS);
})();
