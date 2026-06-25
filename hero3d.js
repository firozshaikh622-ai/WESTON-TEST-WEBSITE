// Weston Engineers — home hero: building rises floor-by-floor (Three.js)

(function () {
  'use strict';
  var canvas = document.getElementById('scene-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x13001C);
  scene.fog = new THREE.Fog(0x13001C, 18, 60);

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(13, 9, 17);
  camera.lookAt(0, 4, 0);

  scene.add(new THREE.AmbientLight(0x4a3a55, 1.2));
  var key = new THREE.DirectionalLight(0xFF8B19, 1.4);
  key.position.set(8, 14, 6);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x38BDF8, 0.6);
  rim.position.set(-10, 6, -8);
  scene.add(rim);

  var grid = new THREE.GridHelper(40, 40, 0x3a2a48, 0x231530);
  scene.add(grid);

  var buildingGroup = new THREE.Group();
  scene.add(buildingGroup);

  var FLOORS = 10;
  var floorMeshes = [];
  var floorH = 0.9;
  var w = 3.2, d = 3.2;

  for (var i = 0; i < FLOORS; i++) {
    var isAccent = i % 4 === 0;
    var mat = new THREE.MeshStandardMaterial({ color: isAccent ? 0xFF8B19 : 0xE9E2F0, roughness: 0.55, metalness: 0.15 });
    var geo = new THREE.BoxGeometry(w, floorH * 0.86, d);
    var mesh = new THREE.Mesh(geo, mat);
    var targetY = i * floorH + floorH / 2;
    mesh.position.set(0, targetY, 0);
    mesh.scale.y = 0.001;
    mesh.userData.targetY = targetY;
    mesh.userData.delay = i * 0.35;
    buildingGroup.add(mesh);
    floorMeshes.push(mesh);

    if (!isAccent) {
      var winMat = new THREE.MeshStandardMaterial({ color: 0x120819, roughness: 0.3 });
      var winGeo = new THREE.BoxGeometry(w * 0.92, floorH * 0.4, d * 0.92);
      var win = new THREE.Mesh(winGeo, winMat);
      win.position.copy(mesh.position);
      win.scale.y = 0.001;
      win.userData.targetY = targetY;
      win.userData.delay = i * 0.35;
      buildingGroup.add(win);
      floorMeshes.push(win);
    }
  }

  var craneGroup = new THREE.Group();
  var mastMat = new THREE.MeshStandardMaterial({ color: 0x17772C, roughness: 0.6 });
  var mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 11, 8), mastMat);
  mast.position.set(3.6, 5.5, -2.4);
  craneGroup.add(mast);
  var arm = new THREE.Mesh(new THREE.BoxGeometry(6, 0.18, 0.18), mastMat);
  arm.position.set(1.2, 10.8, -2.4);
  craneGroup.add(arm);
  var counterArm = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 0.18), mastMat);
  counterArm.position.set(4.8, 10.8, -2.4);
  craneGroup.add(counterArm);
  var hookCable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3, 6), new THREE.MeshStandardMaterial({ color: 0x444444 }));
  hookCable.position.set(-1.2, 9.3, -2.4);
  craneGroup.add(hookCable);
  scene.add(craneGroup);

  var groundMat = new THREE.MeshStandardMaterial({ color: 0x150A1F, roughness: 1 });
  var ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  scene.add(ground);

  var t = 0;
  function ease(x) { return 1 - Math.pow(1 - x, 3); }

  function animate() {
    requestAnimationFrame(animate);
    t += 0.016;

    var cycle = t % 9;
    floorMeshes.forEach(function (m) {
      var localT = Math.max(0, Math.min(1, (cycle - m.userData.delay) / 1.1));
      var s = ease(localT);
      m.scale.y = Math.max(0.001, s);
      m.position.y = m.userData.targetY - (1 - s) * 0.4;
    });

    var angle = t * 0.18;
    camera.position.x = Math.cos(angle) * 19;
    camera.position.z = Math.sin(angle) * 19;
    camera.position.y = 9;
    camera.lookAt(0, 4.2, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, { passive: true });
})();
