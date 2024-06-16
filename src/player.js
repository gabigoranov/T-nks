import k from "./kaboom.js";
import {laser, ammoBar, healthBar, deathMessage} from "./main.js";

k.loadSprite("player", "sprites/player.png");
export class Player{
    constructor(x, y, angle, speed, health, ammo){
        this.obj = k.add([
            sprite("player"),
	        scale(1),
            anchor("center"),
            pos(x, y),
            area(),
            body(),
            rotate(angle),
            "player",
            {
                dir: LEFT,
                dead: false,
                speed: speed,
                health: health,
                isInvincible: false,
            },

        ]);

        this.ammo = ammo;
    }

    shoot() {
        if(this.ammo == 0){
            ammoBar.showOutOfAmmoPopup();
            return;
        }
        const bullet = k.add([
            sprite("bullet"),
            pos(this.obj.pos.x, this.obj.pos.y),
            scale(0.3),
            rotate(this.obj.angle),
            area(),
            anchor("center"),
            {
                speed: 1000,
            },
            "bullet"
        ]);
    
        this.ammo -= 1
        ammoBar.updateAmmoBar(this.ammo)
    }
}