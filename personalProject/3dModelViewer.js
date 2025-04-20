import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';


const container = document.getElementById('three-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 3, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(ambientLight, directionalLight);

// 기본 XY 격자 (바닥면)
const gridXY = new THREE.GridHelper(10, 20, 0xdddddd, 0xcccccc);
gridXY.position.y = -3
scene.add(gridXY);

// YZ 평면 격자 (정면에 세로로 붙이기)
const gridYZ = new THREE.GridHelper(10, 20, 0xdddddd, 0xdddddd);
gridYZ.rotation.z = Math.PI / 2;     // Z축 기준 회전 → YZ 평면
gridYZ.position.x = -5;              // 왼쪽 벽면 위치
gridYZ.position.y = 2;              // 왼쪽 벽면 위치
scene.add(gridYZ);

// ZX 평면 격자 (측면에 세로로 붙이기)
const gridZX = new THREE.GridHelper(10, 20, 0xdddddd, 0xdddddd);
gridZX.rotation.x = Math.PI / 2;     // X축 기준 회전 → ZX 평면
gridZX.position.y = 2;              // 뒤쪽 벽면 위치
gridZX.position.z = -5;              // 뒤쪽 벽면 위치
scene.add(gridZX);


// Load GLTF model
let model;
const loader = new GLTFLoader();
loader.load('./models/SampleModel.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(0.8, 0.8, 0.8);
  scene.add(model);
}, undefined, (error) => {
  console.error('모델 로딩 실패:', error);
});

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// View control
document.getElementById('frontViewBtn').addEventListener('click', () => {
    gsap.to(camera.position, {
      duration: 1,
      x: 0,
      y: 0,
      z: 5,
      onUpdate: () => controls.update()
    });
  
    gsap.to(controls.target, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      onUpdate: () => controls.update()
    });
  });
  

// Direction buttons
document.querySelectorAll('.direction-controls button').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.direction;
      if (!model) return;
  
      const angle = Math.PI / 2;
      const rotation = model.rotation;
  
      let targetRotation = { x: rotation.x, y: rotation.y };
  
      switch (dir) {
        case 'north':
          targetRotation.x = rotation.x - angle;
          break;
        case 'south':
          targetRotation.x = rotation.x + angle;
          break;
        case 'east':
          targetRotation.y = rotation.y + angle;
          break;
        case 'west':
          targetRotation.y = rotation.y - angle;
          break;
      }
  
      gsap.to(model.rotation, {
        duration: 1,
        x: targetRotation.x,
        y: targetRotation.y
      });
    });
  });
  