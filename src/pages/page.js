let minimap = document.createElement("div");
let minimapSize = document.createElement("div");
let viewer = document.createElement("div");
let minimapContent = document.createElement("iframe");
let scale = 0.1;
let realScale;

minimap.className = "minimap__container";
minimapSize.className = "minimap__size";
viewer.className = "minimap__viewer";
minimapContent.className = "minimap__content";

viewer.draggable = true;

let isDragging = false;
let startY = 0;

minimap.append(minimapSize, viewer, minimapContent);
document.body.appendChild(minimap);

let html = document.documentElement.outerHTML.replace(
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  ""
);

let iframeDoc = minimapContent.contentWindow.document;

iframeDoc.open();
iframeDoc.write(html);
iframeDoc.close();

function getDimension() {
  let bodyWidth = document.body.clientWidth;
  let bodyRatio = document.body.clientHeight / bodyWidth;
  let winRatio = window.innerHeight / window.innerWidth;

  minimap.style.width = "15%";

  realScale = minimap.clientWidth / bodyWidth;

  minimapSize.style.paddingTop = `${bodyRatio * 100}%`;

  viewer.style.paddingTop = `${winRatio * 100}%`;

  minimapContent.style.transform = `scale(${realScale})`;
  minimapContent.style.width = `${100 / realScale}%`;
  minimapContent.style.height = `${100 / realScale}%`;
}

function trackScroll() {
  viewer.style.transform = `translateY(${window.scrollY * realScale}px)`;
}

getDimension();

function startDrag(event) {
  isDragging = true;
  startY = event.clientY || event.touches[0].clientY;
  event.preventDefault();
}

function drag(event) {
  if (isDragging) {
    const currentY = event.clientY || event.touches[0].clientY;
    const deltaY = currentY - startY;
    const scrollAmount = deltaY * 5;

    window.scrollBy(0, scrollAmount);

    startY = currentY;
  }
}

function stopDrag(event) {
  isDragging = false;
  event.preventDefault();
}

iframeDoc.addEventListener("click", function (e) {
  const iframeRect = minimapContent.getBoundingClientRect();
  const iframeLeft = iframeRect.left + window.scrollX;
  const iframeTop = iframeRect.top + window.scrollY;

  const clickXRelativeToIframe = e.clientX - iframeLeft;
  const clickYRelativeToIframe = e.clientY - iframeTop;

  const scrollX = window.scrollX + clickXRelativeToIframe;
  const scrollY = window.scrollY + clickYRelativeToIframe;

  window.scrollTo(scrollX, scrollY);
});

viewer.addEventListener("mousedown", startDrag);
viewer.addEventListener("touchstart", startDrag);

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag);

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

window.addEventListener("resize", getDimension);
window.addEventListener("scroll", trackScroll);
