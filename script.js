// Weston Engineers — shared site script

(function () {
  'use strict';

  // ── NAVBAR SOLID-ON-SCROLL ──
  var navbar = document.getElementById('navbar');
  function syncNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', syncNavbar, { passive: true });
  syncNavbar();

  // ── HAMBURGER ──
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ── COUNTER ANIMATION ──
  var statEls = document.querySelectorAll('[data-target]');
  var counted = false;

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statEls.length) {
    var statsSection = document.querySelector('.stats-section');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statEls.forEach(animateCount);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (statsSection) io.observe(statsSection);
  } else {
    statEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
    });
  }

  // ── REVIEWS CAROUSEL (projects page) ──
  var track = document.getElementById('reviews-track');
  var cards = track ? track.querySelectorAll('.review-card') : [];
  var dotsWrap = document.getElementById('rev-dots');
  var revCurrent = 0;
  var revTotal = cards.length;

  function getCardWidth() {
    if (!cards.length) return 0;
    var outer = track.parentElement;
    var gap = 24;
    if (window.innerWidth <= 900) return outer.clientWidth;
    return (outer.clientWidth - gap) / 2;
  }

  function buildRevDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    var maxDot = window.innerWidth <= 900 ? revTotal : Math.ceil(revTotal / 2);
    for (var i = 0; i < maxDot; i++) {
      var d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Review ' + (i + 1));
      (function (idx) { d.addEventListener('click', function () { goToRev(idx); }); })(i);
      dotsWrap.appendChild(d);
    }
  }

  function goToRev(idx) {
    var perPage = window.innerWidth <= 900 ? 1 : 2;
    var maxIdx = Math.ceil(revTotal / perPage) - 1;
    revCurrent = Math.max(0, Math.min(idx, maxIdx));
    var cw = getCardWidth();
    var gap = window.innerWidth <= 900 ? 0 : 24;
    track.style.transform = 'translateX(-' + (revCurrent * (cw + gap)) + 'px)';
    var dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
    dots.forEach(function (d, i) { d.classList.toggle('active', i === revCurrent); });
  }

  if (revTotal > 0) {
    buildRevDots();
    var prevBtn = document.getElementById('rev-prev');
    var nextBtn = document.getElementById('rev-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { goToRev(revCurrent - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goToRev(revCurrent + 1); });
    window.addEventListener('resize', function () { buildRevDots(); goToRev(0); });
  }

  // ── SERVICES SHOW MORE (kept for compatibility, unused on rebuilt services page) ──
  var showMoreBtn = document.getElementById('show-more-btn');
  var hiddenSvcs = document.querySelectorAll('.hidden-svc');
  var expanded = false;
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function () {
      expanded = !expanded;
      hiddenSvcs.forEach(function (el) { el.style.display = expanded ? 'flex' : 'none'; });
      showMoreBtn.textContent = expanded ? 'Show Less' : 'Show More';
    });
  }

  // ── DOTTED SURFACE (page-hero background on subpages) ──
  (function initDottedSurface() {
    var container = document.getElementById('dotted-surface');
    if (!container || typeof THREE === 'undefined') return;

    var SEPARATION = 150;
    var AMOUNTX = 30;
    var AMOUNTY = 30;

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x13001C, 1800, 9000);

    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 320, 1100);

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    var positions = [];
    var colors = [];
    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        positions.push(ix * SEPARATION - (AMOUNTX * SEPARATION) / 2, 0, iy * SEPARATION - (AMOUNTY * SEPARATION) / 2);
        colors.push(1.0, 0.55, 0.1);
      }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    var material = new THREE.PointsMaterial({ size: 7, vertexColors: true, transparent: true, opacity: 0.45, sizeAttenuation: true });
    var points = new THREE.Points(geometry, material);
    scene.add(points);

    var count = 0;
    function animate() {
      requestAnimationFrame(animate);
      var posAttr = geometry.attributes.position;
      var pos = posAttr.array;
      var i = 0;
      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] = Math.sin((ix + count) * 0.3) * 40 + Math.sin((iy + count) * 0.5) * 40;
          i++;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.08;
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize, { passive: true });
    animate();
  })();

})();
