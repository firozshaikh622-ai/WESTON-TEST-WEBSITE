// Home hero: video background (swapped in from the Three.js tower) + Lenis smooth scroll.
// Scoped to the hero's own scroll-out only — not the full-page scroll-scrub/porthole
// system from the video-landing prototype this was adapted from.
(function () {
  'use strict';

  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  var hero = document.getElementById('hero');
  var video = document.getElementById('hero-bg-video');
  if (!hero || !video) return;

  function onScroll() {
    var heroHeight = hero.offsetHeight;
    var progress = Math.min(1, Math.max(0, window.scrollY / heroHeight));
    // Subtle zoom-out + fade as the hero scrolls away, in place of the tower's
    // own idle animation — keeps the transition from feeling like a hard cut.
    video.style.opacity = 1 - progress * 0.6;
    video.style.transform = 'scale(' + (1 + progress * 0.06) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
