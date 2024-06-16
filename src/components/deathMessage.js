import k from '../kaboom.js';

export class DeathMessage{
    constructor(){
        this.obj = k.add([
            text(""), 
            pos(100, 50), 
            color(200, 0, 0),
        ]);
    }
}