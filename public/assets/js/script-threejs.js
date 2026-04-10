import * as THREE from 'https://esm.sh/three@r128';
import { GLTFLoader } from 'https://esm.sh/three@r128/examples/jsm/loaders/GLTFLoader.js';

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
// MAIN 3D SCENE
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(20, 20, 20)
scene.add(directionalLight)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight2.position.set(-20, -20, 10)
scene.add(directionalLight2)

const loader = new GLTFLoader()
let shoe = null
let modelReady = false

loader.load('assets/models/1PM-app.glb', (gltf) => {
  shoe = gltf.scene
  shoe.scale.set(75, 75, 75)
  shoe.position.set(0, 0, 0)
  
  shoe.rotation.x = Math.PI / 2
  shoe.rotation.y = Math.PI
  shoe.rotation.z = 0
  
  scene.add(shoe)
  modelReady = true
  console.log('Modèle chargé')
  animate()
}, undefined, (error) => {
  console.error('Erreur au chargement du modèle:', error)
  createFallbackModel()
})

function createFallbackModel() {
  console.warn('Modèle non trouvé, création d\'une géométrie de test')
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

const rotationKeyframes = [
  { 
    progress: 0.0, 
    rotX: Math.PI / 2,    
    rotY: Math.PI,
    rotZ: 0
  },
  { 
    progress: 0.33, 
    rotX: 0,              
    rotY: -Math.PI / 2,   
    rotZ: 0
  },
  { 
    progress: 0.66, 
    rotX: -Math.PI / 2,   
    rotY: Math.PI / 6,    
    rotZ: 0
  },
  { 
    progress: 1.0, 
    rotX: Math.PI / 2,    
    rotY: Math.PI / 6,    
    rotZ: 0
  }
]
    
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
    rotZ: start.rotZ + (end.rotZ - start.rotZ) * localProgress
  }
}

const scrollState = {
  progress: 0
}

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
      
      const rotations = interpolateRotation(progress)
      shoe.rotation.x = rotations.rotX
      shoe.rotation.y = rotations.rotY
      shoe.rotation.z = rotations.rotZ
      
      const scale = 75 + progress * 20
      shoe.scale.set(scale, scale, scale)
      
      shoe.position.y = Math.sin(progress * Math.PI) * 3
    }
  }
})

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

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
// VIEWER 3D SETUP
// =====================
const viewerCanvas = document.getElementById("viewer-canvas")
let viewerScene = null
let viewerCamera = null
let viewerRenderer = null
let viewerShoe = null
let viewerModelReady = false
let currentFeatureStep = 0
let featureAnimationComplete = [false, false, false, false]
let scrollLocked = false

