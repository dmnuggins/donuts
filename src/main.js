import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Fonts
 */
const fontLoader = new FontLoader()
const font = '/fonts/Caprasimo_Regular.json'



fontLoader.load(
    font,
    (font) =>
    {
        // Material
        const material = new THREE.MeshNormalMaterial()

        const textGeometry = new TextGeometry(
            'DONUTS',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        const textBoundingBox = new THREE.Box3().setFromObject(text)

        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64) // Donut geometry
        const donutMaterial = new THREE.MeshNormalMaterial() // Material for the donuts


        for (let i = 0; i < 150; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)

            let isIntersecting = true;
            while (isIntersecting) {
              // Generate random positions
              const posX = Math.random() * 10 - 5; // Random X position between -5 and 5
              const posY = Math.random() * 10 - 5; // Random Y position between -5 and 5
              const posZ = Math.random() * 10 - 5; // Random Z position between -5 and 5
              donut.rotation.x = Math.random() * Math.PI
              donut.rotation.y = Math.random() * Math.PI
              const scale = Math.random()
              donut.scale.set(scale, scale, scale)

              donut.position.set(posX, posY, posZ); // Set the position of the donut


              const donutBoundingBox = new THREE.Box3().setFromObject(donut)
              isIntersecting = donutBoundingBox.intersectsBox(textBoundingBox)
            }

            scene.add(donut);
          }
    },
    undefined, (error) =>
    {
        console.error('Error loading font:', error)
    }
)


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()