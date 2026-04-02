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

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// connecter à GSAP
lenis.on("scroll", ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

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
const frameCount = 120

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
// RENDER OPTIMISÉ
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
// ANIMATION SCROLL
// =====================
gsap.to(obj, {
  frame: frameCount,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".scroll-3d",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5 // ULTRA SMOOTH 🔥
  },
  onUpdate: render
})

// =====================
// ZOOM PROGRESSIF
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
// FADE IN CANVAS
// =====================
gsap.fromTo(canvas,
  { opacity: 0 },
  {
    opacity: 1,
    scrollTrigger: {
      start: "top top",
      end: "+=300",
      scrub: true
    }
  }
)

// =====================
// TEXTE ANIMÉ
// =====================
gsap.utils.toArray(".section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 100,
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "top 30%",
      scrub: true
    }
  })
})