import Experience from '../../Experience'
import * as THREE from 'three'

export default class ConnectorB
{
    constructor(x, y, z, flip, diameter)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.diameter = diameter
        this.x = x
        this.y = y
        this.z = z
        this.flip = flip

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()

    }

    setGeometry()
    {
        if(this.diameter === 20)
        {   
            this.geometry = this.resources.items.B20mm
            this.geometry.center()
        }
        else if(this.diameter === 25)
        {
            this.geometry = this.resources.items.B25mm
            this.geometry.center()
        }
        else if(this.diameter === 28)
        {
            this.geometry = this.resources.items.B28mm
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
        //Base rotation to "proper" orientation
        this.mesh.scale.set(0.1,0.1,0.1)
        this.mesh.rotation.z = -Math.PI/2


        //Input orientation
        if(this.flip === 1)
        {
            this.mesh.rotation.y = -Math.PI - Math.PI/2
        }
        else if(this.flip === 0)
        {
            this.mesh.rotation.y = 0 - Math.PI/2
        }
        this.mesh.position.x = this.x
        this.mesh.position.y = this.y
        this.mesh.position.z = this.z

        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.scene.add(this.mesh)
    }

}