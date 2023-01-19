//Bygga hyllan - lägg in i world
import * as THREE from 'three'
import Experience from "../Experience";
import ConnectorA from './Shelf/ConnectorA';
import ConnectorB from './Shelf/ConnectorB';
import Feet from './Shelf/Feet';
import Legs from './Shelf/Legs';
import RodA from './Shelf/RodA';
import RodB from './Shelf/RodB';
import Shelf from './Shelf/Shelf';


export default class Bookcase
{
    constructor(height, width, depth, shelves, diameter)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.meshes = this.experience.meshes        

        this.height = height
        this.width = width
        this.depth = depth
        this.shelves = shelves

        this.bottom_spacing = 10
        this.top_spacing = 10

        


        if(diameter === 20)
        {
            this.offset = 0.8
            this.diameter = diameter
            this.connector_offset = 2

        }
        else if (diameter === 25)
        {
            this.offset = 1
            this.diameter = diameter
            this.connector_offset = 2
        }
        else
        {
            this.offset = 1.2
            this.diameter = diameter
            this.connector_offset = 2
        }

        this.corners = [
            {
                position: 'front_right',
                x: this.width /2, 
                y: 0,
                z: this.depth/2
            },
            {
                position: 'rear_right',
                x: this.width /2, 
                y: 0,
                z: -this.depth/2
            },
            {
                position: 'front_left',
                x: -this.width /2, 
                y: 0,
                z: this.depth/2
            },
            {
                position: 'rear_left',
                x: -this.width /2, 
                y: 0,
                z: -this.depth/2
            },


        ]
        
        this.baseFrame()
        this.spacing = (this.height - (this.bottom_spacing + this.top_spacing))/(this.shelves -1)


        for(let i = 1; i<this.shelves-1; i++)
        {
            this.addShelf((this.spacing*i) + this.bottom_spacing)
        }
    }

    addShelf(height)
    {
        this.rodA_BL = new RodA(-this.width/2, height, 0, this.depth, this.diameter)
        this.rodA_BR = new RodA(this.width/2, height, 0, this.depth, this.diameter)

        this.rod_BL = new RodB(0, height + this.connector_offset, this.depth/2, this.width, this.diameter)
        this.rod_BR = new RodB(0, height + this.connector_offset, -this.depth/2, this.width, this.diameter)

        this.shelf_B = new Shelf(0, height + this.connector_offset + 1, 0, this.width + 7, this.depth -4, this.diameter)


        for(const corner of this.corners)
        {
        
            if(corner.position === 'front_right')
            {
                this.connectorA = new ConnectorA(corner.x, height, corner.z -this.offset ,1, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, height + this.connector_offset, corner.z, 1, this.diameter)
            }
            else if(corner.position === 'front_left')
            {
                this.connectorA = new ConnectorA(corner.x, height, corner.z -this.offset ,1, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, height + this.connector_offset, corner.z, 1, this.diameter)
            }
            else
            {
                this.connectorA = new ConnectorA(corner.x, height, corner.z + this.offset ,0, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, height + this.connector_offset, corner.z, 0, this.diameter)
            }

        }
    }

    baseFrame()
    {   
        //BOTTOM
        this.rodA_BL = new RodA(-this.width/2, this.bottom_spacing, 0, this.depth, this.diameter)
        this.rodA_BR = new RodA(this.width/2, this.bottom_spacing, 0, this.depth, this.diameter)

        this.rod_BL = new RodB(0, this.bottom_spacing + this.connector_offset, this.depth/2, this.width, this.diameter)
        this.rod_BR = new RodB(0, this.bottom_spacing + this.connector_offset, -this.depth/2, this.width, this.diameter)

        this.shelf_B = new Shelf(0, this.bottom_spacing + this.connector_offset + 1, 0, this.width + 7, this.depth -4, this.diameter)


        for(const corner of this.corners)
        {
            this.feet = new Feet(corner.x, corner.y,corner.z,this.diameter)
            this.legs = new Legs(corner.x, this.height/2, corner.z, this.height, this.diameter)

            if(corner.position === 'front_right')
            {
                this.connectorA = new ConnectorA(corner.x, this.bottom_spacing, corner.z -this.offset ,1, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, this.bottom_spacing + this.connector_offset, corner.z, 1, this.diameter)
            }
            else if(corner.position === 'front_left')
            {
                this.connectorA = new ConnectorA(corner.x, this.bottom_spacing, corner.z -this.offset ,1, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, this.bottom_spacing + this.connector_offset, corner.z, 1, this.diameter)
            }
            else
            {
                this.connectorA = new ConnectorA(corner.x, this.bottom_spacing, corner.z + this.offset ,0, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, this.bottom_spacing + this.connector_offset, corner.z, 0, this.diameter)
            }

        }
        //TOP
        this.rodA_BL = new RodA(-this.width/2, this.height - this.top_spacing, 0, this.depth, this.diameter)
        this.rodA_BR = new RodA(this.width/2, this.height - this.top_spacing, 0, this.depth, this.diameter)

        this.rod_BL = new RodB(0, this.height - this.top_spacing + this.connector_offset, this.depth/2, this.width, this.diameter)
        this.rod_BR = new RodB(0, this.height - this.top_spacing + this.connector_offset, -this.depth/2, this.width, this.diameter)

        this.shelf_B = new Shelf(0, this.height - this.top_spacing + this.connector_offset + 1, 0, this.width + 7, this.depth -4, this.diameter)

        for(const corner of this.corners)
        {
            
            if(corner.position === 'front_right')
            {
                this.connectorA = new ConnectorA(corner.x, this.height - this.top_spacing, corner.z -this.offset ,1, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, this.height - this.top_spacing + this.connector_offset, corner.z, 1, this.diameter)
            }
            else if(corner.position === 'front_left')
            {
                this.connectorA = new ConnectorA(corner.x, this.height - this.top_spacing, corner.z -this.offset ,1, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, this.height - this.top_spacing + this.connector_offset, corner.z, 1, this.diameter)
            }
            else
            {
                this.connectorA = new ConnectorA(corner.x, this.height - this.top_spacing, corner.z + this.offset ,0, this.diameter)
                this.ConnectorB = new ConnectorB(corner.x, this.height - this.top_spacing + this.connector_offset, corner.z, 0, this.diameter)
            }

        }
    }
    destroy()
    {
        this.meshes.map( ( i ) => {
            const object = this.scene.getObjectByProperty( 'id' ,i );
            object.geometry.dispose();
            object.material.dispose();
            this.scene.remove( object );
        } );
        this.experience.meshes = []
    }
    
}