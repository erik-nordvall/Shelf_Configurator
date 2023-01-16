import Experience from '../../Experience'
import * as THREE from 'three'

export default class Feet
{
    constructor(x, y, z, diameter)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.diameter = diameter
        this.x = x
        this.y = y
        this.z = z

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        if(this.diameter === 20)
        {   
            this.geometry = this.resources.items.F20mm
            this.geometry.center()
        }
        else if(this.diameter === 25)
        {
            this.geometry = this.resources.items.F25mm
            this.geometry.center()
        }
        else if(this.diameter === 28)
        {
            this.geometry = this.resources.items.F28mm
            this.geometry.center()
        }
    }

    setTextures()
    {
        this.textures = {}
    }

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            color: '#154360'
        })
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI/2
        this.mesh.scale.set(0.1,0.1,0.1)


        this.mesh.position.x = this.x
        this.mesh.position.y = this.y + 0.7
        this.mesh.position.z = this.z
        
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        console.log(this.mesh)
        this.scene.add(this.mesh)
    }

}