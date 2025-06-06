import * as THREE from "three";
import gsap from "gsap";
import vertex from "./shaders/test/vertex.glsl";
// import fragment from "./shaders/test/fragment.glsl";
import fragmentQuad from "./shaders/fragmentQuad.glsl";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { createProjects } from "./projects";

gsap.registerPlugin(ScrollTrigger, SplitText);

const loaderElement = document.querySelector(".loader-overlay");
const media = gsap.matchMedia();

const timeline = gsap.timeline();
const splitHeroHeading = SplitText.create("#hero-heading", {
  type: "words, chars",
  charsClass: "char",
});

const splitHeroPara = SplitText.create("#hero-para", { mask: "lines" });
const splitSubHeading = SplitText.create("#hero-sub--text", {
  type: "words",
  mask: "words",
  smartWrap: true,
});

let typeSplit = SplitText.create("[text-split]", {
  types: "lines, words",
  tagName: "span",
});

function createScrollTrigger(triggerElement, timeline) {
  // Reset tl when scroll out of view past bottom of screen
  ScrollTrigger.create({
    trigger: triggerElement,
    start: "top bottom",
    // onLeaveBack: () => {
    //   timeline.progress(0);
    //   timeline.pause();
    // },
  });
  // Play tl when scrolled into view (60% from top of screen)
  ScrollTrigger.create({
    trigger: triggerElement,
    start: "top 70%",
    onEnter: () => timeline.play(),
  });
}

$("[letters-slide-up]").each(function (index) {
  let tl = gsap.timeline({ paused: true });
  tl.from($(this).find(".word"), {
    yPercent: 100,
    duration: 0.6,
    ease: "power4.out",
    stagger: { amount: 0.3 },
  });
  createScrollTrigger($(this), tl);
});

const lenis = new Lenis({ lerp: 0.75, duration: 1.5 });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

lenis.stop();

function smoothScroll(event) {
  event.preventDefault();
  const targetId = event.currentTarget.getAttribute("href").substring(1);
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    lenis.scrollTo(targetElement);
  }
}

// Attach click event listener to anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", smoothScroll);
});

//Testimonial Animation

document.addEventListener("DOMContentLoaded", function () {
  createProjects();

  let percentages = {
    small: 700,
    medium: 300,
    large: 100,
  };

  let limit =
    window.innerWidth <= 600
      ? percentages.small
      : window.innerWidth <= 1100
      ? percentages.medium
      : percentages.large;

  function setLimit() {
    limit =
      window.innerWidth <= 600
        ? percentages.small
        : window.innerWidth <= 1100
        ? percentages.medium
        : percentages.large;
  }

  media.add("(min-width: 600px)", () => {
    const projectSlider = document.querySelector(".projects_slider");

    ScrollTrigger.create({
      trigger: ".projects_wrap",
      start: "top top",
      end: "bottom bottom",
      // pin: true,
      // pinSpacing: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const maxTranslate = projectSlider.offsetWidth - window.innerWidth;
        const translateX = -progress * maxTranslate;

        gsap.set(projectSlider, { x: translateX });
      },
    });
  });

  window.addEventListener("resize", setLimit);
});

media.add("(min-width: 992px)", () => {
  const fontWeightItems = document.querySelectorAll(
    '[data-animate="font-weight"]'
  );
  const MAX_DISTANCE = 400;
  const MAX_FONT_WEIGHT = 900;
  const MIN_FONT_WEIGHT = 500;

  const BLUR_MAX_DISTANCE = 400;
  const BLUR_MAX_FONT_WEIGHT = 4;
  const BLUR_MIN_FONT_WEIGHT = 0;

  let debounceTimeout;

  document.addEventListener("mousemove", (event) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const mouseX = event.pageX;
      const mouseY = event.pageY;

      fontWeightItems.forEach((item) => {
        item.querySelectorAll(".char").forEach((char) => {
          const itemRect = char.getBoundingClientRect();
          const itemCenterX =
            itemRect.left + itemRect.width / 2 + window.scrollX;
          const itemCenterY =
            itemRect.top + itemRect.height / 2 + window.scrollY;

          const distance = Math.sqrt(
            Math.pow(mouseX - itemCenterX, 2) +
              Math.pow(mouseY - itemCenterY, 2)
          );

          let fontWeight =
            distance < MAX_DISTANCE
              ? gsap.utils.mapRange(
                  0,
                  MAX_DISTANCE,
                  MIN_FONT_WEIGHT,
                  MAX_FONT_WEIGHT,
                  Math.max(0, MAX_DISTANCE - distance)
                )
              : MIN_FONT_WEIGHT;

          let blurFontWeight =
            distance < BLUR_MAX_DISTANCE
              ? gsap.utils.mapRange(
                  0,
                  BLUR_MAX_DISTANCE,
                  BLUR_MIN_FONT_WEIGHT,
                  BLUR_MAX_FONT_WEIGHT,
                  Math.max(0, BLUR_MAX_DISTANCE - distance)
                )
              : BLUR_MIN_FONT_WEIGHT;

          gsap.to(char, {
            fontWeight,
            // filter: `blur(${blurFontWeight}px)`,
            duration: 0.8,
            overwrite: "auto", // Ensure smooth transitions
          });
        });
      });
    }, 0); // Adjust the debounce delay as needed
  });
});

