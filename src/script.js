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
stlLoader.setDecoderPath('STL/')

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
let thickness = parameters.thickness

/////////////////////////////////Rita upp första kurvan
const path = new THREE.Shape();

//Controlpoint A1
const CPA1X = -3*thickness //ska vara låst. koordinaten i x-led för att få 90 grader
const CPA1Y = parameters.CurveStart//Storleken på curvan, alltid negativ

//Controlpoint A2
const CPA2X = parameters.PAX + parameters.CurveVectorX
const CPA2Y = parameters.PAY + parameters.CurveVectorY

//Controlpoint B1
const CPB1X = parameters.PAX - parameters.CurveVectorX
const CPB1Y = parameters.PAY - parameters.CurveVectorY

//Controlpoint B2
const CPB2X = thickness //Ska vara låst i x-led för att få 90 grader
const CPB2Y = parameters.CurveEnd//Storleken på curvan, alltid negativ

path.lineTo( 0, thickness );
path.lineTo(-3*thickness, thickness);
path.lineTo(-3*thickness, -thickness)

//BEZIER A
path.bezierCurveTo(CPA1X, CPA1Y, CPA2X, CPA2Y, parameters.PAX, parameters.PAY)

//BEZIER B
path.bezierCurveTo(CPB1X, CPB1Y, CPB2X, CPB2Y, thickness, -thickness)

path.lineTo(- 2*thickness, -thickness );
path.lineTo(- 2*thickness, 0 );
path.lineTo(0, 0);

let holes = []
let hangerarray = []

function generate_holes(number_of_slats){
	let diameter = 20
	let length = parameters.thickness*3
	let spread = 2*Math.PI/parameters.number_of_slats

	for (let i = 0; i<parameters.number_of_slats; i++){
		let angle = spread * i 

		let hole1 = new THREE.Path();

		hole1.moveTo((parameters.thickness/2 * Math.cos(angle))-(((diameter)*Math.sin(angle))),
				 (parameters.thickness/2 * Math.sin(angle))+(((diameter)*Math.cos(angle))))

		hole1.lineTo((parameters.thickness/2 * Math.cos(angle))-(((diameter+length)*Math.sin(angle))),
				 (parameters.thickness/2 * Math.sin(angle))+(((diameter+length)*Math.cos(angle))))

		hole1.lineTo((-parameters.thickness/2 * Math.cos(angle))-(((diameter+length)*Math.sin(angle))),
				 (-parameters.thickness/2 * Math.sin(angle))+(((diameter+length)*Math.cos(angle))))

		hole1.lineTo((-parameters.thickness/2 * Math.cos(angle))-(((diameter)*Math.sin(angle))),
				 (-parameters.thickness/2 * Math.sin(angle))+(((diameter)*Math.cos(angle))))
	
		hole1.lineTo((parameters.thickness/2 * Math.cos(angle))-(((diameter)*Math.sin(angle))),
				 (parameters.thickness/2 * Math.sin(angle))+(((diameter)*Math.cos(angle))))
	
		holes.push(hole1)
	}
}

function generate_pattern(){
	const extrudeSettings = {
		depth: parameters.thickness,
		steps: 1,
		bevelEnabled: false
	}
	
	let n = 100;
	let it = Math.PI*(4-Math.sqrt(11));
	let sc = 18;
	for(let i=0; i<n; i++) {
		// Calculating polar coordinates theta (t) and radius (r)
		const hole_pattern = new THREE.Path();
		let t=it*i; 
		let r=Math.sqrt(i/n);
		// Converting to the Cartesian coordinates x, y
		let x = sc*r*Math.cos(t); 
		let y = sc*r*Math.sin(t);
		hole_pattern.moveTo(x,y)
		hole_pattern.absellipse(x, y, 0.25, 0.25)
		const circle1_points = hole_pattern.getPoints();
		const circle1 = new THREE.Shape().setFromPoints(circle1_points)
		const geometry1 = new THREE.ExtrudeGeometry(circle1, extrudeSettings)
		geometry1.rotateX(Math.PI/2)
		geometry1.translate(0,4,0)
		geometry1.rotateY(-Math.PI/2)
		const material1 = new THREE.MeshPhongMaterial()
		const hanger = new THREE.Mesh(geometry1, material1)
		hanger.material.color.set("green")
		hangerarray.push(hanger.uuid);
		scene.add( hanger );
	  }
}
//generate_pattern()

