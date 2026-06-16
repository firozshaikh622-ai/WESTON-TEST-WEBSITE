// Weston Engineers — main script

(function () {
  'use strict';

  // ── HAMBURGER ──
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');

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

  // ── SHOW MORE / SHOW LESS SERVICES ──
  var showMoreBtn = document.getElementById('show-more-btn');
  var hiddenSvcs  = document.querySelectorAll('.hidden-svc');
  var expanded    = false;

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function () {
      expanded = !expanded;
      hiddenSvcs.forEach(function (el) {
        el.style.display = expanded ? 'flex' : 'none';
      });
      showMoreBtn.textContent = expanded ? 'Show Less' : 'Show More';
    });
  }

  // ── REVIEWS CAROUSEL ──
  var track    = document.getElementById('reviews-track');
  var cards    = track ? track.querySelectorAll('.review-card') : [];
  var dotsWrap = document.getElementById('rev-dots');
  var revCurrent = 0;
  var revTotal   = cards.length;
  var cardWidth  = 0;

  function getCardWidth() {
    if (!cards.length) return 0;
    var outer = track.parentElement;
    var gap = 24; // 2.4rem gap in px (assuming 10px base)
    // each card is 50% minus half gap on desktop, 100% on mobile
    if (window.innerWidth <= 900) {
      return outer.clientWidth;
    }
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
      (function (idx) {
        d.addEventListener('click', function () { goToRev(idx); });
      })(i);
      dotsWrap.appendChild(d);
    }
  }

  function goToRev(idx) {
    var perPage = window.innerWidth <= 900 ? 1 : 2;
    var maxIdx  = Math.ceil(revTotal / perPage) - 1;
    revCurrent  = Math.max(0, Math.min(idx, maxIdx));
    var cw      = getCardWidth();
    var gap     = window.innerWidth <= 900 ? 0 : 24;
    track.style.transform = 'translateX(-' + (revCurrent * (cw + gap)) + 'px)';
    var dots = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
    dots.forEach(function (d, i) { d.classList.toggle('active', i === revCurrent); });
  }

  if (revTotal > 0) {
    buildRevDots();
    document.getElementById('rev-prev').addEventListener('click', function () { goToRev(revCurrent - 1); });
    document.getElementById('rev-next').addEventListener('click', function () { goToRev(revCurrent + 1); });
    window.addEventListener('resize', function () { buildRevDots(); goToRev(0); });
  }

  // ── COUNTER ANIMATION ──
  function animateCount(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var suffix   = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start    = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statEls  = document.querySelectorAll('[data-target]');
  var counted  = false;

  if ('IntersectionObserver' in window && statEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          statEls.forEach(animateCount);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(document.querySelector('.stats-section'));
  } else {
    statEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || '');
    });
  }

  // ── NAVBAR SHADOW ON SCROLL ──
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.55)'
      : 'none';
  }, { passive: true });

  // ── DOTTED SURFACE (ported from twenty-first.dev React/Three.js component) ──
  (function initDottedSurface() {
    var container = document.getElementById('dotted-surface');
    if (!container || typeof THREE === 'undefined') return;

    var SEPARATION = 150;
    var AMOUNTX    = 40;
    var AMOUNTY    = 60;

    // Scene
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x111111, 2000, 10000);

    // Camera — exact values from original component
    var camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 355, 1220);

    // Renderer — transparent so dark hero bg shows through
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Build particle positions + colours
    var positions = [];
    var colors    = [];

    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        );
        // warm golden-orange tint to match brand on dark bg
        colors.push(0.96, 0.65, 0.22);
      }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colors,    3));

    var material = new THREE.PointsMaterial({
      size:         8,
      vertexColors: true,
      transparent:  true,
      opacity:      0.55,
      sizeAttenuation: true
    });

    var points = new THREE.Points(geometry, material);
    scene.add(points);

    var count       = 0;
    var animationId = null;

    function animate() {
      animationId = requestAnimationFrame(animate);

      var posAttr = geometry.attributes.position;
      var pos     = posAttr.array;
      var i = 0;

      // Exact sine-wave logic from original
      for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
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
