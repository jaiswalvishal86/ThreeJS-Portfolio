import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";
import vertex from "./shaders/test/vertex.glsl";
import fragment from "./shaders/test/fragment.glsl";
import waterVertex from "./shaders/water/waterVertex.glsl";
import waterFragment from "./shaders/water/waterFragment.glsl";

THREE.ColorManagement.enabled = false;

/**
 * Debug
 */
// const gui = new dat.GUI();

const parameters = {
  materialColor: "#d9d9d9",
};

// gui.addColor(parameters, "materialColor").onChange(() => {
//   material.color.set(parameters.materialColor);
//   partilesMatrial.color.set(parameters.materialColor);
// });

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const debugObject = {};

/**
 * Texture Loader
 */
const loader = new THREE.TextureLoader();
const imageTexture = loader.load("../assets/plant.png");

/**
 * Debug Colors
 */
debugObject.depthColor = "#f0f0f0";
debugObject.surfaceColor = "#fafafa";

/**
 * Materials
 */
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertex,
  fragmentShader: waterFragment,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.5 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },
  },
});
const treeShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  transparent: true,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(5, 5),
    },
    uTime: { value: 0 },
    uTexture: { value: imageTexture },
    uColor: { value: new THREE.Color("orange") },
  },
});

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load("textures/gradients/5.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: 0xfbc8e1,
  gradientMap: gradientTexture,
  // wireframe: true,
});

//Geometry
const treePlaneGeometry = new THREE.PlaneGeometry(3, 2.5, 128, 128);
const waterPlaneGeometry = new THREE.PlaneGeometry(
  window.innerWidth,
  4,
  200,
  200
);

const count = treePlaneGeometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

treePlaneGeometry.setAttribute(
  "aRandom",
  new THREE.BufferAttribute(randoms, 1)
);

//Meshes
const objectDistance = 4;
const mesh1 = new THREE.Mesh(treePlaneGeometry, treeShaderMaterial);

// const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1, 32), material);

const mesh3 = new THREE.Mesh(waterPlaneGeometry, waterMaterial);

// const mesh3 = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
//   material
// );

mesh1.position.y = -objectDistance * 0.07;
// mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 0.4;
mesh3.rotation.x = -Math.PI * 0.5;
// mesh3.position.y = -objectDistance * 2;

mesh1.position.x = 0;
// mesh2.position.x = 2;
// if (window.innerWidth < 990) {
//   mesh2.position.x = 0.8;
// }
// if (window.innerWidth < 600) {
//   mesh2.position.x = 0.4;
//   mesh2.position.y = -objectDistance * 1.1;
// }
// mesh3.position.x = 2;
scene.add(mesh1, mesh3);

// const sectionMeshes = [mesh1, mesh2];

/**
 * Particles
 */
//Geometry
// let particlesCount = 300;
// const postions = new Float32Array(particlesCount * 3);

// for (let i = 0; i < particlesCount; i++) {
//   postions[i * 3 + 0] = (Math.random() - 0.5) * 10;
//   postions[i * 3 + 1] =
//     objectDistance * 0.5 -
//     Math.random() * objectDistance * sectionMeshes.length;
//   postions[i * 3 + 2] = (Math.random() - 0.5) * 10;
// }

// const particlesGeometry = new THREE.BufferGeometry();
// particlesGeometry.setAttribute(
//   "position",
//   new THREE.BufferAttribute(postions, 3)
// );

// //Material
// const partilesMatrial = new THREE.PointsMaterial({
//   color: parameters.materialColor,
//   sizeAttenuation: true,
//   size: 0.03,
// });

// //Points
// const particles = new THREE.Points(particlesGeometry, partilesMatrial);
// scene.add(particles);

/**
 * Directional Light
 */
// const directionalLight = new THREE.DirectionalLight("#7e7e8f", 1);
// directionalLight.position.set(0, 1, 0);
// scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll Y
 */
// let scrollY = window.scrollY;
// let currentSection = 0;

// window.addEventListener("scroll", () => {
//   scrollY = window.scrollY;
//   const newSection = Math.round(scrollY / sizes.height);

//   if (newSection != currentSection) {
//     currentSection = newSection;

//     gsap.to(sectionMeshes[currentSection].rotation, {
//       duration: 1.5,
//       ease: "power2.inOut",
//       x: "+=4",
//       y: "+=2",
//       z: "+=1",
//     });
//   }
// });

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //Update materials
  treeShaderMaterial.uniforms.uTime.value = elapsedTime;
  waterMaterial.uniforms.uTime.value = elapsedTime;

  //Animate Camera
  camera.position.y = -scrollY / sizes.height;

  const parallexX = cursor.x * 0.5;
  const parallexY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallexX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallexY - cameraGroup.position.y) * 5 * deltaTime;

  //Animate
  // for (const mesh of sectionMeshes) {
  //   mesh.rotation.x += deltaTime * 0.4;
  //   mesh.rotation.y += deltaTime * 0.35;
  // }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
