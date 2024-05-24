import * as THREE from "three";
// import * as dat from "lil-gui";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import vertex from "./shaders/test/vertex.glsl";
// import fragment from "./shaders/test/fragment.glsl";
import fragmentQuad from "./shaders/fragmentQuad.glsl";
import Lenis from "@studio-freight/lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createProjects } from "./projects";

const aboutSection = document.getElementById("about-section");
const gallerySection = document.getElementById("gallery");
const loaderElement = document.querySelector(".loader-overlay");

const media = gsap.matchMedia();

const timeline = gsap.timeline();
const splitText = new SplitType("#text");
const splitHeroHeading = new SplitType("#hero-heading", {
  types: "chars lines",
});

const splitHeroPara = new SplitType("#hero-para");
const splitSubHeading = new SplitType("#hero-sub--text");

const words = "CREATIVITY";

const animationDuration = 4000;

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ lerp: 1, duration: 1.5 });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

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

//Matter
let Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Body = Matter.Body;

// create an engine
let engine = Engine.create();
engine.world.gravity.y = 0;
const thickness = 50;

const render = Render.create({
  element: gallerySection,
  engine: engine,
  options: {
    width: gallerySection.clientWidth,
    height: gallerySection.clientHeight,
    background: "transparent",
    wireframes: false,
  },
});

const top = Bodies.rectangle(
  gallerySection.clientWidth / 2,
  0 - thickness / 2,
  gallerySection.clientWidth,
  thickness,
  {
    isStatic: true,
    render: {
      strokeStyle: "transparent",
    },
  }
);

const bottom = Bodies.rectangle(
  gallerySection.clientWidth / 2,
  gallerySection.clientHeight + thickness / 2,
  gallerySection.clientWidth,
  thickness,
  {
    isStatic: true,
    render: {
      strokeStyle: "transparent",
    },
  }
);

const left = Bodies.rectangle(
  0 - thickness / 2,
  gallerySection.clientHeight / 2,
  thickness,
  gallerySection.clientHeight,
  {
    isStatic: true,
    render: {
      strokeStyle: "transparent",
    },
  }
);

const right = Bodies.rectangle(
  gallerySection.clientWidth + thickness / 2,
  gallerySection.clientHeight / 2,
  thickness,
  gallerySection.clientHeight,
  {
    isStatic: true,
    render: {
      strokeStyle: "transparent",
    },
  }
);

Composite.add(engine.world, [top, bottom, left, right]);

class Item {
  constructor(x, y, imagePath) {
    let options = {
      frictionAir: 0.075,
      restitution: 0.25,
      density: 0.002,
      angle: (Math.random() * Math.PI) / 2,
      render: {
        fillStyle: "transparent",
      },
    };

    this.body = Bodies.rectangle(x, y, 100, 200, options);
    Composite.add(engine.world, this.body);

    this.div = document.createElement("div");
    this.div.classList = "gallery-item";
    this.div.style.left = `${this.body.position.x - 50}px`;
    this.div.style.top = `${this.body.position.y - 100}px`;

    const img = document.createElement("img");
    img.src = imagePath;
    this.div.appendChild(img);
    gallerySection.appendChild(this.div);
  }
  update() {
    this.div.style.left = `${this.body.position.x - 50}px`;
    this.div.style.top = `${this.body.position.y - 100}px`;
    this.div.style.transform = `rotate(${this.body.angle}rad)`;
  }
}

let items = [];

for (let i = 0; i < 12; i++) {
  let x =
    Math.random(100, gallerySection.clientWidth - 100) *
    gallerySection.clientWidth;
  let y =
    Math.random(100, gallerySection.clientHeight - 100) *
    gallerySection.clientHeight;
  items.push(new Item(x, y, `assets/img${i + 1}.jpg`));
}

// let matterMouse = Matter.Mouse.create(render.canvas);
// let mouseConstraint = Matter.MouseConstraint.create(engine, {
//   mouse: matterMouse,
//   constraint: {
//     stiffness: 0.2,
//     render: {
//       visible: false,
//     },
//   },
// });

