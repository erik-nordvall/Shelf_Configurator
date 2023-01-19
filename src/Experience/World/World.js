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
        this.meshes = this.experience.meshes
        this.scene.background = new THREE.Color( '#f9f1f1' );

        this.resources = this.experience.resources

        this.parameters = 
        {
            width: 100,
            height: 100,
            depth: 30,
            shelves: 3,
            diameter: 20
        }
        

        //Wait for resources
        this.resources.on('ready', ()=>
        {
            //Setup
            this.floor = new Floor()
            this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)

            this.GUI = this.experience.GUI
            //Debug
            if(this.GUI.active)
            {
                this.GUIFolder = this.GUI.ui.addFolder('Bookcase')
                this.GUIFolder.add(this.parameters, 'width', 30, 200, 1).onFinishChange(()=>
                {
                    this.bookcase.destroy()
                    this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)
                })
                this.GUIFolder.add(this.parameters, 'depth', 30, 200, 1).onFinishChange(()=>
                {
                    this.bookcase.destroy()
                    this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)
                })
                this.GUIFolder.add(this.parameters, 'height', 60, 200, 1).onFinishChange(()=>
                {
                    this.bookcase.destroy()
                    this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)
                })
                this.GUIFolder.add(this.parameters, 'diameter', { 20: '20', 25: '25', 28: '28' } );
                this.GUIFolder.controllers[3].onChange(()=>
                {
                    if(this.GUIFolder.controllers[3].$select.options.selectedIndex == 0)
                    {
                        this.parameters.diameter = 20
                        this.bookcase.destroy()
                        this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)
               
                    }
                    if(this.GUIFolder.controllers[3].$select.options.selectedIndex == 1)
                    {
                        this.parameters.diameter = 25
                        this.bookcase.destroy()
                        this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)

                    }
                    if(this.GUIFolder.controllers[3].$select.options.selectedIndex == 2)
                    {
                        this.parameters.diameter = 28
                        this.bookcase.destroy()
                        this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)

                    }
                })
                this.GUIFolder.add(this.parameters, 'shelves', 2, 8, 1).onFinishChange(()=>
                {
                    this.bookcase.destroy()
                    this.bookcase = new Bookcase(this.parameters.height, this.parameters.width, this.parameters.depth, this.parameters.shelves, this.parameters.diameter)
                })


            }

            this.environment = new Environment()


        })
   
    }
    


}