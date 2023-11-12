import * as THREE from "three";
// import * as dat from "lil-gui";
import gsap from "gsap";
import vertex from "./shaders/test/vertex.glsl";
import fragment from "./shaders/test/fragment.glsl";
import waterVertex from "./shaders/water/waterVertex.glsl";
import waterFragment from "./shaders/water/waterFragment.glsl";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const container = document.querySelector(".gallery-wrapper");
const rows = document.querySelectorAll(".row");
const aboutSection = document.getElementById("about-section");

const loaderElement = document.querySelector(".loader-overlay");
const loadingBarElement = document.querySelector(".loading-bar");

const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(0.5, () => {
      gsap.fromTo(
        loaderElement,
        { yPercent: "0" },
        { duration: 1, yPercent: "-100", ease: "power4.inOut" }
      );
      loadingBarElement.classList.add(".ended");
      loadingBarElement.style.transform = "";
    });
  },
  (itemUrl, itemLoaded, itemTotal) => {
    const progressRatio = itemLoaded / itemTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);

gsap.registerPlugin(ScrollTrigger);

const timeline = gsap.timeline();

timeline.fromTo(
  aboutSection,
  {
    scaleX: 0.9,
    borderRadius: "32",
  },
  {
    scaleX: 1,
    borderRadius: "8",
    scrollTrigger: {
      trigger: aboutSection,
      start: "top+20% bottom",
      end: "bottom bottom",
      scrub: 1, // Enables smooth scrolling effect
    },
  }
);

rows.forEach((row, index) => {
  const direction = index % 2 === 0 ? 1 : -1;
  timeline
    .to(row, {
      x: `${index * -20 * direction}%`, // Adjust the value as needed
      duration: 1,
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "+=200%",
        scrub: 1, // Enables smooth scrolling effect
        // pin: true, // Pins the row during the animation
        anticipatePin: 1, // Improves the scrolling anticipation
      },
    })
    .to(
      rows[0],
      {
        x: "-20%",
        duration: 1,
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "+=200%",
          scrub: 1, // Enables smooth scrolling effect
          // pin: true, // Pins the row during the animation
          anticipatePin: 1, // Improves the scrolling anticipation
        },
      },
      "<"
    );
});

let mainCarousel = ".work-slider";
let mainSlides = ".work-slider_slide";
let parallaxPercentage = 49;

let flkty = new Flickity(mainCarousel, {
  contain: true,
  freeScroll: true,
  percentPosition: true,
  pageDots: false,
  cellSelector: mainSlides,
  cellAlign: "left",
  resize: true,
  selectedAttraction: 0.01,
  dragThreshold: 1,
  freeScrollFriction: 0.05,
});

flkty.on("scroll", function (progress) {
  setImagePositions();
  $(".progress-fill").css("width", `${progress * 100}%`);
});

function setImagePositions() {
  $(mainSlides).each(function (index) {
    let targetElement = $(this);
    let elementOffset =
      targetElement.offset().left +
      targetElement.width() -
      $(mainCarousel).offset().left;
    let parentWidth = $(mainCarousel).width() + targetElement.width();
    let myProgress = elementOffset / parentWidth;
    let slideProgress = parallaxPercentage * myProgress;
    if (slideProgress > parallaxPercentage) {
      slideProgress = parallaxPercentage;
    } else if (slideProgress < 0) {
      slideProgress = 0;
    }
    targetElement
      .find(".work-image")
      .css("transform", `translateX(-${slideProgress}%)`);
  });
}
setImagePositions();

const lenis = new Lenis({ lerp: 0.1, duration: 1 });

lenis.on("scroll", (e) => {
  // console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

THREE.ColorManagement.enabled = false;

/**
 * Debug
 */
// const gui = new dat.GUI();

const parameters = {
  materialColor: "#d9d9d9",
};

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
const loader = new THREE.TextureLoader(loadingManager);
const imageTexture = loader.load("../assets/greenPlant.png");

/**
 * Debug Colors
 */
debugObject.depthColor = "#E6EFF2";
debugObject.surfaceColor = "#EEF4F6";

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
const treeShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  transparent: true,
  uniforms: {
    uFrequency: {
      value: new THREE.Vector2(5, 5),
    },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uTexture: { value: imageTexture },
    uColor: { value: new THREE.Color("orange") },
    uResolution: { value: new THREE.Vector2() },
    uDisplace: { value: 1 },
    uSpread: { value: 10 },
    uNoise: { value: 10 },
  },
});

const textureLoader = new THREE.TextureLoader(loadingManager);
const gradientTexture = textureLoader.load("textures/gradients/5.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: 0xfbc8e1,
  gradientMap: gradientTexture,
  // wireframe: true,
});

//Geometry
const treePlaneGeometry = new THREE.PlaneGeometry(10, 5, 1000, 1000);
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

mesh1.position.y = -objectDistance * 0.1;
// mesh2.position.y = -objectDistance * 1;
mesh3.position.y = -objectDistance * 0.4;
mesh3.rotation.x = -Math.PI * 0.5;
// mesh3.position.y = -objectDistance * 2;

// mesh2.position.x = 2;
// if (window.innerWidth < 990) {
//   mesh2.position.x = 0.8;
// }
// if (window.innerWidth < 600) {
//   mesh2.position.x = 0.4;
//   mesh2.position.y = -objectDistance * 1.1;
// }
// mesh3.position.x = 2;
scene.add(mesh1);

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
// const cursor = {};
// cursor.x = 0;
// cursor.y = 0;
const cursor = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;

  treeShaderMaterial.uniforms.uMouse.value = cursor;
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
  // waterMaterial.uniforms.uTime.value = elapsedTime;

  //Animate Camera
  camera.position.y = -scrollY / sizes.height;

  const parallexX = cursor.x * 0.5;
  const parallexY = -cursor.y * 0.5;
  cameraGroup.position.x += (parallexX - cameraGroup.position.x) * deltaTime;
  cameraGroup.position.y += (parallexY - cameraGroup.position.y) * deltaTime;

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
