import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(100));

// Meshes Array
let meshes = []
const b20mm = []
const a20mm = []
const feet = []

//Parameters
const parameters = {
	width: 500,
	depth: 300,
	height: 1000,
    diameter: 20,
    shelf_height1: 100,
    thickness: 10
}

//Corners
let corners = []
function generate_corners()
{
    const a1 = new THREE.Vector3(0, 0, 0)
    corners.push(a1)
    const a2 = new THREE.Vector3(parameters.depth, 0, parameters.width)
    corners.push(a2)
    const a3 = new THREE.Vector3(0, 0, parameters.width)
    corners.push(a3)
    const a4 = new THREE.Vector3(parameters.depth, 0, 0)
    corners.push(a4)
}
generate_corners()

/**
 * Loaders
*/
const gltf_loader = new GLTFLoader()
const material = new THREE.MeshNormalMaterial()
material.wireframe = false


function place_foot (x, y, z, id){
    const object = scene.getObjectById(id)
	const geo = object.geometry.clone()
    geo.center()
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.set(x, y, z)
    mesh.visible=true
    meshes.push(mesh.id)
    scene.add(mesh)
}

function place_legs(x, y, z, diameter, height){
    const leg_geo = new THREE.CylinderGeometry(diameter/2, diameter/2, height, 32)
    const leg_mesh = new THREE.Mesh(leg_geo, material)
    leg_mesh.position.set(x,y,z)
    meshes.push (leg_mesh.id)
    scene.add(leg_mesh)
}

function place_x_rods(x, y, z, diameter, depth){
    const leg_geo = new THREE.CylinderGeometry(diameter/2, diameter/2, depth, 32)
    const leg_mesh = new THREE.Mesh(leg_geo, material)
    leg_mesh.position.set(x,y,z)
    leg_mesh.rotateZ(Math.PI/2)
    meshes.push (leg_mesh.id)
    scene.add(leg_mesh)
}

function place_z_rods(x, y, z, diameter, width){
    const leg_geo = new THREE.CylinderGeometry(diameter/2, diameter/2, width, 32)
    const leg_mesh = new THREE.Mesh(leg_geo, material)
    leg_mesh.position.set(x,y,z)
    leg_mesh.rotateX(Math.PI/2)
    meshes.push (leg_mesh.id)
    scene.add(leg_mesh)
}

function place_shelf(x, y, z, thickness, width, depth){
    const shelf_geo = new THREE.BoxGeometry(depth-40, thickness, width + 70)
    const shelf_mesh = new THREE.Mesh(shelf_geo, material)
    shelf_mesh.position.set(x,y,z)
    meshes.push (shelf_mesh.id)
    scene.add(shelf_mesh)
}

