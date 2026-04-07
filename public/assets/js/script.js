gsap.registerPlugin(ScrollTrigger)

// =====================
// LENIS SMOOTH SCROLL
// =====================
const lenis = new Lenis({
  duration: 1.2,
  smooth: true,
  direction: "vertical",
  smoothTouch: false
})

lenis.on("scroll", ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

ScrollTrigger.refresh()

// =====================
// CANVAS SETUP
// =====================
const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
resizeCanvas()
window.addEventListener("resize", resizeCanvas)

// =====================
// IMAGES
// =====================
const frameCount = 240

const currentFrame = (index) =>
  `../../test-anim/images/${String(index).padStart(4, "0")}.png`

const images = []
const obj = { frame: 1, zoom: 1 }

let imagesLoaded = 0

for (let i = 1; i <= frameCount; i++) {
  const img = new Image()
  img.src = currentFrame(i)

  img.onload = () => {
    imagesLoaded++
    if (imagesLoaded === frameCount) {
      render()
    }
  }

  images.push(img)
}

// =====================
// RENDER
// =====================
let lastFrame = -1

const render = () => {
  const frameIndex = Math.round(obj.frame)

  if (frameIndex === lastFrame) return
  lastFrame = frameIndex

  const img = images[frameIndex - 1]
  if (!img) return

  context.clearRect(0, 0, canvas.width, canvas.height)

  const scale = Math.max(
    canvas.width / img.width,
    canvas.height / img.height
  )

  const zoom = obj.zoom

  const width = img.width * scale * zoom
  const height = img.height * scale * zoom

  const x = (canvas.width - width) / 2
  const y = (canvas.height - height) / 2

  context.drawImage(img, x, y, width, height)
}

// =====================
// ANIMATION SCROLL (frames)
// =====================
gsap.to(obj, {
  frame: frameCount - 1,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".scroll-3d",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5
  },
  onUpdate: render
})

// =====================
// ZOOM
// =====================
gsap.to(obj, {
  zoom: 1.2,
  scrollTrigger: {
    trigger: ".scroll-3d",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5
  }
})

// =====================
// ÉTAT INITIAL
// =====================
gsap.set(canvas, { opacity: 1 })

// =====================
// TIMELINE PRINCIPALE
// =====================
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-3d",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
})

// =====================
// TEXT 1
// =====================
tl.fromTo(".text-1",
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0 },
  0
)
.to(".text-1",
  { opacity: 0, y: -50 },
  0.3
)

// =====================
// TEXT 2
// =====================
tl.fromTo(".text-2",
  { opacity: 0, x: -50 },
  { opacity: 1, x: 0 },
  0.35
)
.to(".text-2",
  { opacity: 0, x: -50 },
  0.75
)

// =====================
// TEXT 3
// =====================
tl.fromTo(".text-3",
  { opacity: 0, x: 50 },
  { opacity: 1, x: 0 },
  0.8
)
.to(".text-3",
  { opacity: 0, x: 50 },
  1
)


// =====================
// DISPLAY NONE PROPRE (hors timeline)
// =====================

ScrollTrigger.create({
  trigger: ".scroll-3d",
  start: "bottom bottom", // quand la section est FINIE
  onLeave: () => {
    canvas.style.display = "none"
  },
  onEnterBack: () => {
    canvas.style.display = "block"
  }
})