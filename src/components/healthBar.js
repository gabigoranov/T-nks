import k from '../kaboom.js';

export class HealthBar{
    constructor(player){
        this.obj = k.add([
            rect(player.health*8, 30), 
            pos(100, 50), 
            color(0, 200, 0),
        ]);
    }
}