import k from "../kaboom";

export class Laser{
    constructor(player){
        this.obj = k.add([
            rect(10000, 2), // Adjust size as needed
            pos(player.pos.x, player.pos.y), // Start at player's position
            color(255, 0, 0), // Red color (customize as desired)
        ]);
    }
}