import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { AxesHelper } from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'


/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(100));
//Lights

//Testar att git funkar

const light_width = 10;
const light_height = 10;
const intensity = 1;
const rectLight1 = new THREE.PointLight( 0xffffff, intensity);
rectLight1.position.set( 50, 50, 5 );
rectLight1.lookAt( 0, 0, 0 );

const rectLight2 = new THREE.PointLight( 0xffffff, intensity);
rectLight2.position.set( -50, 50, 50 );
rectLight2.lookAt( 0, 0, 0 );

const rectLight3 = new THREE.PointLight( 0xffffff, intensity);
rectLight3.position.set( -5, -250, -5 );
rectLight3.lookAt( 0, 0, 0 );

const pointlight1 = new THREE.PointLight(0xffffff, 25)
pointlight1.position.set(0,-25, 0)
scene.add( rectLight1, rectLight2, rectLight3, pointlight1 )




/**
 * Loaders
*/
// STL loader
const stlLoader = new STLLoader()
const material = new THREE.MeshNormalMaterial()



//LOAD 20MM
stlLoader.load(
    '/STL/20mm/a20mm.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry.center(), material)
		mesh.rotation.z = -Math.PI/2
        scene.add(mesh)

		console.log(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

stlLoader.load(
    '/STL/20mm/b20mm.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry.center(), material)
		mesh.position.set(0,50,0)
		mesh.rotation.z = -Math.PI/2

        scene.add(mesh)

		console.log(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

stlLoader.load(
    '/STL/20mm/foot20mm.stl',
    function (geometry) {
        const mesh = new THREE.Mesh(geometry.center(), material)
		mesh.position.set(0, 100, 0)
		mesh.rotation.z = -Math.PI/2
        scene.add(mesh)

		console.log(mesh)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)





////////////////////////////////////////////////////////////////
const newSphere = ([x, y, z], color) => {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshStandardMaterial( {color} );
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = x;
    sphere.position.y = y;
    sphere.position.z = z;
    return sphere;
  };

///////////////////////////////////////////////////////////////
//Alla mått är i millimeter

const parameters = {
	thickness: 1,
	PAX: -50,
	PAY: -100,
	CurveVectorX: -25,
	CurveVectorY: 20,
	diameter1: 25,
	diameter2: 20,
	CurveStart: -20,
	CurveEnd: -20,
	number_of_slats: 30
}


/**
 * UI
 */
const gui = new dat.GUI({
    name: 'Lamp Configurator',
    width: 400
})
gui
	.add(parameters, 'PAX', -100, 100, 1)
	.onFinishChange(() =>
		{
			
		})

gui
	.add(parameters, 'PAY', -100, 100, 1)
	.onChange(() =>
		{
		
		})
gui
	.add(parameters, 'thickness', 1, 10, 1)
	.onChange(()=>{
		
	})
gui
	.add(parameters, 'CurveVectorX', -100, 100, 1)
	.onChange(() =>
		{
			
		})
gui
	.add(parameters, 'CurveVectorY', -100, 100, 1)
	.onChange(() =>
		{
			
		})
gui.add(parameters, 'diameter1', -100, 100, 1)
gui.add(parameters, 'diameter2', -100, 100, 1)
gui
	.add(parameters, 'number_of_slats', 3, 50, 1)
	.onChange(() =>
		{
			
		})

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 10000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 100
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
/**
 * Controls
 */
// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true



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