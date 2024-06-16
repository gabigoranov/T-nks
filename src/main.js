import k from "./kaboom.js";
import { Player } from "./player.js";
import { Laser } from "./components/laser.js"
import { AmmoBar } from "./components/ammoBar.js";
import { HealthBar } from "./components/healthBar.js";
import { DeathMessage } from "./components/deathMessage.js";
import { HighscoreText } from "./components/highscoreText.js";

k.loadSprite("bullet", "sprites/bullet.png");

//properties
let ammo = 30;
let enemiesToSpawn = ammo-10;
let enemiesKilled = 0;
const enemiesToKill = ammo-10;

let score = 0;
if(document.cookie != null && document.cookie != 'NaN' && document.cookie != ''){
    score = parseInt(document.cookie);
}

//kaboom objects
const player = new Player(100, 200, 0, 24000, 20, ammo);

export const laser = new Laser(player.obj);
export const ammoBar = new AmmoBar(player.ammo);
export const healthBar = new HealthBar(player.obj);
export const deathMessage = new DeathMessage();
export const highscoreText = new HighscoreText(score).obj;

//functions








function makePlayerInvincible() {
    player.obj.isInvincible = true; 
    wait(0.3, () => {
        player.obj.isInvincible = false; 
    });
}

function spawnEnemy(){
    enemyX = rand(width());
    enemyY = rand(height());
    const playerDistance = Math.sqrt((player.obj.pos.x - enemyX) ** 2 + (player.obj.pos.y - enemyY) ** 2);
    if(playerDistance < 500) {
        // Recalculate position
        enemyX = rand(width());
        enemyY = rand(height());
    }

    k.add([
        sprite("player"),
        scale(1),
        anchor("center"),
        pos(enemyX, enemyY),
        area(),
        body(),
        color(255, 10, 0),
        rotate(0),
        health(6),
        "enemy",
        "enemy",
        {
            dir: LEFT,
            dead: false,
            speed: 1.8,
        },
    ])

    enemiesToSpawn--
    if(enemiesToSpawn == 0){
        return;    
    }

    wait(rand(0.2, 1.2), spawnEnemy);
}

//kaboom methods

k.onUpdate(() => {
    laser.obj.angle = player.obj.angle;
    laser.obj.pos = player.obj.pos;
    healthBar.obj.width = player.obj.health*8;
})
 
k.onKeyDown("a", () => {
    let speed = 150
    player.obj.angle -= speed * dt();
});

k.onKeyDown("d", () => {
    let speed = 150
    player.obj.angle += speed * dt();
});

k.onKeyDown("w", () => {
    const angleInRadians = player.obj.angle * Math.PI / 180; // convert to radians
    const dx = Math.cos(angleInRadians) * player.obj.speed * dt();  // calculate delta x
    const dy = Math.sin(angleInRadians) * player.obj.speed * dt();  // calculate delta y
    player.obj.move(dx, dy);
});

k.onKeyDown("s", () => {
    const angleInRadians = player.obj.angle * Math.PI / 180; // convert to radians
    const dx = Math.cos(angleInRadians) * player.obj.speed *0.4 * dt();  // calculate delta x
    const dy = Math.sin(angleInRadians) * player.obj.speed *0.4 * dt();  // calculate delta y
    player.obj.move(-dx, -dy);
});


k.onUpdate("bullet", (bullet) => {
    const angleInRadians = bullet.angle * Math.PI / 180; 
	bullet.move(Math.cos(angleInRadians)*bullet.speed, Math.sin(angleInRadians)*bullet.speed)



    if (bullet.pos.x < 0 || bullet.pos.x > width() || bullet.pos.y < 0 || bullet.pos.y > height()) {
        destroy(bullet)
    }
})

k.onCollide("enemy", "bullet", (enemy, bullet) => {
    enemiesKilled++
    score += 3
    add([
        rect(40, 40), 
        pos(enemy.pos), 
        color(0, 255, 0),
        area(),
        "bonus",
    ])
    if(enemiesKilled == enemiesToKill){
        document.cookie = score.toString()
        console.log('u win hihihaha: ' + score)
    }
    addKaboom(enemy.pos)
    destroy(enemy)
    destroy(bullet)
})

k.onCollide("bonus", "player", (bonus, player) => {
    score += 2
    player.ammo++;
    ammoBar.updateAmmoBar(player.ammo)
    destroy(bonus)
})

k.onCollideUpdate("enemy", "player", (enemy, player) => {
    if(!player.isInvincible){
        player.health -= 1;
        makePlayerInvincible()
    }
    if(player.health <= 0){
        healthBar.obj.width = 0
        healthBar.obj.health = 0
        deathMessage.obj.text = "You DIED!"
    }
})

k.onUpdate("enemy", (enemy) => {

	const dx = player.obj.pos.x - enemy.pos.x;
    const dy = player.obj.pos.y - enemy.pos.y;
    const angle = Math.atan2(dy, dx);
  
    const speedX = enemy.speed * Math.cos(angle);
    const speedY = enemy.speed * Math.sin(angle);

    const angleToPlayer = player.obj.pos.angle(enemy.pos);
    enemy.angle = angleToPlayer;
    
    enemy.pos.x += speedX;
    enemy.pos.y += speedY;
})

k.onKeyPress("space", () => {
    player.shoot();
});

//others
spawnEnemy()

