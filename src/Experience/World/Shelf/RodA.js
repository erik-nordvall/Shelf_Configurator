import Experience from '../../Experience'
import * as THREE from 'three'

export default class RodA
{
    constructor(x, y, z, depth, diameter)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.meshes = this.experience.meshes

        
        this.diameter = diameter*0.1
        this.x = x
        this.y = y
        this.z = z
        this.depth = depth

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        this.geometry = new THREE.CylinderGeometry(this.diameter/2, this.diameter/2, this.depth, 64)
    }

    setTextures()
    {
        this.textures = {}
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            color: '#4F2412'
        })
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