// Composite.add(engine.world, mouseConstraint);

// mouseConstraint.mouse.element.removeEventListener(
//   "mousewheel",
//   mouseConstraint.mouse.mousewheel
// );
// mouseConstraint.mouse.element.removeEventListener(
//   "DOMMouseScroll",
//   mouseConstraint.mouse.mousewheel
// );

let mouseX = 0;
let mouseY = 0;

document
  .querySelector(".gallery-section canvas")
  .addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

const initialPositions = items.map((item) => ({
  x: item.body.position.x,
  y: item.body.position.y,
}));

const moveMouseBodies = () => {
  const offsetX = mouseX;
  const offsetY = mouseY;

  items.forEach((item, index) => {
    const distance = Math.sqrt(
      Math.pow(offsetX - item.body.position.x, 2) +
        Math.pow(offsetY - item.body.position.y, 2)
    );
    if (distance <= 100) {
      Matter.Body.applyForce(
        item.body,
        {
          x: initialPositions[index].x + offsetX,
          y: initialPositions[index].y + offsetY,
        },
        {
          x: Math.random() * -0.3,
          y: Math.random() * 0.1,
        }
      );
    }
  });
};

Matter.Events.on(engine, "beforeUpdate", moveMouseBodies);

function handleResize(gallerySection) {
  // set canvas size to new values
  render.canvas.width = gallerySection.clientWidth;
  render.canvas.height = gallerySection.clientHeight;

  // reposition ground
  Matter.Body.setPosition(
    bottom,
    Matter.Vector.create(
      gallerySection.clientWidth / 2,
      gallerySection.clientHeight + thickness / 2
    )
  );

  // reposition top
  Matter.Body.setPosition(
    top,
    Matter.Vector.create(gallerySection.clientWidth / 2, 0 - thickness / 2)
  );

  // reposition right wall
  Matter.Body.setPosition(
    right,
    Matter.Vector.create(
      gallerySection.clientWidth + thickness / 2,
      gallerySection.clientHeight / 2
    )
  );
}

Render.run(render);

const runner = Runner.create();

// Run the engine
Matter.Runner.run(runner, engine);

window.addEventListener("resize", () => handleResize(gallerySection));
function moveBodies() {
  requestAnimationFrame(moveBodies);
}
// moveBodies();

//Testimonial Animation

document.addEventListener("DOMContentLoaded", function () {
  createProjects();

  let testimonialTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".features-section",
      end: "bottom bottom",
      scrub: true,
      toggleActions: "restart none reverse",
      pin: ".features-wrapper",
    },
  });
  testimonialTl.from(".feature-card", {
    // opacity: 0,
    yPercent: 175,
    // xPercent: 35,
    scale: 1.5,
    duration: 1,
    stagger: { each: 0.8, from: "end" },
  });

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
    gsap.to(".projects_slider", {
      xPercent: -50,
      ease: "power4.easeIn",
      duration: 1,
      scrollTrigger: {
        trigger: "#projects",
        scrub: true,
        start: "top top",
        end: "bottom+=50px bottom",
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
  const MAX_FONT_WEIGHT = 700;
  const MIN_FONT_WEIGHT = 400;

  const BLUR_MAX_DISTANCE = 400;
  const BLUR_MAX_FONT_WEIGHT = 3;
  const BLUR_MIN_FONT_WEIGHT = 0;

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
        });
      });
    });
  });
});

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
        .fromTo(
          splitHeroPara.words,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "sine.out",
            stagger: { from: "center", amount: 0.5, ease: "power4.out" },
            onComplete: () => {
              gsap.to(splitHeroPara.words, {
                yPercent: -200,
                stagger: { from: "center", amount: 0.4, ease: "power4.easeIn" },
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
            stagger: { from: "center", amount: 0.5, ease: "power4.out" },
            onComplete: () => {
              gsap.to(splitSubHeading.words, {
                yPercent: -200,
                stagger: { from: "center", amount: 0.4, ease: "power4.easeIn" },
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

  items.forEach((item) => item.update());

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

  // window.requestAnimationFrame(tick);
};

tick();
