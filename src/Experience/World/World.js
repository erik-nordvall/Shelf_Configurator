import * as THREE from 'three'
import Experience from "../Experience";
import Bookcase from './Bookcase';
import Environment from './Environment';
import Floor from './Floor';

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.scene.background = new THREE.Color( '#f9f1f1' );

        this.resources = this.experience.resources
        
        //Wait for resources
        this.resources.on('ready', ()=>
        {
            //Setup
            this.floor = new Floor()
            this.bookcase = new Bookcase(100, 100, 50, 4, 20)
            this.bookcase.addShelf(25)
            this.bookcase.addShelf(50)
            this.environment = new Environment()

        })

        
        
    }
}