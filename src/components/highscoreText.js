import k from '../kaboom.js';

export class HighscoreText{
    constructor(score){
        this.obj = k.add([
            text("Highscore: " + score),
            pos(1000, 20), // Centered position
            color(0, 0, 0),
            scale(1), // Adjust size as needed
        ]);
    }
}