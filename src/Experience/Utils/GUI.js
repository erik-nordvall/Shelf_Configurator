import * as dat from 'lil-gui'

export default class GUI
{
    constructor()
    {
        this.active = window.location.hash == '#GUI'
        if(this.active)
        {
            this.ui = new dat.GUI()
        }
    }
}