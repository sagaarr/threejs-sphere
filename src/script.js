import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';

// Loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/NormalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects 
// Consider it as a bones in a body - 
/* 
SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
radius — sphere radius. Default is 1.
widthSegments — number of horizontal segments. Minimum value is 3, and the default is 32.
heightSegments — number of vertical segments. Minimum value is 2, and the default is 16.
phiStart — specify horizontal starting angle. Default is 0.
phiLength — specify horizontal sweep angle size. Default is Math.PI * 2.
thetaStart — specify vertical starting angle. Default is 0.
thetaLength — specify vertical sweep angle size. Default is Math.PI.
*/
const sphereGeometory = new THREE.SphereBufferGeometry(.5, 64, 64)

// Materials
// Consider it as a skin and flesh in a body 
const material = new THREE.MeshStandardMaterial();
material.metalness= 0.7;
material.roughness = 0.2
material.normalMap = normalTexture
material.color = new THREE.Color(0x292929)

// Mesh
// It is a binding element between both of them 
const sphere = new THREE.Mesh(sphereGeometory,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.set(2,3,-0.58);
pointLight.intensity = 1.48

scene.add(pointLight)


const light1 = gui.addFolder('Light 1')
light1.add(pointLight.position, "x").min(-6).max(6).step(0.01)
light1.add(pointLight.position, "y").min(-3).max(6).step(0.01)
light1.add(pointLight.position, "z").min(-3).max(6).step(0.01)
light1.add(pointLight, "intensity").min(0).max(10).step(0.01)

const lightColor = {color:0x000000}

light1.addColor(lightColor, 'color').onChange(() => {
    pointLight.color.set(lightColor.color)
})
// Light 2

const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(-1.99,0.76,0.89);
pointLight2.intensity = 0.52
scene.add(pointLight2)

const light2 = gui.addFolder('Light 2')
light2.add(pointLight2.position, "x").min(-6).max(6).step(0.01)
light2.add(pointLight2.position, "y").min(-3).max(3).step(0.01)
light2.add(pointLight2.position, "z").min(-3).max(3).step(0.01)
light2.add(pointLight2, "intensity").min(0).max(10).step(0.01)

const lightColor2 = {color:0xff0000}

light2.addColor(lightColor2, 'color').onChange(() => {
    pointLight2.color.set(lightColor2.color)
})

// Light 3

const pointLight3 = new THREE.PointLight(0x7FFFD4, 3);
pointLight3.position.set(2.56,-3,-3);
pointLight3.intensity = 4.97
scene.add(pointLight3)

const light3 = gui.addFolder('Light 3')
light3.add(pointLight3.position, "x").min(-6).max(6).step(0.01)
light3.add(pointLight3.position, "y").min(-3).max(3).step(0.01)
light3.add(pointLight3.position, "z").min(-3).max(3).step(0.01)
light3.add(pointLight3, "intensity").min(0).max(10).step(0.01);

const lightColor3 = {color:0x7FFFD4}

light3.addColor(lightColor3, 'color').onChange(() => {
    pointLight.color.set(lightColor3.color)
});

// Helps us with the light position - like how far the light should be set / closing the light to the object 
// const pointLightHelper3 = new THREE.PointLightHelper(pointLight3,2);
// scene.add(pointLightHelper3);
/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove);
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth /2;
const windowY = window.innerHeight /2;

function onDocumentMouseMove (event)  {
    mouseX = (event.clientX - windowX);
    mouseY = (event.clientY - windowY);

} 

window.addEventListener('scroll', updateSphere);

function updateSphere (event)  {
    sphere.position.y = window.scrollY * .01
}


const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .001;
    targetY = mouseY * .001;;
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    sphere.rotation.x = .75 * (targetX - sphere.rotation.x);
    sphere.rotation.y = .75 * (targetY - sphere.rotation.y);
    sphere.position.z = -.90 * (targetX - sphere.rotation.x);
    
    // sphere.rotation.y = .5 * (targetX - sphere.rotation.y);

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()