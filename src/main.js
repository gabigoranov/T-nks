import kaboom from "kaboom";


//kaboom init
kaboom();
setBackground(155, 200, 155);

loadSprite("player", "sprites/player.png");
loadSprite("bullet", "sprites/bullet.png");

//properties
let maxAmmo = 30;
let ammo = maxAmmo;
let enemiesToSpawn = maxAmmo-10;
const enemiesToKill = enemiesToSpawn;
let enemiesKilled = 0;

let score = 0;
if(document.cookie != null){
    score = parseInt(document.cookie)
    console.log(document.cookie)
}

//kaboom objects
const player = add([
    sprite("player"),
	scale(1),
	anchor("center"),
    pos(100, 200),
    area(),
    body(),
	rotate(0),
    "player",
    {
        dir: LEFT,
        dead: false,
        speed: 24000,
        health: 20,
        isInvincible: false,
    },
])


const laser = add([
    rect(10000, 2), // Adjust size as needed
    pos(player.pos.x, player.pos.y), // Start at player's position
    color(255, 0, 0), // Red color (customize as desired)
]);

const ammoBar = add([
    rect(ammo * 10, 10), 
    pos(100, 20), 
    color(1, 0, 0),
]);

const healthBar = add([
    rect(player.health*8, 30), 
    pos(100, 50), 
    color(0, 200, 0),
]);

const deathMessage = add([
    text(""), 
    pos(100, 50), 
    color(200, 0, 0),
]);

const highscoreText = add([
    text("Highscore: " + score),
    pos(1000, 20), // Centered position
    color(0, 0, 0),
    scale(1), // Adjust size as needed
]);

//functions

function showOutOfAmmoPopup() {
    const popup = add([
        text("Out of Ammo!"),
        pos(100 , 20), // Centered position
        color(255, 0, 0),
        scale(1), // Adjust size as needed
        lifespan(1), // Show for 2 seconds
    ]);

    laser.width = 0;
    laser.height = 0;
}


function updateAmmoBar(ammoCount) {
    ammoBar.width = ammoCount * 10; // Adjust the multiplier as needed
}

function shoot() {
    if(ammo == 0){
        showOutOfAmmoPopup();
        return;
    }
    const bullet = add([
        sprite("bullet"),
        pos(player.pos.x, player.pos.y),
		scale(0.3),
        rotate(player.angle),
        area(),
        anchor("center"),
        {
            speed: 1000,
        },
        "bullet"
    ]);

    ammo -= 1
    updateAmmoBar(ammo)
}

function makePlayerInvincible() {
    player.isInvincible = true; 
    wait(0.3, () => {
        player.isInvincible = false; 
    });
}

function spawnEnemy(){
    enemyX = rand(width());
    enemyY = rand(height());
    const playerDistance = Math.sqrt((player.pos.x - enemyX) ** 2 + (player.pos.y - enemyY) ** 2);
    if(playerDistance < 500) {
        // Recalculate position
        enemyX = rand(width());
        enemyY = rand(height());
    }

    add([
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

onUpdate(() => {
    laser.angle = player.angle;
    laser.pos = player.pos;
    healthBar.width = player.health*8;
})
 
onKeyDown("a", () => {
    let speed = 150
    player.angle -= speed * dt();
});

onKeyDown("d", () => {
    let speed = 150
    player.angle += speed * dt();
});

onKeyDown("w", () => {
    const angleInRadians = player.angle * Math.PI / 180; // convert to radians
    const dx = Math.cos(angleInRadians) * player.speed * dt();  // calculate delta x
    const dy = Math.sin(angleInRadians) * player.speed * dt();  // calculate delta y
    player.move(dx, dy);
});

onKeyDown("s", () => {
    const angleInRadians = player.angle * Math.PI / 180; // convert to radians
    const dx = Math.cos(angleInRadians) * player.speed *0.4 * dt();  // calculate delta x
    const dy = Math.sin(angleInRadians) * player.speed *0.4 * dt();  // calculate delta y
    player.move(-dx, -dy);
});


onUpdate("bullet", (bullet) => {
    const angleInRadians = bullet.angle * Math.PI / 180; 
	bullet.move(Math.cos(angleInRadians)*bullet.speed, Math.sin(angleInRadians)*bullet.speed)



    if (bullet.pos.x < 0 || bullet.pos.x > width() || bullet.pos.y < 0 || bullet.pos.y > height()) {
        destroy(bullet)
    }
})

onCollide("enemy", "bullet", (enemy, bullet) => {
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

onCollide("bonus", "player", (bonus, player) => {
    score += 2
    ammo++
    updateAmmoBar(ammo)
    destroy(bonus)
})

onCollideUpdate("enemy", "player", (enemy, player) => {
    if(!player.isInvincible){
        player.health -= 1;
        makePlayerInvincible()
    }
    if(player.health <= 0){
        healthBar.width = 0
        healthBar.health = 0
        deathMessage.text = "You DIED!"
    }
})

onUpdate("enemy", (enemy) => {

	const dx = player.pos.x - enemy.pos.x;
    const dy = player.pos.y - enemy.pos.y;
    const angle = Math.atan2(dy, dx);
  
    const speedX = enemy.speed * Math.cos(angle);
    const speedY = enemy.speed * Math.sin(angle);

    const angleToPlayer = player.pos.angle(enemy.pos);
    enemy.angle = angleToPlayer;
    
    enemy.pos.x += speedX;
    enemy.pos.y += speedY;
})

onKeyPress("space", () => {
    shoot();
});

//others
spawnEnemy()

