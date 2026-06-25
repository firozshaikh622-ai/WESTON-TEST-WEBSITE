// Weston Engineers — sitewide scroll-triggered reveal animations (GSAP)

(function () {
  'use strict';
  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  function revealGroup(selector, opts) {
    var groups = document.querySelectorAll(selector);
    groups.forEach(function (group) {
      var items = group.children.length ? Array.prototype.slice.call(group.children) : [group];
      gsap.set(items, { opacity: 0, y: (opts && opts.y) || 36 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: (opts && opts.stagger) || 0.1,
        scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
  }

  revealGroup('.tilt-grid');
  revealGroup('.services-teaser-grid');
  revealGroup('.values-grid');
  revealGroup('.process-grid');
  revealGroup('.testi-strip');
  revealGroup('.contact-cards');
  revealGroup('.gallery-grid', { stagger: 0.06 });
  revealGroup('.svc-items-grid', { stagger: 0.05, y: 18 });

  document.querySelectorAll('.svc-category').forEach(function (cat) {
    gsap.set(cat, { opacity: 0, y: 30 });
    gsap.to(cat, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: cat, start: 'top 88%' } });
  });

  document.querySelectorAll('.section-kicker, .section-title, .section-sub, .svc-intro').forEach(function (el) {
    gsap.set(el, { opacity: 0, y: 24 });
    gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  var storyText = document.querySelector('.story-text');
  var storyVisual = document.querySelector('.story-visual');
  if (storyText) { gsap.set(storyText, { opacity: 0, x: -30 }); gsap.to(storyText, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: storyText, start: 'top 85%' } }); }
  if (storyVisual) { gsap.set(storyVisual, { opacity: 0, x: 30 }); gsap.to(storyVisual, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: storyVisual, start: 'top 85%' } }); }

  var videoWrap = document.querySelector('.video-wrap');
  if (videoWrap) { gsap.set(videoWrap, { opacity: 0, y: 30 }); gsap.to(videoWrap, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: videoWrap, start: 'top 85%' } }); }

  var carousel = document.querySelector('.reviews-carousel-wrap');
  if (carousel) { gsap.set(carousel, { opacity: 0, y: 30 }); gsap.to(carousel, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: carousel, start: 'top 85%' } }); }

  var ctaInner = document.querySelector('.cta-band-inner');
  if (ctaInner) { gsap.set(ctaInner, { opacity: 0, y: 26 }); gsap.to(ctaInner, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: ctaInner, start: 'top 88%' } }); }

  var contactGrid = document.querySelector('.contact-grid');
  if (contactGrid) { gsap.set(contactGrid, { opacity: 0, y: 30 }); gsap.to(contactGrid, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: contactGrid, start: 'top 85%' } }); }
})();