function generate_hanger(){
	const circle1_path = new THREE.Path();
	circle1_path.absellipse(0,0, parameters.diameter1, parameters.diameter1)
	const circle1_points = circle1_path.getPoints(200);
	const circle1 = new THREE.Shape().setFromPoints(circle1_points)

	generate_holes(parameters.number_of_slats)
	
	circle1.holes = holes
	console.log(circle1)
	const points = circle1.getPoints(200);
	const hanger_shape = new THREE.Shape().setFromPoints(points)
	const extrudeSettings = {
		depth: parameters.thickness,
		steps: 1,
		bevelEnabled: false
	}
	const geometry1 = new THREE.ExtrudeGeometry(circle1, extrudeSettings)
	//geometry1.translate(0,0,-parameters.thickness/2)
	geometry1.rotateX(Math.PI/2)
	geometry1.translate(0,0,0)
	geometry1.rotateY(-Math.PI/2)
	const material1 = new THREE.MeshPhongMaterial()
	material1.wireframe = false
	const hanger = new THREE.Mesh(geometry1, material1)
	hangerarray.push(hanger.uuid);
	scene.add( hanger );
}
let lamparray = []
function generate_slats(path, angle){
	path.curves[0].arcLengthDivisions = 10
	path.curves[1].arcLengthDivisions = 10
	path.curves[2].arcLengthDivisions = 10
	path.curves[3].arcLengthDivisions = 300
	path.curves[4].arcLengthDivisions = 300
	path.curves[5].arcLengthDivisions = 10
	path.curves[6].arcLengthDivisions = 10
	path.curves[7].arcLengthDivisions = 10
	const points = path.getPoints(300);
	const slat_shape = new THREE.Shape().setFromPoints(points)
	const extrudeSettings = {
		depth: parameters.thickness,
		steps: 1,
		bevelEnabled: false
	}
	const geometry1 = new THREE.ExtrudeGeometry(slat_shape, extrudeSettings)
	geometry1.translate(0,0,-parameters.thickness/2)
	const material1 = new THREE.MeshPhongMaterial()	
	const slat = new THREE.Mesh(geometry1, material1)
	slat.rotation.y = angle
	slat.position.x = Math.cos(angle) * -20
	slat.position.z = -Math.sin(angle) * -20
	//slat.position.x = -Math.cos(angle) *20 + Math.sin(angle) *20
	//slat.position.z = -Math.sin(angle) *20 - Math.cos(angle) * 20
	//slat.rotation.y = -angle


	lamparray.push(slat.uuid);
	scene.add( slat );
	
}

function lampdelete( ) {
    lamparray.map( ( i ) => {
		const object = scene.getObjectByProperty( 'uuid' ,i );
		object.geometry.dispose();
		object.material.dispose();
		scene.remove( object );
	} );

	hangerarray.map( ( i ) => {
		const object = scene.getObjectByProperty( 'uuid' ,i );
		object.geometry.dispose();
		object.material.dispose();
		scene.remove( object );
	} );
	lamparray = []
	hangerarray = []
	holes = []
};

function generate_lamp(path){
	let spread = 2*Math.PI/parameters.number_of_slats
	for (let i = 0; i<parameters.number_of_slats; i++){
		let angle = spread * i
		generate_slats(path, angle)
	}
	generate_hanger()
}

generate_lamp(path);

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
			lampdelete()
			path.curves[3].v3.x = parameters.PAX
			path.curves[4].v0.x = parameters.PAX
			path.curves[3].v2.x = parameters.PAX + parameters.CurveVectorX
			path.curves[4].v1.x = parameters.PAX - parameters.CurveVectorX
			generate_lamp(path, parameters.number_of_slats)
		})

gui
	.add(parameters, 'PAY', -100, 100, 1)
	.onChange(() =>
		{
			lampdelete()
			path.curves[3].v3.y = parameters.PAY
			path.curves[4].v0.y = parameters.PAY
			path.curves[3].v2.y = parameters.PAY + parameters.CurveVectorY
			path.curves[4].v1.y = parameters.PAY - parameters.CurveVectorY
			generate_lamp(path, parameters.number_of_slats)
		})
gui
	.add(parameters, 'thickness', 1, 10, 1)
	.onChange(()=>{
		lampdelete()
		thickness = parameters.thickness
		generate_lamp(path, parameters.number_of_slats)
	})
gui
	.add(parameters, 'CurveVectorX', -100, 100, 1)
	.onChange(() =>
		{
			lampdelete()
			path.curves[3].v2.x = parameters.PAX + parameters.CurveVectorX
			path.curves[4].v1.x = parameters.PAX - parameters.CurveVectorX
			generate_lamp(path, parameters.number_of_slats)
		})
gui
	.add(parameters, 'CurveVectorY', -100, 100, 1)
	.onChange(() =>
		{
			lampdelete()
			path.curves[3].v2.y = parameters.PAY + parameters.CurveVectorY
			path.curves[4].v1.y = parameters.PAY - parameters.CurveVectorY
			generate_lamp(path, parameters.number_of_slats)
		})
gui.add(parameters, 'diameter1', -100, 100, 1)
gui.add(parameters, 'diameter2', -100, 100, 1)
gui
	.add(parameters, 'number_of_slats', 3, 50, 1)
	.onChange(() =>
		{
			lampdelete()
			generate_lamp(path, parameters.number_of_slats)
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