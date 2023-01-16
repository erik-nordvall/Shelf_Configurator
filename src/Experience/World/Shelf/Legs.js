import Experience from '../../Experience'
import * as THREE from 'three'

export default class Legs
{
    constructor(x, y, z, height, diameter)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.diameter = diameter*0.1
        this.x = x
        this.y = y
        this.z = z
        this.height = height

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        this.geometry = new THREE.CylinderGeometry(this.diameter/2, this.diameter/2, this.height, 32)
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
        //Base rotation to "proper" orientation

        this.mesh.position.x = this.x
        this.mesh.position.y = this.y
        this.mesh.position.z = this.z

        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.scene.add(this.mesh)
    }

}