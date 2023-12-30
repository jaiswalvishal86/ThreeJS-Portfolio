import * as THREE from "three";
// import * as dat from "lil-gui";
import gsap from "gsap";
import vertex from "./shaders/test/vertex.glsl";
import fragment from "./shaders/test/fragment.glsl";
import fragmentQuad from "./shaders/fragmentQuad.glsl";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const container = document.querySelector(".gallery-wrapper");
const rows = document.querySelectorAll(".row");
const aboutSection = document.getElementById("about-section");
const text = document.getElementById("text");
const loaderElement = document.querySelector(".loader-overlay");
const loadingBarElement = document.querySelector(".loading-bar");
// const magneticCircle = document.getElementById("magneticCircle");
// const allLinks = document.querySelectorAll("a");

// Function to move the magnetic circle to the cursor position
// function moveMagneticCircle(event) {
//   gsap.to(magneticCircle, {
//     x: event.clientX,
//     y: event.clientY,
//     duration: 0.35,
//     ease: "spring(300, 20, 0.5)",
//   });
// }

// Function to show the magnetic circle with a fade-in animation
// function showMagneticCircle() {
//   gsap.to(magneticCircle, {
//     opacity: 1,
//     // scale: 1,
//     duration: 0.4,
//   });
// }

// Function to hide the magnetic circle with a fade-out animation
// function hideMagneticCircle() {
//   gsap.to(magneticCircle, {
//     opacity: 0,
//     duration: 0.4,
//   });
// }

// allLinks.forEach(function (link) {
//   link.addEventListener("mouseenter", function () {
//     gsap.to(magneticCircle, {
//       scale: 5,
//       duration: 0.4,
//       ease: "power1.out",
//     });
//   });
// });

// allLinks.forEach(function (link) {
//   link.addEventListener("mouseleave", function () {
//     gsap.to(magneticCircle, {
//       scale: 1,
//       duration: 0.4,
//     });
//   });
// });

// Add event listeners to track mouse movement
// document.addEventListener("mousemove", function (event) {
//   moveMagneticCircle(event);
//   showMagneticCircle();
// });

// Add event listeners to hide the magnetic circle when the mouse leaves the window
// document.addEventListener("mouseleave", function () {
//   hideMagneticCircle();
// });

const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(0.5, () => {
      timeline
        .to("#loaderText", {
          opacity: 0,
          duration: 0.5,
        })
        .fromTo(
          loaderElement,
          { yPercent: 0 },
          {
            duration: 2,
            yPercent: -100,
            ease: "expo.inOut",
          },
          "<"
        )
        .fromTo(
          mesh1.position,
          {
            y: -1,
          },
          {
            y: 0,
            duration: 2,
            ease: "expo.inOut",
          },
          "<+0.1"
        )
        .fromTo(
          ".hero_container",
          {
            yPercent: 20,
          },
          {
            yPercent: 0,
            duration: 1,
            ease: "expo.easeInOut",
          },
          "<+0.3"
        )
        .fromTo(
          splitHeroHeading.chars,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "sine.easeOut",
            stagger: { from: "center", amount: 0.6, ease: "power1.out" },
            onComplete: () => {
              gsap.to(splitHeroHeading.chars, {
                yPercent: -100,
                stagger: { from: "center", amount: 0.5, ease: "power4.easeIn" },
                scrollTrigger: {
                  trigger: ".hero_container",
                  start: "top, top",
                  end: () =>
                    `+=${
                      document.querySelector(".hero_container").offsetHeight *
                      0.25
                    }`,
                  scrub: 1,
                },
              });
            },
          },
          "<+0.3"
        )
        .fromTo(
          splitHeroPara.words,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "sine.out",
            stagger: { from: "center", amount: 0.5, ease: "power1.out" },
            onComplete: () => {
              gsap.to(splitHeroPara.words, {
                yPercent: -200,
                stagger: { from: "center", amount: 0.5, ease: "power4.easeIn" },
                scrollTrigger: {
                  trigger: ".hero_container",
                  start: "top, top",
                  end: () =>
                    `+=${
                      document.querySelector(".hero_container").offsetHeight *
                      0.1
                    }`,
                  scrub: 1,
                },
              });
            },
          },
          "<+0.2"
        )
        .fromTo(
          splitSubHeading.words,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "sine.out",
            stagger: { from: "center", amount: 0.5, ease: "power1.out" },
            onComplete: () => {
              gsap.to(splitSubHeading.words, {
                yPercent: -200,
                stagger: { from: "center", amount: 0.5, ease: "power4.easeIn" },
                scrollTrigger: {
                  trigger: ".hero_container",
                  start: "top, top",
                  end: () =>
                    `+=${
                      document.querySelector(".hero_container").offsetHeight *
                      0.1
                    }`,
                  scrub: 1,
                },
              });
            },
          },
          "<+0.3"
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
const splitText = new SplitType("#text");
const splitSubText = new SplitType("#subText");
const splitHeading = new SplitType("#heading");
const splitHeroHeading = new SplitType("#hero-heading");
const splitHeroPara = new SplitType("#hero-para");
const splitSubHeading = new SplitType("#hero-sub--text");