function add_connectors(height)
    {
    //B
    gltf_loader.load(
        '/gltf/B20mm.gltf',
        function ( gltf ) {
            const b_20_geometry = gltf.scene.children[0].geometry.clone()
            const b_20_mesh = new THREE.Mesh(b_20_geometry, material)
            b_20_mesh.visible = false
            scene.add(b_20_mesh)
            b20mm.push(b_20_mesh.id)
            scene.add(b_20_mesh)
            for(let i=0; i<corners.length; i++){
                place_b(corners[i].x, height + corners[i].y + 20, corners[i].z, b20mm[0], i)
            }
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        })
    
    //A
    gltf_loader.load(
        '/gltf/A20mm.gltf',
        function ( gltf ) 
        {
            const a_20_geometry = gltf.scene.children[0].geometry.clone()
            const a_20_mesh = new THREE.Mesh(a_20_geometry, material)
		    a_20_mesh.visible = false
            a20mm.push(a_20_mesh.id)
            scene.add(a_20_mesh)
            for(let i=0; i<corners.length; i++)
            {
                place_a(corners[i].x, height + corners[i].y, corners[i].z, a20mm[0], i)
            }
        },
        (xhr) => 
        {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => 
        {
            console.log(error)
        })
    }

function build_base(){
    //Bottom
    gltf_loader.load(
        '/gltf/F20mm.gltf',
        function ( gltf ) {
            const f_20_geometry = gltf.scene.children[0].geometry.clone()
            const f_20_mesh = new THREE.Mesh(f_20_geometry, material)
            f_20_mesh.position.set(-200,0,0)
            f_20_mesh.visible = false
            feet.push(f_20_mesh.id)
            scene.add(f_20_mesh)
    
            for(let i=0; i<corners.length; i++){
                place_foot(corners[i].x, corners[i].y, corners[i].z , feet[0])
                place_legs(corners[i].x, parameters.height/2 , corners[i].z, parameters.diameter, parameters.height)
            }
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
        
    )

    place_x_rods(parameters.depth/2, parameters.height - parameters.shelf_height, 0, parameters.diameter, parameters.depth-30)
    place_x_rods(parameters.depth/2, parameters.height - parameters.shelf_height, parameters.width, parameters.diameter, parameters.depth-30)

    place_z_rods(0, parameters.height - parameters.shelf_height + 20, parameters.width/2, parameters.diameter, parameters.width-30)
    place_z_rods(parameters.depth , parameters.height - parameters.shelf_height + 20, parameters.width/2, parameters.diameter, parameters.width-30)

    add_connectors(parameters.shelf_height)

    place_shelf(parameters.depth/2, parameters.shelf_height + 17 ,parameters.width/2, parameters.thickness, parameters.width, parameters.depth)
    
    //Top
    place_x_rods(parameters.depth/2, parameters.shelf_height, 0, parameters.diameter, parameters.depth-30)
    place_x_rods(parameters.depth/2, parameters.shelf_height, parameters.width, parameters.diameter, parameters.depth-30)
    
    place_z_rods(0,parameters.shelf_height + 20, parameters.width/2, parameters.diameter, parameters.width-30)
    place_z_rods(parameters.depth ,parameters.shelf_height + 20, parameters.width/2, parameters.diameter, parameters.width-30)

    add_connectors(parameters.height - parameters.shelf_height)

    place_shelf(parameters.depth/2, parameters.height - parameters.shelf_height + 17 ,parameters.width/2, parameters.thickness, parameters.width, parameters.depth)

}

function add_shelf(height)
{
        place_shelf(parameters.depth/2, height + 17 ,parameters.width/2, parameters.thickness, parameters.width, parameters.depth)
        place_x_rods(parameters.depth/2, height, 0, parameters.diameter, parameters.depth-30)
        place_x_rods(parameters.depth/2, height, parameters.width, parameters.diameter, parameters.depth-30)

        place_z_rods(0, height + 20, parameters.width/2, parameters.diameter, parameters.width-30)
        place_z_rods(parameters.depth , height + 20, parameters.width/2, parameters.diameter, parameters.width-30)
        
        add_connectors(height)
}
build_base()
add_shelf(parameters.height/2)


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
    meshes.push(mesh.id)
    scene.add(mesh)
}


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
    meshes.push(mesh.id)
    scene.add(mesh)
}

function shelfdelete() {
    meshes.map( ( i ) => {
		const object = scene.getObjectByProperty( 'id' ,i );
		object.geometry.dispose();
		object.material.dispose();
		scene.remove( object );
	} );
	meshes = []
    corners = []
};

/**
 * UI
 */
const gui = new dat.GUI({
    name: 'Shelf Configurator',
    width: 400
})
gui
	.add(parameters, 'height', 300, 2000, 1)
	.onFinishChange(() =>
		{
			shelfdelete()
            generate_corners()
            build_base()
		})

gui
	.add(parameters, 'depth', 20, 500, 1)
	.onFinishChange(() =>
		{
            shelfdelete()
            generate_corners()
            build_base()
		})
gui
	.add(parameters, 'width', 100, 1000, 1)
	.onFinishChange(()=>
    {
            shelfdelete()
            generate_corners()
            build_base()
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
camera.position.x = 1000
camera.position.y = 1000
camera.position.z = 1000
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