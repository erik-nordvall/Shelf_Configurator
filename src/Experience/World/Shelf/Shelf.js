import Experience from '../../Experience'
import * as THREE from 'three'

export default class Shelf
{
    constructor(x, y, z, width, depth, diameter)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.meshes = this.experience.meshes

        
        this.diameter = diameter*0.1
        this.x = x
        this.y = y
        this.z = z
        this.width = width
        this.depth = depth

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        let shape = new THREE.Shape()
        shape.moveTo(this.width/2, this.depth/2)
        shape.lineTo(this.width/2, -this.depth/2)
        shape.lineTo(-this.width/2, -this.depth/2)
        shape.lineTo(-this.width/2, this.depth/2)
        shape.lineTo(this.width/2, this.depth/2)

        const extrudeSettings = {
            steps: 1,
            depth: this.diameter/2,
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        }

        this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)



    }

    setTextures()
    {
        this.textures = {}
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            color: 'white'
        })
        this.material.wireframe = false
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotateX(Math.PI/2)
        this.mesh.position.x = this.x
        this.mesh.position.y = this.y
        this.mesh.position.z = this.z
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.meshes.push(this.mesh.id)
        this.scene.add(this.mesh)
    }

}