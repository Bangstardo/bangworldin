import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/* setting the scene */

const scene = new THREE.Scene();

/* perspective camera mimics duh perspective, fov, aspect ratio, view frustum */

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

/* create the renderer selecting the canvas in our HTML with id bg */

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

/* set the size of the renderer and the camera position */

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

/* render the renderer lol*/

renderer.render(scene, camera);

/* This part will create shapes torus geometry */

const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); 
const material = new THREE.MeshBasicMaterial( { color: 0x2e2e2e } ); 
const torusKnot = new THREE.Mesh( geometry, material ); 

/* adds the shape onto the screen */

scene.add( torusKnot );

/* This part defines the lighting in the room */

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(3,3,3)
const ambienLight = new THREE.AmbientLight(0x2e2e2e);

/* this part adds the scene into the room */

scene.add(pointLight, ambienLight)

/* helpers */

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper)

/* orbit controls, the ones that control the camera angle when scrolling */

const controls = new OrbitControls(camera, renderer.domElement);

/* creating random objects or stars */

function addStar() {
  const geometry = new THREE.ConeGeometry(5, 20, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff});
  const star = new THREE.Mesh( geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x,y,z);
  scene.add(star)
}

Array(44).fill().forEach(addStar)

/* this defines the background we have the cementery */

const spaceTexture = new THREE.TextureLoader().load('cementery.jpg');
scene.background = spaceTexture

/* defining the the cube with a texture */

const bangstardTexture = new THREE.TextureLoader().load('face.png');

const bangstard = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: bangstardTexture})
);

scene.add(bangstard)

/* making a sphere */

const sphereTexture = new THREE.TextureLoader().load('eye.jpg');
const normalTexture = new THREE.TextureLoader().load('eye.jpg');

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: sphereTexture,
    normalMap: normalTexture
  } )
); 

scene.add(sphere)

/* positioning elements on the dom */

sphere.position.z = 100;
sphere.position.setX(-10);

bangstard.position.z = -5;
bangstard.position.x = 2;

/* This is where the scroll animation function is defined */

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  sphere.rotation.x += 0.05;
  sphere.rotation.y += 0.075;
  sphere.rotation.z += 0.05;

  bangstard.rotation.y += 0.01;
  bangstard.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

/* this function animates the spinning donnut */

function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();