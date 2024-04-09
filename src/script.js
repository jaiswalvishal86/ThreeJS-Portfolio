import * as THREE from "three";
import Matter from "matter-js";
// import * as dat from "lil-gui";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import vertex from "./shaders/test/vertex.glsl";
// import fragment from "./shaders/test/fragment.glsl";
import fragmentQuad from "./shaders/fragmentQuad.glsl";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const container = document.querySelector(".gallery-wrapper");
const rows = document.querySelectorAll(".row");
const aboutSection = document.getElementById("about-section");
const text = document.getElementById("text");
const loaderElement = document.querySelector(".loader-overlay");
const loadingBarElement = document.querySelector(".loading-bar");
const testimonialSlide = document.getElementById("testimonialSlide");

const magneticCircle = document.getElementById("magneticCircle");
const allLinks = document.querySelectorAll("a");

const media = gsap.matchMedia();

const timeline = gsap.timeline();
const splitText = new SplitType("#text");
const splitHeroHeading = new SplitType("#hero-heading", { types: "chars" });

const splitHeroPara = new SplitType("#hero-para");
const splitSubHeading = new SplitType("#hero-sub--text");

gsap.registerPlugin(CustomEase);

const words = "CREATIVITY";

const animationDuration = 4000;

const characters = words.split("").forEach((char, i) => {
  function createElement(offset) {
    const div = document.createElement("div");
    div.innerText = char;
    div.classList.add("character");
    div.style.animationDelay = `-${i * (animationDuration / 16) - offset}ms`;

    return div;
  }
  document.getElementById("spiral").append(createElement(0));
  document
    .getElementById("spiral2")
    .append(createElement(-1 * (animationDuration / 2)));
});

function removeAllAnimationClasses() {
  const characterDoms = document.querySelectorAll(".character");

  characterDoms.forEach(function (element) {
    element.classList.remove("character");
  });
}

window.addEventListener("load", function () {
  let delayTime = 5000;

  setTimeout(function () {
    removeAllAnimationClasses();
  }, delayTime);
});

//Testimonial Animation

CustomEase.create("cubic", "0.83, 0, 0.17, 1");
let isAnimating = false;

// function splitTextIntoSpans(selector) {
//   let elements = document.querySelectorAll(selector);
//   elements.forEach((element) => {
//     let text = element.innerText;
//     let splitText = text
//       .split("")
//       .map(function (char) {
//         return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
//       })
//       .join("");
//     element.innerHTML = splitText;
//   });
// }

new SplitType(".card-copy", { types: "lines,words" });
new SplitType(".copy", { types: "chars" });

function initializeCards() {
  let cards = Array.from(document.querySelectorAll(".card"));
  gsap.to(cards, {
    y: (i) => -12 + 12 * i + "%",
    z: (i) => 12 * i,
    // rotationZ: (i) => (i % 2 === 0 ? 2 : -2) * Math.random(),
    duration: 1,
    ease: "cubic",
    stagger: -0.1,
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // splitTextIntoSpans(".copy h2");
  initializeCards();

  gsap.set("h2 .char", { y: -200 });
  gsap.set(".card-copy .word", { y: -200 });
  gsap.set(".card:last-child h2 .char", { y: 0 });
  gsap.set(".card:last-child p .word", { y: 0 });
});

testimonialSlide.addEventListener("click", function () {
  if (isAnimating) return;

  isAnimating = true;
  let slider = document.querySelector(".slider");
  let cards = Array.from(slider.querySelectorAll(".card"));
  let lastCard = cards.pop();
  let nextCard = cards[cards.length - 1];
  let tl = gsap.timeline();

  tl.to(lastCard.querySelectorAll("h2 .char"), {
    y: -200,
    duration: 0.5,
    ease: "cubic",
    stagger: 0.05,
  })
    .to(
      lastCard.querySelectorAll(".card-copy .word"),
      {
        y: -200,
        duration: 0.5,
        ease: "cubic",
        stagger: 0.01,
      },
      "<+0.1"
    )
    .to(
      lastCard,
      {
        y: "+=150%",
        duration: 0.75,
        ease: "cubic",
        onComplete: () => {
          slider.prepend(lastCard);
          initializeCards();
          // gsap.set(lastCard, { opacity: 0 });
          // gsap.set(lastCard.querySelectorAll("h2 .char"), { y: -200 });
          // gsap.set(lastCard.querySelectorAll(".card-copy .word"), { y: -200 });

          setTimeout(() => {
            // gsap.set(lastCard, { opacity: 1 });
            isAnimating = false;
          }, 1500);
        },
      },
      "<+0.3"
    )
    .to(
      nextCard.querySelectorAll("h2 .char"),
      {
        y: 0,
        duration: 0.75,
        ease: "cubic",
        stagger: 0.05,
      },
      "<+1"
    )
    .to(
      nextCard.querySelectorAll(".card-copy .word"),
      {
        y: 0,
        duration: 0.75,
        ease: "cubic",
        stagger: 0.01,
      },
      "<+0.2"
    );
});

media.add("(min-width: 992px)", () => {
  const fontWeightItems = document.querySelectorAll(
    '[data-animate="font-weight"]'
  );
  const MAX_DISTANCE = 300;
  const MAX_FONT_WEIGHT = 700;
  const MIN_FONT_WEIGHT = 300;

  // fontWeightItems.forEach((item) => {
  //   new SplitType(item, { types: "chars" }).chars;
  // });
  document.addEventListener("mousemove", (event) => {
    const mouseX = event.pageX;
    const mouseY = event.pageY;

    fontWeightItems.forEach((item) => {
      item.querySelectorAll(".char").forEach((char) => {
        const itemRect = char.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2 + window.scrollX;

        const itemCenterY = itemRect.top + itemRect.height / 2 + window.scrollY;

        const distance = Math.sqrt(
          Math.pow(mouseX - itemCenterX, 2) + Math.pow(mouseY - itemCenterY, 2)
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

        gsap.to(char, { fontWeight, duration: 0.8 });
      });
    });
  });

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
});

gsap.registerPlugin(ScrollTrigger);

const loadingManager = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(2, () => {
      timeline
        .to("#spiral", {
          opacity: 0,
          duration: 0.5,
        })
        .to(
          "#spiral2",
          {
            opacity: 0,
            duration: 0.5,
          },
          "<"
        )
        .fromTo(
          loaderElement,
          { yPercent: 0 },
          {
            duration: 2,
            yPercent: -100,
            ease: "cubic",
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

      // loadingBarElement.classList.add(".ended");
      // loadingBarElement.style.transform = "";
    });
  },
  (itemUrl, itemLoaded, itemTotal) => {
    // const progressRatio = itemLoaded / itemTotal;
    // loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);

timeline
  .fromTo(
    splitText.lines,
    {
      opacity: 0,
      x: -100,
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

const lenis = new Lenis({ lerp: 1, duration: 0.8 });

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
  if (window.innerWidth > 768) {
    window.requestAnimationFrame(tick);
  }
};

tick();
