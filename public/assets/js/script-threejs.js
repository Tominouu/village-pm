import * as THREE from 'https://esm.sh/three@r128';
import { GLTFLoader } from 'https://esm.sh/three@r128/examples/jsm/loaders/GLTFLoader.js';

// =====================
// REGISTER GSAP PLUGIN
// =====================
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

// =====================
// THREE.JS SCENE SETUP
// =====================
const canvas = document.getElementById("canvas")
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xfafffa)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
)
camera.position.z = 25

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// =====================
// LIGHTING
// =====================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(20, 20, 20)
scene.add(directionalLight)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight2.position.set(-20, -20, 10)
scene.add(directionalLight2)

// =====================
// LOAD 3D MODEL
// =====================
const loader = new GLTFLoader()
let shoe = null
let modelReady = false

loader.load('assets/models/shoe.glb', (gltf) => {
  shoe = gltf.scene
  shoe.scale.set(75, 75, 75)
  shoe.position.set(0, 0, 0)
  
  // ✅ Appliquer les rotations de la première étape
  shoe.rotation.x = Math.PI / 2
  shoe.rotation.y = Math.PI
  shoe.rotation.z = 0
  
  scene.add(shoe)
  modelReady = true
  console.log('✅ Modèle chargé')
  animate()
}, undefined, (error) => {
  console.error('❌ Erreur au chargement du modèle:', error)
  createFallbackModel()
})

function createFallbackModel() {
  console.warn('⚠️ Modèle non trouvé, création d\'une géométrie de test')
  const geometry = new THREE.BoxGeometry(10, 10, 5)
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x333333,
    shininess: 100
  })
  shoe = new THREE.Mesh(geometry, material)
  
  shoe.rotation.x = Math.PI / 2
  shoe.rotation.y = Math.PI
  shoe.rotation.z = 0
  
  scene.add(shoe)
  modelReady = true
  animate()
}

setTimeout(() => {
  if (!modelReady) {
    createFallbackModel()
  }
}, 3000)

// =====================
// ROTATIONS KEYFRAMES - 4 ÉTAPES
// =====================
// 1. Top view - bout pointe vers le bas
// 2. Vue côté - pointe vers la droite
// 3. Vue dessous (semelle) - légèrement vers gauche
// 4. Vue de haut - légèrement vers gauche

const rotationKeyframes = [
  { 
    progress: 0.0, 
    rotX: Math.PI / 2,    
    rotY: Math.PI,
    rotZ: 0,
    description: "Top view - bout vers le bas"
  },
  { 
    progress: 0.33, 
    rotX: 0,              
    rotY: -Math.PI / 2,   
    rotZ: 0,
    description: "Vue de côté - pointe vers la droite"
  },
  { 
    progress: 0.66, 
    rotX: -Math.PI / 2,   
    rotY: Math.PI / 6,    
    rotZ: 0,
    description: "Vue dessous (semelle) - vers la gauche"
  },
  { 
    progress: 1.0, 
    rotX: Math.PI / 2,    
    rotY: Math.PI / 6,    
    rotZ: 0,
    description: "Vue de haut - vers la gauche"
  }
]

// Fonction pour interpoler les rotations
function interpolateRotation(progress) {
  let start = rotationKeyframes[0]
  let end = rotationKeyframes[rotationKeyframes.length - 1]
  
  for (let i = 0; i < rotationKeyframes.length - 1; i++) {
    if (progress >= rotationKeyframes[i].progress && progress <= rotationKeyframes[i + 1].progress) {
      start = rotationKeyframes[i]
      end = rotationKeyframes[i + 1]
      break
    }
  }
  
  const segmentLength = end.progress - start.progress
  const localProgress = (progress - start.progress) / segmentLength
  
  return {
    rotX: start.rotX + (end.rotX - start.rotX) * localProgress,
    rotY: start.rotY + (end.rotY - start.rotY) * localProgress,
    rotZ: start.rotZ + (end.rotZ - start.rotZ) * localProgress,
    description: end.description
  }
}

// =====================
// STATE & ANIMATION
// =====================
const scrollState = {
  progress: 0
}

// =====================
// ANIMATION SCROLL AVEC GSAP + ScrollTrigger
// =====================
gsap.to(scrollState, {
  progress: 1,
  scrollTrigger: {
    trigger: ".scroll-3d",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5,
    markers: false
  },
  onUpdate: () => {
    if (shoe && modelReady) {
      const progress = scrollState.progress
      
      // Récupérer les rotations interpolées
      const rotations = interpolateRotation(progress)
      shoe.rotation.x = rotations.rotX
      shoe.rotation.y = rotations.rotY
      shoe.rotation.z = rotations.rotZ
      
      // Debug: afficher l'étape actuelle
      console.log(`${Math.round(progress * 100)}% - ${rotations.description}`)
      
      // Zoom progressif
      const scale = 75 + progress * 20
      shoe.scale.set(scale, scale, scale)
      
      // Mouvement Y
      shoe.position.y = Math.sin(progress * Math.PI) * 3
    }
  }
})

