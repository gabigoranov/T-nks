import k from '../kaboom.js';

export class AmmoBar{
    constructor(ammo){
        this.obj = k.add([
            rect(ammo * 10, 10), 
            pos(100, 20), 
            color(1, 0, 0),
        ]);
    }

    showOutOfAmmoPopup() {
        const popup = k.add([
            text("Out of Ammo!"),
            pos(100 , 20), // Centered position
            color(255, 0, 0),
            scale(1), // Adjust size as needed
            lifespan(1), // Show for 2 seconds
        ]);
    }

    updateAmmoBar(ammoCount) {
        this.obj.width = ammoCount * 10; // Adjust the multiplier as needed
    }
}