const cards = document.querySelectorAll(".card");

cards.forEach((card, index) => {
  if (index === cards.length) return;
  gsap.to(card, {
    scale: 0.75,

    // yPercent: -50,
    opacity: 0,
    scrollTrigger: {
      trigger: card,
      start: "top 15%",
      end: "bottom top",
      scrub: 1,
    },
  });
});

const splitCount = SplitText.create("#counter-num", {
  types: "chars",
  mask: "chars",
});

const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(0.25, () => {
      timeline
        .set(splitCount.chars, { visibility: "visible" })
        .from(splitCount.chars, {
          yPercent: 100,
          stagger: 0.02,
          ease: "power4.inOut",
          duration: 0.35,
        })
        .to(
          splitCount.chars,
          {
            yPercent: -100,
            duration: 0.35,
            stagger: 0.015,
            ease: "power4.inOut",
          },
          "<+1.5"
        )
        .fromTo(
          loaderElement,
          { yPercent: 0 },
          {
            duration: 2,
            yPercent: -100,
            ease: "power4.inOut",
          },
          "<"
        )
        .fromTo(
          splitHeroHeading.chars,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "sine.easeOut",
            stagger: {
              from: "center",
              amount: 0.6,
              ease: "power1.out",
              yoyo: true,
            },
            onComplete: () => {
              lenis.start();
              gsap.to(splitHeroHeading.chars, {
                yPercent: -100,
                stagger: { from: "random", amount: 0.4, ease: "power4.easeIn" },
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
        .from(
          cameraGroup.position,
          {
            z: 3.5,
            ease: "expo.inOut",
            duration: 2,
          },
          "<"
        )
        .fromTo(
          splitHeroPara.words,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "sine.out",
            stagger: { amount: 0.5, ease: "power4.out" },
            onComplete: () => {
              gsap.to(splitHeroPara.words, {
                yPercent: -200,
                stagger: { amount: 0.4, ease: "power4.easeIn" },
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
            stagger: { amount: 0.5, ease: "power4.out" },
            onComplete: () => {
              gsap.to(splitSubHeading.words, {
                yPercent: -200,
                stagger: { amount: 0.4, ease: "power4.easeIn" },
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
    });
  },
  (itemUrl, itemLoaded, itemTotal) => {
    // const progressRatio = itemLoaded / itemTotal;
    // loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);

timeline
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

THREE.ColorManagement.enabled = false;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// const sceneCopy = new THREE.Scene();

/**
 * Texture Loader
 */
const loader = new THREE.TextureLoader(loadingManager);
const imageTexture = loader.load("../assets/flowers.webp");

/**
 * Materials
 */
const cubeMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0.5,
  transmission: 1,
  thickness: 1,
  clearcoat: 1,
  clearcoatRoughness: 0.5,
  normalScale: 1,
  clearcoatNormalScale: 0.3,
  ior: 1.5,
  reflectivity: 0.8,
});

const treeShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragmentQuad,
  transparent: false,
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
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

//Meshes
const mesh1 = new THREE.Mesh(treePlaneGeometry, treeShaderMaterial);
const mesh2 = new THREE.Mesh(cubeGeometry, cubeMaterial);

// mesh1.position.z = 1;
mesh2.position.y = -2;
mesh2.position.z = 2;

scene.add(mesh1);

const light = new THREE.DirectionalLight(0xfff0dd, 1);
light.position.set(0, 5, 10);
scene.add(light);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  if (window.innerWidth !== sizes.width) {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  }
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

  mesh2.rotation.x += 0.005;
  mesh2.rotation.y += 0.01;

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