timeline
  // .fromTo(
  //   aboutSection,
  //   {
  //     scaleX: 0.96,
  //     borderRadius: "16",
  //   },
  //   {
  //     scaleX: 1,
  //     borderRadius: "8",
  //     scrollTrigger: {
  //       trigger: aboutSection,
  //       start: "top+20% bottom",
  //       end: "bottom bottom",
  //       scrub: true, // Enables smooth scrolling effect
  //     },
  //   }
  // )
  .from(splitText.lines, {
    opacity: 0,
    xPercent: -10,
    stagger: 0.1,
    ease: "power3.Out",
    scrollTrigger: {
      trigger: text,
      scrub: true,
      start: "0px bottom",
      end: "bottom+=200px bottom",
    },
  })
  .from(splitSubText.lines, {
    opacity: 0,
    xPercent: -10,
    stagger: 0.1,
    ease: "power3.Out",
    scrollTrigger: {
      trigger: text,
      scrub: true,
      start: "100px bottom",
      end: "bottom+=200px bottom",
    },
  })
  .from(
    splitHeading.lines,

    {
      opacity: 0,
      xPercent: -10,
      // stagger: 0.5,
      ease: "power4.easeInOut",
      scrollTrigger: {
        trigger: aboutSection,
        scrub: 1,
        start: "top bottom",
        end: "bottom bottom",
      },
    }
  );

rows.forEach((row, index) => {
  console.log(row);
  const direction = index % 2 === 0 ? 1 : -1;
  timeline
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
    )
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
    });
});

const lenis = new Lenis({ lerp: 1, duration: 1 });

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
const sceneCopy = new THREE.Scene();

/**
 * Objects
 */
const debugObject = {};

/**
 * Texture Loader
 */
const loader = new THREE.TextureLoader(loadingManager);
const imageTexture = loader.load("../assets/white.jpeg");

/**
 * Debug Colors
 */
// debugObject.depthColor = "#E6EFF2";
// debugObject.surfaceColor = "#EEF4F6";

/**
 * Materials
 */

const treeShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragmentQuad,
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
    uDisplace: { value: 2 },
    uSpread: { value: 10 },
    uNoise: { value: 8 },
  },
});

// const material = new THREE.MeshBasicMaterial();

//Geometry
const treePlaneGeometry = new THREE.PlaneGeometry(6, 6, 500, 500);

// const count = treePlaneGeometry.attributes.position.count;
// const randoms = new Float32Array(count);

// for (let i = 0; i < count; i++) {
//   randoms[i] = Math.random();
// }

// treePlaneGeometry.setAttribute(
//   "aRandom",
//   new THREE.BufferAttribute(randoms, 1)
// );

//Meshes
const objectDistance = 4;
const mesh1 = new THREE.Mesh(treePlaneGeometry, treeShaderMaterial);
// const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);

// const mesh3 = new THREE.Mesh(waterPlaneGeometry, waterMaterial);

// const mesh3 = new THREE.Mesh(
//   new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
//   material
// );

// mesh1.position.y = 100;
// mesh2.position.y = -objectDistance * 0.5;
// mesh2.position.z = 0;

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

  // Update the previous height for the next comparison
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
camera.position.z = 5;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
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
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX / sizes.width - 0.5;
  mouse.y = e.clientY / sizes.height - 0.5;

  treeShaderMaterial.uniforms.uMouse.value = mouse;
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

  //Animate Camera
  // camera.position.y = -scrollY / sizes.height;

  // const parallexX = mouse.x;
  // const parallexY = -mouse.y;
  // cameraGroup.position.x += (parallexX - cameraGroup.position.x) * deltaTime;
  // cameraGroup.position.y += (parallexY - cameraGroup.position.y) * deltaTime;

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
