// Weston Engineers — home hero: realistic floating 3D gold-trimmed tower, scroll-driven (Three.js + GSAP)

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

(function () {
  var canvas = document.getElementById('scene-canvas');
  var wrap = document.getElementById('hero-3d-wrap');
  if (!canvas) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0C0C0C, 0.038);

  // realistic studio environment for true metal/glass reflections
  var pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.2, 14);
  camera.lookAt(0, 1.6, 0);

  scene.add(new THREE.AmbientLight(0x383838, 0.7));
  var key = new THREE.DirectionalLight(0xFFF1D6, 2.1);
  key.position.set(5, 8, 7);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0xC9A227, 1.0);
  rim.position.set(-6, -1, -5);
  scene.add(rim);
  var fill = new THREE.PointLight(0xfff3d6, 0.4, 30);
  fill.position.set(-3, 4, 4);
  scene.add(fill);

  // ── MATERIALS ──
  var goldMat = new THREE.MeshPhysicalMaterial({ color: 0xC9A227, roughness: 0.2, metalness: 1.0, clearcoat: 0.7, clearcoatRoughness: 0.15, envMapIntensity: 1.4 });
  var glassMat = new THREE.MeshPhysicalMaterial({ color: 0x0E2236, roughness: 0.18, metalness: 0.25, clearcoat: 1.0, clearcoatRoughness: 0.1, envMapIntensity: 1.1 });

  // ── GOLD-TRIMMED GLASS TOWER ──
  var tower = new THREE.Group();

  var tiers = [
    { w: 3.6, d: 3.6, h: 3.4, y: 1.7 },
    { w: 2.5, d: 2.5, h: 2.6, y: 0 },
    { w: 1.6, d: 1.6, h: 2.0, y: 0 }
  ];

  var cursorY = 0;
  tiers.forEach(function (tier, idx) {
    var body = new THREE.Mesh(new THREE.BoxGeometry(tier.w, tier.h, tier.d), glassMat);
    body.position.y = cursorY + tier.h / 2;
    tower.add(body);

    // gilded corner trim running the height of this tier
    var trimSize = 0.09;
    var offX = tier.w / 2 - trimSize / 2;
    var offZ = tier.d / 2 - trimSize / 2;
    [[offX, offZ], [-offX, offZ], [offX, -offZ], [-offX, -offZ]].forEach(function (pos) {
      var trim = new THREE.Mesh(new THREE.BoxGeometry(trimSize, tier.h + 0.06, trimSize), goldMat);
      trim.position.set(pos[0], cursorY + tier.h / 2, pos[1]);
      tower.add(trim);
    });

    // gold ledge band at the base of this tier (skip the ground floor)
    if (idx > 0) {
      var bandH = 0.12;
      var band = new THREE.Mesh(new THREE.BoxGeometry(tier.w + 0.3, bandH, tier.d + 0.3), goldMat);
      band.position.y = cursorY + bandH / 2;
      tower.add(band);
    }

    // a few horizontal window-mullion accents per tier (thin gold strips)
    var bandsPerTier = Math.max(1, Math.round(tier.h / 1.1));
    for (var b = 1; b < bandsPerTier; b++) {
      var my = cursorY + (tier.h / bandsPerTier) * b;
      var mullion = new THREE.Mesh(new THREE.BoxGeometry(tier.w + 0.02, 0.035, tier.d + 0.02), goldMat);
      mullion.position.y = my;
      tower.add(mullion);
    }

    cursorY += tier.h;
  });

  // spire on top
  var spire = new THREE.Mesh(new THREE.ConeGeometry(0.16, 1.3, 16), goldMat);
  spire.position.y = cursorY + 0.65;
  tower.add(spire);
  var spireBall = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), goldMat);
  spireBall.position.y = cursorY + 1.35;
  tower.add(spireBall);

  tower.position.y = -2.6;
  scene.add(tower);

  // soft contact shadow beneath the tower
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
  var DUST = 160;
  var dustPos = new Float32Array(DUST * 3);
  for (var i = 0; i < DUST; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 16;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  var dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  var dustMat = new THREE.PointsMaterial({ color: 0xE0BD4E, size: 0.035, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false });
  var dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ── BLOOM POST-PROCESSING (soft glow on gold + dust) ──
  var composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  var bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.55, 0.4, 0.78);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ── SCROLL-DRIVEN MOTION (GSAP ScrollTrigger scrub + CSS parallax) ──
  var scrollSpin = 0;
  var gsapReady = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (gsapReady) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: function (self) {
        scrollSpin = self.progress * Math.PI * 1.6;
        if (wrap) {
          wrap.style.transform = 'translateY(' + (self.progress * -90) + 'px) scale(' + (1 - self.progress * 0.12) + ')';
          wrap.style.opacity = String(1 - self.progress * 1.15);
        }
      }
    });
  } else {
    var heroEl = document.querySelector('.hero');
    window.addEventListener('scroll', function () {
      if (!wrap || !heroEl) return;
      var heroH = heroEl.offsetHeight || window.innerHeight;
      var p = Math.max(0, Math.min(1, window.scrollY / heroH));
      scrollSpin = p * Math.PI * 1.6;
      wrap.style.transform = 'translateY(' + (p * -90) + 'px) scale(' + (1 - p * 0.12) + ')';
      wrap.style.opacity = String(1 - p * 1.15);
    }, { passive: true });
  }

  var t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.012;

    tower.rotation.y = 0.6 + t * 0.28 + scrollSpin;
    tower.position.y = -2.6 + Math.sin(t * 0.8) * 0.25;

    dust.rotation.y = t * 0.03;

    composer.render();
  }
  animate();

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    bloom.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, { passive: true });
})();
