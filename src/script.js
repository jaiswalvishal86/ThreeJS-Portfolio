import * as THREE from "three";
import Matter from "matter-js";
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

const magneticCircle = document.getElementById("magneticCircle");
const allLinks = document.querySelectorAll("a");

// Function to move the magnetic circle to the cursor position
function moveMagneticCircle(event) {
  gsap.to(magneticCircle, {
    x: event.clientX,
    y: event.clientY,
    duration: 0.35,
    ease: "spring(300, 20, 0.5)",
  });
}

// Function to show the magnetic circle with a fade-in animation
function showMagneticCircle() {
  gsap.to(magneticCircle, {
    opacity: 1,
    // scale: 1,
    duration: 0.4,
  });
}

// Function to hide the magnetic circle with a fade-out animation
function hideMagneticCircle() {
  gsap.to(magneticCircle, {
    opacity: 0,
    duration: 0.4,
  });
}

allLinks.forEach(function (link) {
  link.addEventListener("mouseenter", function () {
    gsap.to(magneticCircle, {
      scale: 6,
      duration: 0.4,
      ease: "power1.out",
    });
  });
});

allLinks.forEach(function (link) {
  link.addEventListener("mouseleave", function () {
    gsap.to(magneticCircle, {
      scale: 1,
      duration: 0.4,
    });
  });
});

// Add event listeners to track mouse movement
document.addEventListener("mousemove", function (event) {
  moveMagneticCircle(event);
  showMagneticCircle();
});

// Add event listeners to hide the magnetic circle when the mouse leaves the window
document.addEventListener("mouseleave", function () {
  hideMagneticCircle();
});

gsap.registerPlugin(ScrollTrigger);

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
                      0.1
                    }`,
                  scrub: 1,
                },
              });
            },
          },
          "<+0.6"
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
                      0.05
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

const timeline = gsap.timeline();
const splitText = new SplitType("#text");
const splitHeroHeading = new SplitType("#hero-heading");
const splitHeroPara = new SplitType("#hero-para");
const splitSubHeading = new SplitType("#hero-sub--text");

timeline
  .fromTo(
    splitText.lines,
    {
      opacity: 0,
      x: -50,
    },
    {
      opacity: 1,
      x: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: aboutSection,
        scrub: true,
        start: "top bottom",
        end: "bottom+=150px bottom",
      },
    }
  )
  // .fromTo(
  //   splitHeading.lines,
  //   {
  //     x: -50,
  //     opacity: 0,
  //   },
  //   {
  //     x: 0,
  //     opacity: 1,
  //     scrollTrigger: {
  //       trigger: aboutSection,
  //       scrub: 1,
  //       start: "top bottom",
  //       end: "center bottom",
  //     },
  //   }
  // )
  .from(".sustain", {
    y: 180,
    scrollTrigger: {
      trigger: ".work-section",
      scrub: 1,
      start: "top bottom",
      end: "bottom center",
    },
  })
  .from("#ephemeral-text", {
    y: 230,
    scrollTrigger: {
      trigger: ".work-section",
      scrub: 1,
      start: "top bottom",
      end: "bottom center",
    },
  })
  .from(".ephemeral-img--wrapper", {
    y: 150,
    scrollTrigger: {
      trigger: ".work-section",
      scrub: 1,
      start: "top bottom",
      end: "bottom center",
    },
  })
  .from("#ephemeral-para", {
    y: 180,
    scrollTrigger: {
      trigger: ".work-section",
      scrub: 1,
      start: "top bottom",
      end: "bottom center",
    },
  });
// .from(".footer-content", {
//   yPercent: 500,
//   scrollTrigger: {
//     trigger: container,
//     scrub: 1,
//     start: "top center",
//     end: "bottom top",
//   },
// });
// .fromTo(
//   ".image-container",
//   {
//     scale: 1,
//   },
//   {
//     scale: 0.8,
//     scrollTrigger: {
//       trigger: ".services-section",
//       scrub: 1,
//       start: "top 30%",
//       end: "bottom bottom",
//     },
//   }
// );

rows.forEach((row, index) => {
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
      x: `${index * -10 * direction}%`, // Adjust the value as needed
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

const lenis = new Lenis({ lerp: 1, duration: 0.6 });

lenis.on("scroll", (e) => {
  // console.log(e);
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

THREE.ColorManagement.enabled = false;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
const sceneCopy = new THREE.Scene();

/**
 * Texture Loader
 */
const loader = new THREE.TextureLoader(loadingManager);
const imageTexture = loader.load("../assets/flowers.jpg");

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

//Geometry
const treePlaneGeometry = new THREE.PlaneGeometry(6, 6, 500, 500);

//Meshes
const mesh1 = new THREE.Mesh(treePlaneGeometry, treeShaderMaterial);

scene.add(mesh1);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  if (
    canvas.width != canvas.clientWidth ||
    canvas.height != canvas.clientHeight
  ) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    renderer.setViewport(0, 0, canvas.width, canvas.height);
  }
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
camera.position.z = 4;
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
  // camera.position.y = (-scrollY / sizes.height) * 2;

  // const parallexX = mouse.x * 0.2;
  // const parallexY = -mouse.y * 0.2;
  // cameraGroup.position.x += (parallexX - cameraGroup.position.x) * deltaTime;
  // cameraGroup.rotation.x +=
  //   (parallexX - cameraGroup.rotation.x) * deltaTime * 2;
  // cameraGroup.position.y += (parallexY - cameraGroup.position.y) * deltaTime;
  // cameraGroup.rotation.y +=
  //   (parallexY - cameraGroup.rotation.y) * deltaTime * 2;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
