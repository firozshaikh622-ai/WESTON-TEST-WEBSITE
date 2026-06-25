// Weston Engineers — home hero: floating 3D architectural blueprint (Three.js)

(function () {
  'use strict';
  var canvas = document.getElementById('scene-canvas');
  var wrap = document.getElementById('hero-3d-wrap');
  if (!canvas || typeof THREE === 'undefined') return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0C0C0C, 0.045);

  var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.4, 11);
  camera.lookAt(0, 0.2, 0);

  scene.add(new THREE.AmbientLight(0x383838, 0.9));
  var key = new THREE.DirectionalLight(0xFFF1D6, 1.9);
  key.position.set(5, 6, 7);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0xC9A227, 0.9);
  rim.position.set(-6, -2, -5);
  scene.add(rim);
  var fill = new THREE.PointLight(0xfff3d6, 0.35, 30);
  fill.position.set(-3, 3, 4);
  scene.add(fill);

  // ── BLUEPRINT TEXTURE (procedural, drawn on canvas) ──
  function buildBlueprintTexture() {
    var cw = 1200, ch = 1600;
    var c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    var ctx = c.getContext('2d');

    ctx.fillStyle = '#1B4A78';
    ctx.fillRect(0, 0, cw, ch);
    var vg = ctx.createRadialGradient(cw/2, ch/2, 80, cw/2, ch/2, ch*0.75);
    vg.addColorStop(0, 'rgba(255,255,255,0.05)');
    vg.addColorStop(1, 'rgba(0,0,0,0.28)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, cw, ch);

    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    for (var gx = 0; gx <= cw; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke(); }
    for (var gy = 0; gy <= ch; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke(); }

    ctx.strokeStyle = 'rgba(230,238,250,0.9)';
    ctx.lineWidth = 3;
    ctx.strokeRect(120, 140, cw - 240, ch - 460);

    // interior partitions
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(120, 560); ctx.lineTo(cw - 360, 560); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cw - 360, 560); ctx.lineTo(cw - 360, ch - 320); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(420, 140); ctx.lineTo(420, 560); ctx.stroke();

    // door swing arcs
    ctx.strokeStyle = 'rgba(230,238,250,0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(420, 560, 90, Math.PI, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cw - 360, 760, 90, Math.PI * 0.5, Math.PI); ctx.stroke();

    // dimension lines
    function dim(x1, y1, x2, y2, label) {
      ctx.strokeStyle = 'rgba(230,238,250,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.fillStyle = 'rgba(230,238,250,0.85)';
      ctx.font = '20px Georgia';
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      ctx.save();
      ctx.translate(mx, my - 8);
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }
    dim(120, 95, cw - 120, 95, "14.60 M");
    dim(60, 140, 60, ch - 320, "21.30 M");

    // compass rose
    ctx.save();
    ctx.translate(200, 240);
    ctx.strokeStyle = 'rgba(201,162,39,0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 46, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -38); ctx.lineTo(-9, 6); ctx.lineTo(9, 6); ctx.closePath();
    ctx.fillStyle = 'rgba(201,162,39,0.9)'; ctx.fill();
    ctx.fillStyle = 'rgba(230,238,250,0.9)';
    ctx.font = 'bold 18px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -50);
    ctx.restore();
    ctx.textAlign = 'left';

    // title block
    var tbY = ch - 280;
    ctx.strokeStyle = 'rgba(201,162,39,0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(120, tbY, cw - 240, 180);
    ctx.beginPath(); ctx.moveTo(120, tbY + 60); ctx.lineTo(cw - 120, tbY + 60); ctx.stroke();

    ctx.fillStyle = '#EDEAE3';
    ctx.font = '900 34px Georgia';
    ctx.fillText('WESTON ENGINEERS', 150, tbY + 42);
    ctx.font = '18px Georgia';
    ctx.fillStyle = 'rgba(237,234,227,0.75)';
    ctx.fillText('PROJECT MANAGEMENT CONSULTANCY  ·  KOLKATA & WEST BENGAL', 150, tbY + 100);
    ctx.fillText('DRAWING NO. WE-2026-01      SCALE 1:100      REV A', 150, tbY + 135);

    // faint monogram watermark
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.translate(cw / 2, ch / 2 - 100);
    ctx.rotate(-0.4);
    ctx.fillStyle = '#E0BD4E';
    ctx.font = '900 420px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('W', 0, 0);
    ctx.restore();

    var tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
  }

  var W = 5.6, H = 7.4, DEPTH = 0.06;
  var frontTex = buildBlueprintTexture();
  var edgeMat = new THREE.MeshStandardMaterial({ color: 0xC9A227, roughness: 0.35, metalness: 0.7 });
  var frontMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.7, metalness: 0.05 });
  var backMat = new THREE.MeshStandardMaterial({ color: 0x0E2236, roughness: 0.85, metalness: 0.05 });

  var sheetGeo = new THREE.BoxGeometry(W, H, DEPTH);
  var sheet = new THREE.Mesh(sheetGeo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]);
  sheet.rotation.set(-0.12, 0.5, 0.05);
  scene.add(sheet);

  // soft contact shadow beneath the sheet
  var shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256; shadowCanvas.height = 256;
  var sctx = shadowCanvas.getContext('2d');
  var sg = sctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  sg.addColorStop(0, 'rgba(0,0,0,0.55)');
  sg.addColorStop(1, 'rgba(0,0,0,0)');
  sctx.fillStyle = sg;
  sctx.fillRect(0, 0, 256, 256);
  var shadowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false });
  var shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -4.6;
  scene.add(shadowMesh);

  // ── DRIFTING GOLD DUST PARTICLES ──
  var DUST = 140;
  var dustPos = new Float32Array(DUST * 3);
  for (var i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  var dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  var dustMat = new THREE.PointsMaterial({ color: 0xE0BD4E, size: 0.035, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
  var dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ── SCROLL PARALLAX (CSS transform on wrapper) ──
  var heroEl = document.querySelector('.hero');
  function syncParallax() {
    if (!wrap || !heroEl) return;
    var heroH = heroEl.offsetHeight || window.innerHeight;
    var progress = Math.max(0, Math.min(1, window.scrollY / heroH));
    wrap.style.transform = 'translateY(' + (progress * -70) + 'px) scale(' + (1 - progress * 0.1) + ')';
    wrap.style.opacity = String(1 - progress * 1.15);
  }
  window.addEventListener('scroll', syncParallax, { passive: true });
  syncParallax();

  var t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;

    sheet.rotation.y = 0.5 + t * 0.35;
    sheet.rotation.x = -0.12 + Math.sin(t * 0.6) * 0.05;
    sheet.position.y = Math.sin(t * 0.8) * 0.28;

    dust.rotation.y = t * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, { passive: true });
})();
