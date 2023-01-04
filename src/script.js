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

//Parameters
const parameters = {
	width: 500,
	depth: 300,
	height: 1000,
    diameter: 20,
    shelf_height: 100,
    thickness: 10
}

  
/**
 * Loaders
*/
// STL loader
const gltf_loader = new GLTFLoader()
const material = new THREE.MeshNormalMaterial()
material.wireframe = false

//Set feet locations
const feet_location = []
const a = new THREE.Vector2(0,0)
feet_location.push(a)
const b = new THREE.Vector2(0,parameters.width)
feet_location.push(b)
const c = new THREE.Vector2(parameters.depth,parameters.width)
feet_location.push(c)
const d = new THREE.Vector2(parameters.depth,0)
feet_location.push(d)

//LOAD 20MM FOOT
const feet = []
gltf_loader.load(
    '/gltf/F20mm.gltf',
    function ( gltf ) {
        const f_20_geometry = gltf.scene.children[0].geometry.clone()
        const f_20_mesh = new THREE.Mesh(f_20_geometry, material)
        f_20_mesh.position.set(-200,0,0)
        f_20_mesh.visible = false
        feet.push(f_20_mesh.id)
        scene.add(f_20_mesh)

        for(let i=0; i<feet_location.length; i++){
            place_foot(feet_location[i].x, 0, feet_location[i].y , feet[0])
            place_legs(feet_location[i].x, parameters.height/2 , feet_location[i].y, parameters.diameter, parameters.height)
        }
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
	
)
function place_foot (x, y, z, id){
    const object = scene.getObjectById(id)
	const geo = object.geometry.clone()
    geo.center()
    //geo.translate(x, y, z)
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(x, y, z)
    mesh.visible=true
    scene.add(mesh)
}

const legs = []
function place_legs(x, y, z, diameter, height){
    const leg_geo = new THREE.CylinderGeometry(diameter/2, diameter/2, height, 32)
    const leg_mesh = new THREE.Mesh(leg_geo, material)
    leg_mesh.position.set(x,y,z)
    legs.push (leg_mesh.id)
    scene.add(leg_mesh)
}

const shelf = new THREE.Group()

const connect_X = []
function place_x_rods(x, y, z, diameter, depth){
    const leg_geo = new THREE.CylinderGeometry(diameter/2, diameter/2, depth, 32)
    const leg_mesh = new THREE.Mesh(leg_geo, material)
    leg_mesh.position.set(x,y,z)
    leg_mesh.rotateZ(Math.PI/2)
    connect_X.push (leg_mesh.id)
    scene.add(leg_mesh)
}

const connect_Z = []
function place_z_rods(x, y, z, diameter, width){
    const leg_geo = new THREE.CylinderGeometry(diameter/2, diameter/2, width, 32)
    const leg_mesh = new THREE.Mesh(leg_geo, material)
    leg_mesh.position.set(x,y,z)
    leg_mesh.rotateX(Math.PI/2)
    connect_Z.push (leg_mesh.id)
    scene.add(leg_mesh)
}

const shelves = []
function place_shelf(x, y, z, thickness, width, depth){
    const shelf_geo = new THREE.BoxGeometry(depth-40, thickness, width + 70)
    const shelf_mesh = new THREE.Mesh(shelf_geo, material)
    shelf_mesh.position.set(x,y,z)
    //shelf_mesh.rotateX(Math.PI/2)
    shelves.push (shelf_mesh.id)
    scene.add(shelf_mesh)
}

place_x_rods(parameters.depth/2, parameters.shelf_height, 0, parameters.diameter, parameters.depth-30)
place_x_rods(parameters.depth/2, parameters.shelf_height, parameters.width, parameters.diameter, parameters.depth-30)

place_z_rods(0,parameters.shelf_height + 20, parameters.width/2, parameters.diameter, parameters.width-30)
place_z_rods(parameters.depth ,parameters.shelf_height + 20, parameters.width/2, parameters.diameter, parameters.width-30)

place_shelf(parameters.depth/2, parameters.shelf_height + 17 ,parameters.width/2, parameters.thickness, parameters.width, parameters.depth)
//Set a locations
const a_location = []
const e = new THREE.Vector3(0,parameters.shelf_height,0)
a_location.push(e)
const g = new THREE.Vector3(parameters.depth,parameters.shelf_height,parameters.width)
a_location.push(g)
const f = new THREE.Vector3(0,parameters.shelf_height,parameters.width)
a_location.push(f)
const h = new THREE.Vector3(parameters.depth,parameters.shelf_height,0)
a_location.push(h)

//LOAD 20MM A
const a20mm = []
gltf_loader.load(
    '/gltf/A20mm.gltf',
    function ( gltf ) {
        const a_20_geometry = gltf.scene.children[0].geometry.clone()
        const a_20_mesh = new THREE.Mesh(a_20_geometry, material)
		a_20_mesh.rotation.z = -Math.PI/2
        a_20_mesh.rotation.y = -Math.PI/2
        a_20_mesh.position.set(0, 110, 0)
		a_20_mesh.visible = false
        a20mm.push(a_20_mesh.id)
        scene.add(a_20_mesh)
        for(let i=0; i<a_location.length; i++){
            place_a(a_location[i].x, a_location[i].y, a_location[i].z, a20mm[0], i)
        }
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

function place_a (x, y, z, id, index){
    const object = scene.getObjectById(id)
	const geo = object.geometry.clone()
    geo.center()
    geo.rotateZ(-Math.PI/2)
    if (index % 2 == 0){
    }
    else{
        geo.rotateY(Math.PI)
    }
    const mesh = new THREE.Mesh(geo, material)
    if (index % 2 == 0){
        mesh.position.set(x+7.5, y, z)
    }
    else{
        mesh.position.set(x-7.5, y, z)
    }
    mesh.visible=true
    scene.add(mesh)
}


//set b locations
const b_location = []
const i = new THREE.Vector3(0,parameters.shelf_height + 20, 0)
b_location.push(i)
const j = new THREE.Vector3(parameters.depth,parameters.shelf_height + 20, parameters.width)
b_location.push(j)
const k = new THREE.Vector3(0,parameters.shelf_height + 20, parameters.width)
b_location.push(k)
const l = new THREE.Vector3(parameters.depth,parameters.shelf_height + 20, 0)
b_location.push(l)

//LOAD 20MM B
const b20mm = []
gltf_loader.load(
    '/gltf/B20mm.gltf',
    function ( gltf ) {
        const b_20_geometry = gltf.scene.children[0].geometry.clone()
        const b_20_mesh = new THREE.Mesh(b_20_geometry, material)
		b_20_mesh.rotation.z = -Math.PI/2
        b_20_mesh.rotation.y = -Math.PI/2
        b_20_mesh.position.set(-110,110,-35)
		b_20_mesh.visible = false
        scene.add(b_20_mesh)
        b20mm.push(b_20_mesh.id)
        scene.add(b_20_mesh)
        for(let i=0; i<b_location.length; i++){
            place_b(b_location[i].x, b_location[i].y, b_location[i].z, b20mm[0], i)
        }
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
	
)
function place_b (x, y, z, id, index){
    const object = scene.getObjectById(id)
	const geo = object.geometry.clone()
    geo.center()
    geo.rotateZ(Math.PI/2)
    geo.rotateY(-Math.PI/2)
    if (index % 2 == 0){
    }
    else{
        geo.rotateY(Math.PI)
    }
    const mesh = new THREE.Mesh(geo, material)
    if (index % 2 == 0){
        mesh.position.set(x, y, z)
    }
    else{
        mesh.position.set(x, y, z)
    }
    mesh.visible=true
    scene.add(mesh)
}

/**
 * UI
 */
const gui = new dat.GUI({
    name: 'Shelf Configurator',
    width: 400
})
gui
	.add(parameters, 'height', 50, 1000, 1)
	.onFinishChange(() =>
		{
			
		})

gui
	.add(parameters, 'depth', 20, 150, 1)
	.onChange(() =>
		{
		
		})
gui
	.add(parameters, 'width', 100, 1000, 1)
	.onChange(()=>{
		
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