if (viewerCanvas) {
  viewerScene = new THREE.Scene()
  viewerScene.background = new THREE.Color(0xffffff)
  
  const canvasRect = viewerCanvas.getBoundingClientRect()
  const canvasWidth = window.innerWidth * 0.5 - 40 
  const canvasHeight = window.innerHeight - 80
  
  viewerCamera = new THREE.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,
    0.1,
    2000
  )
  viewerCamera.position.z = 20
  
  viewerRenderer = new THREE.WebGLRenderer({ 
    canvas: viewerCanvas, 
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true
  })
  
  viewerRenderer.setSize(canvasWidth, canvasHeight)
  viewerRenderer.setPixelRatio(window.devicePixelRatio)
  viewerRenderer.setClearColor(0xffffff, 1)
  
  const vAmbient = new THREE.AmbientLight(0xffffff, 0.8)
  viewerScene.add(vAmbient)
  
  const vDirectional = new THREE.DirectionalLight(0xffffff, 1.2)
  vDirectional.position.set(10, 10, 10)
  viewerScene.add(vDirectional)
  
  const vDirectional2 = new THREE.DirectionalLight(0xffffff, 0.5)
  vDirectional2.position.set(-10, -10, 5)
  viewerScene.add(vDirectional2)
  
  loader.load('assets/models/1PM-app.glb', (gltf) => {
    viewerShoe = gltf.scene
    viewerShoe.scale.set(50, 50, 50)
    viewerShoe.position.set(0, -2, 0)
    viewerScene.add(viewerShoe)
    viewerModelReady = true
    console.log('Viewer Model chargé')
    animateViewer()
  }, undefined, (error) => {
    console.error('Erreur viewer:', error)
    createFallbackViewer()
  })
  
  function createFallbackViewer() {
    console.warn('Modèle viewer non trouvé')
    const geometry = new THREE.BoxGeometry(8, 8, 4)
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x333333, 
      shininess: 100
    })
    viewerShoe = new THREE.Mesh(geometry, material)
    viewerScene.add(viewerShoe)
    viewerModelReady = true
    animateViewer()
  }
  
  const featureRotations = [
    {
      name: "ADJUSTMENT & FIT",
      description: "Thanks to its 'Rubber Glove' technology, the 1PM uses non-vulcanized rubber that is both flexible, grippy and durable. Hand-shaped, it wraps your foot like a second skin.",
      rotation: { x: 0, y: 0, z: 0 },
      zoom: 1
    },
    {
      name: "CONTROL & FEEL",
      description: "The forefoot, reinforced with a climbing-inspired rubber rand, provides grip and precision where every move counts, while the EVA midsole delivers heel cushioning.",
      rotation: { x: Math.PI / 6, y: Math.PI / 4, z: 0 },
      zoom: 1.1
    },
    {
      name: "COMFORT & CONVENIENCE",
      description: "Heel pull tabs make it easy to slip on the 1PM in an instant. Zero seams minimize discomfort, while traditional comfort comes from quality materials throughout.",
      rotation: { x: -Math.PI / 3, y: Math.PI / 2, z: 0 },
      zoom: 0.9
    },
    {
      name: "DURABILITY & MATERIALS",
      description: "Built to last through an entire day, not just a single session. Premium materials and expert construction ensure the 1PM maintains its performance and aesthetic.",
      rotation: { x: -Math.PI / 2, y: 0, z: 0 },
      zoom: 1
    }
  ]
  
  let currentRotation = { x: 0, y: 0, z: 0 }
  let targetRotation = { x: 0, y: 0, z: 0 }
  let currentZoom = 1
  let targetZoom = 1
  
  function animateViewer() {
    requestAnimationFrame(animateViewer)
    
    if (viewerShoe && viewerModelReady) {
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08
      currentRotation.z += (targetRotation.z - currentRotation.z) * 0.08
      
      viewerShoe.rotation.x = currentRotation.x
      viewerShoe.rotation.y = currentRotation.y
      viewerShoe.rotation.z = currentRotation.z
      
      currentZoom += (targetZoom - currentZoom) * 0.08
      viewerShoe.scale.set(50 * currentZoom, 50 * currentZoom, 50 * currentZoom)
    }
    
    viewerRenderer.render(viewerScene, viewerCamera)
  }
  
  function switchToFeature(index) {
    const feature = featureRotations[index]
    
    const buttons = document.querySelectorAll(".control-btn")
    buttons.forEach(b => b.classList.remove('active'))
    buttons[index].classList.add('active')
    
    targetRotation = { ...feature.rotation }
    targetZoom = feature.zoom
    
    featureAnimationComplete[index] = true
    currentFeatureStep = index
    
    console.log(`${feature.name}`)
  }
  
  const buttons = document.querySelectorAll(".control-btn")
  
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switchToFeature(index)
    })
  })

  // =====================
  // SCROLL TRIGGER POUR PRODUCT VIEWER
  // =====================
  const productViewerSection = document.querySelector(".product-viewer")
  const productViewerSpacer = document.querySelector(".product-viewer-spacer")
  
  ScrollTrigger.create({
    trigger: productViewerSpacer,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      const progress = self.progress
      
      productViewerSection.classList.add('active')
      
      const stepsProgress = progress * 4
      const currentStep = Math.floor(stepsProgress)
      
      if (currentStep <= 3) {
        switchToFeature(currentStep)
      }
    },
    onEnter: () => {
      console.log('Entrée dans le product-viewer')
      featureAnimationComplete = [false, false, false, false]
    },
    onLeaveBack: () => {
      productViewerSection.classList.remove('active')
      console.log('Sortie vers le haut - scroll libéré')
    },
    onLeave: () => {
      productViewerSection.classList.remove('active')
      console.log('Sortie vers le bas')
    }
  })

  window.addEventListener('resize', () => {
    const newCanvasWidth = window.innerWidth * 0.5 - 40
    const newCanvasHeight = window.innerHeight - 80
    
    viewerCamera.aspect = newCanvasWidth / newCanvasHeight
    viewerCamera.updateProjectionMatrix()
    viewerRenderer.setSize(newCanvasWidth, newCanvasHeight)
  })
  
  setTimeout(() => {
    if (buttons.length > 0) {
      buttons[0].click()
    }
  }, 500)
}

ScrollTrigger.refresh()
console.log('Script Three.js complet chargé')