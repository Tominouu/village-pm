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

// Connexion Lenis ↔ ScrollTrigger
lenis.on("scroll", ScrollTrigger.update)

// Animation loop GSAP uniquement (pas de double RAF)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// Refresh ScrollTrigger après init Lenis
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
    scrub: 1.5 
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
      trigger: ".scroll-3d",
      start: "top top",
      end: "top center",
      scrub: true
    }
  }
)

gsap.to(canvas, {
  opacity: 0,
  pointerEvents: "none", 
  scrollTrigger: {
    trigger: ".scroll-3d",
    start: "center center",  // Commence à mid-scroll
    end: "bottom center",    // Fin à 3/4 du scroll
    scrub: true
  }
})

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