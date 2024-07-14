const createMatter = () => {
  const gallerySection = document.getElementById("gallery");

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

      this.body = Bodies.rectangle(x, y, 200, 200, options);
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

  for (let i = 0; i < 5; i++) {
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
      const canvas = render.canvas;
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
            x: Math.random() * 0.25,
            y: -Math.random(),
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
    items.forEach((item) => item.update());
    requestAnimationFrame(moveBodies);
  }
  moveBodies();
};

export { createMatter };
