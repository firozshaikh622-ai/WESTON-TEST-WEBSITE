// Floating WhatsApp click-to-chat widget, injected on every page.
(function () {
  var NUMBER = '919051517176';
  var MESSAGE = "Hi Weston Engineers, I'd like to know more about your services.";

  function init() {
    var wrap = document.createElement('div');
    wrap.className = 'wa-widget';
    wrap.innerHTML =
      '<a class="wa-widget-btn" href="https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(MESSAGE) + '" ' +
      'target="_blank" rel="noopener" aria-label="Chat with Weston Engineers on WhatsApp">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5C11.6 9.2 11.1 8 10.9 7.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.2L2 22l4.9-1.3c1.5.8 3.3 1.3 5.1 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.3c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.5.9.9-3.4-.2-.3C3.5 14.5 3 13.3 3 12c0-4.9 4-8.9 9-8.9s9 4 9 8.9-4 9-9 9z"/></svg>' +
      '<span class="wa-widget-label">Chat on WhatsApp</span>' +
      '</a>';
    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
