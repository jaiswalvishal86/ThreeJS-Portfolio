const projects = [
  {
    name: "Lazysis Chinese",
    type: "Webflow Development",
    pos: "start",
    image: "assets/lazysis_bg.avif",
    video: "assets/lazysis.mp4",
    link: "https://www.lazysisterchinese.com/",
  },
  {
    name: "i-watch landing page",
    type: "3D Development",
    pos: "mid",
    image: "assets/i-watch.jpeg",
    video: "assets/i-watch.mp4",
    link: "https://i-watch-ultra.netlify.app/",
  },
  {
    name: "Deck Doctors",
    type: "Webflow Development",
    pos: "end",
    image: "assets/minimal.jpeg",
    video: "assets/deckdocs.mp4",
    link: "https://www.deckdocs.com/",
  },
  {
    name: "Snagged",
    type: "Webflow Development",
    pos: "mid",
    image: "assets/minimal_gradient.jpeg",
    video: "assets/snagged.mp4",
    link: "https://www.snagged.com/",
  },
  // {
  //   name: "PROJECT 5",
  //   type: "WEB DESIGN",
  //   pos: "end",
  //   image:
  //     "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=2487&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // },
  // {
  //   name: "PROJECT 6",
  //   type: "GRAPHIC DESIGN",
  //   pos: "mid",
  //   image:
  //     "https://images.unsplash.com/photo-1561998338-13ad7883b20f?auto=format&fit=crop&q=80&w=2487&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // },
  // {
  //   name: "PROJECT 7",
  //   type: "WEB DESIGN",
  //   pos: "start",
  //   image:
  //     "https://images.unsplash.com/photo-1454117096348-e4abbeba002c?auto=format&fit=crop&q=80&w=2602&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // },
  // {
  //   name: "PROJECT 8",
  //   type: "TYPE DESIGN",
  //   pos: "end",
  //   image:
  //     "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=2574&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // },
];

const createProjects = () => {
  projects.forEach((project) => {
    let panel = document.createElement("div");
    panel.classList.add("project", `${project.pos}`);

    let imageContainer = document.createElement("a");
    imageContainer.classList.add("image__container");

    imageContainer.href = project.link;
    imageContainer.target = "_blank";

    let image = document.createElement("img");
    image.classList.add("project__image");
    image.src = project.image;

    let video = document.createElement("video");
    video.style.width = "75cqw";
    video.style.height = "50cqw";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    const videoSource = document.createElement("source");
    videoSource.type = "video/mp4";
    videoSource.src = project.video;

    let projectDetails = document.createElement("div");
    projectDetails.classList.add("project__details");

    projectDetails.style.textTransform = "uppercase";

    let projectTitle = document.createElement("p");
    projectTitle.innerText = project.name;

    let projectType = document.createElement("p");
    projectType.innerText = project.type;

    projectDetails.append(projectTitle, projectType);

    video.appendChild(videoSource);

    imageContainer.appendChild(image);
    imageContainer.appendChild(video);
    panel.append(imageContainer, projectDetails);

    document.querySelector(".projects_slider").appendChild(panel);
  });
};

export { createProjects };
