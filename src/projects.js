const projects = [
  {
    key: 1,
    name: "Lazysis Chinese",
    type: "Webflow Development",
    pos: "start",
    image: "assets/lazysis_bg.avif",
    video: "assets/lazysis.mp4",
    link: "https://www.lazysisterchinese.com/",
  },
  {
    key: 2,
    name: "i-watch landing page",
    type: "3D Development",
    pos: "mid",
    image: "assets/i-watch.webp",
    video: "assets/i-watch.mp4",
    link: "https://i-watch-ultra.netlify.app/",
  },
  {
    key: 3,
    name: "Deck Doctors",
    type: "Webflow Development",
    pos: "end",
    image: "assets/minimal.webp",
    video: "assets/deckdocs.mp4",
    link: "https://www.deckdocs.com/",
  },
  {
    key: 4,
    name: "Snagged",
    type: "Webflow Development",
    pos: "mid",
    image: "assets/minimal_gradient.webp",
    video: "assets/snagged.mp4",
    link: "https://www.snagged.com/",
  },
  {
    key: 5,
    name: "Avalon",
    type: "Webflow Development",
    pos: "end",
    image: "assets/avalon.webp",
    link: "https://www.drpatflynn.com/",
  },
];

const createProjects = () => {
  projects.forEach((project) => {
    let panel = document.createElement("div");
    panel.classList.add("project", `${project.pos}`);

    let imageContainer = document.createElement("a");
    imageContainer.classList.add("image__container");

    imageContainer.href = project.link;
    imageContainer.target = "_blank";
    imageContainer.ariaLabel = `Go to project ${project.key}`;

    let image = document.createElement("img");
    image.classList.add("project__image");
    image.src = project.image;
    image.loading = "lazy";
    image.alt = `project image ${project.key}`;

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