// =====================
// WINDOW RESIZE
// =====================
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize)

// =====================
// ANIMATION LOOP
// =====================
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

// =====================
// TEXT ANIMATIONS (GSAP Timeline)
// =====================
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-3d",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
})

tl.fromTo(".text-1",
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0 },
  0
)
.to(".text-1",
  { opacity: 0, y: -50 },
  0.3
)

tl.fromTo(".text-2",
  { opacity: 0, x: -50 },
  { opacity: 1, x: 0 },
  0.35
)
.to(".text-2",
  { opacity: 0, x: -50 },
  0.75
)

tl.fromTo(".text-3",
  { opacity: 0, x: 50 },
  { opacity: 1, x: 0 },
  1.75
)
.to(".text-3",
  { opacity: 0, x: 50 },
  2.5
)

// =====================
// HIDE CANVAS WHEN LEAVING SECTION
// =====================
ScrollTrigger.create({
  trigger: ".scroll-3d",
  start: "bottom bottom",
  onLeave: () => {
    canvas.style.display = "none"
  },
  onEnterBack: () => {
    canvas.style.display = "block"
  }
})

// =====================
// PRODUCT VIEWER
// =====================
const buttons = document.querySelectorAll(".controls button")
const viewerCanvas = document.getElementById("viewer-canvas")

let viewerScene = null
let viewerCamera = null
let viewerRenderer = null
let viewerShoe = null
let viewerRotation = 0

if (viewerCanvas) {
  viewerScene = new THREE.Scene()
  viewerScene.background = new THREE.Color(0xfafffa)
  
  viewerCamera = new THREE.PerspectiveCamera(
    75,
    viewerCanvas.clientWidth / viewerCanvas.clientHeight,
    0.1,
    2000
  )
  viewerCamera.position.z = 25
  
  viewerRenderer = new THREE.WebGLRenderer({ canvas: viewerCanvas, antialias: true })
  viewerRenderer.setSize(viewerCanvas.clientWidth, viewerCanvas.clientHeight)
  viewerRenderer.setPixelRatio(window.devicePixelRatio)
  
  const vAmbient = new THREE.AmbientLight(0xffffff, 0.8)
  viewerScene.add(vAmbient)
  
  const vDirectional = new THREE.DirectionalLight(0xffffff, 1)
  vDirectional.position.set(20, 20, 20)
  viewerScene.add(vDirectional)
  
  loader.load('assets/models/shoe.glb', (gltf) => {
    viewerShoe = gltf.scene
    viewerShoe.scale.set(60, 60, 60)
    viewerScene.add(viewerShoe)
    animateViewer()
  }, undefined, () => {
    const geometry = new THREE.BoxGeometry(10, 10, 5)
    const material = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 100 })
    viewerShoe = new THREE.Mesh(geometry, material)
    viewerScene.add(viewerShoe)
    animateViewer()
  })
  
  function animateViewer() {
    requestAnimationFrame(animateViewer)
    
    if (viewerShoe) {
      viewerShoe.rotation.y += (viewerRotation - viewerShoe.rotation.y) * 0.1
    }
    
    viewerRenderer.render(viewerScene, viewerCamera)
  }
  
  window.addEventListener('resize', () => {
    const width = viewerCanvas.clientWidth
    const height = viewerCanvas.clientHeight
    viewerCamera.aspect = width / height
    viewerCamera.updateProjectionMatrix()
    viewerRenderer.setSize(width, height)
  })
}

// =====================
// BUTTON INTERACTIONS
// =====================
const texts = {
  0: "Vue globale de la chaussure",
  60: "Confort optimal avec matériaux souples",
  120: "Grip maximal pour le skate",
  180: "Semelle technique avancée"
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const targetFrame = parseInt(btn.dataset.frame)
    const targetRotation = (targetFrame / 240) * Math.PI * 2
    
    if (viewerShoe) {
      gsap.to(viewerShoe.rotation, {
        y: targetRotation,
        duration: 1,
        ease: "power2.out"
      })
    }
    
    const displayElement = document.querySelector(".text-display")
    if (displayElement) {
      displayElement.textContent = texts[targetFrame]
    }
  })
})

ScrollTrigger.refresh()
console.log('✅ Script Three.js chargé avec 4 étapes d\'animation')