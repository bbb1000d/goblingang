const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const panels = {
  menu: document.getElementById("menu"),
  instructions: document.getElementById("instructions"),
  shop: document.getElementById("shop"),
  gameover: document.getElementById("gameover"),
};

const hudHearts = document.getElementById("hud-hearts");
const hudCoins = document.getElementById("hud-coins");
const hudLevel = document.getElementById("hud-level");
const finalScoreEl = document.getElementById("final-score");
const shopStatus = document.getElementById("shop-status");

const startBtn = document.getElementById("start-btn");
const instructionsBtn = document.getElementById("instructions-btn");
const instructionBackBtns = document.querySelectorAll(".back-btn");
const retryBtn = document.getElementById("retry-btn");
const shopContinueBtn = document.getElementById("shop-continue");
const shopOptionBtns = document.querySelectorAll("#shop [data-upgrade]");

const gravity = 0.4;

const levelData = [
  {
    name: "Forest Edge",
    platforms: [
      { x: 0, y: 460, w: 800, h: 80, type: "ground" },
      { x: 820, y: 420, w: 200, h: 40, type: "ground" },
      { x: 1100, y: 380, w: 160, h: 40, type: "ground" },
      { x: 1320, y: 330, w: 140, h: 40, type: "ground" },
      { x: 1500, y: 460, w: 400, h: 80, type: "ground" },
      { x: 1900, y: 420, w: 160, h: 40, type: "ground" },
      { x: 2100, y: 400, w: 160, h: 40, type: "ground" },
    ],
    spikes: [
      { x: 600, y: 430, w: 80, h: 30 },
      { x: 1750, y: 430, w: 80, h: 30 },
    ],
    coins: [
      { x: 200, y: 380 },
      { x: 880, y: 360 },
      { x: 1340, y: 280 },
      { x: 1520, y: 420 },
      { x: 2100, y: 350 },
    ],
    enemies: [
      { type: "melee", x: 400, y: 410, range: [350, 650] },
      { type: "melee", x: 1700, y: 410, range: [1650, 1850] },
      { type: "ranged", x: 2050, y: 360 },
    ],
    portal: { x: 2300, y: 390, w: 60, h: 70 },
  },
  {
    name: "Crystal Cavern",
    platforms: [
      { x: 0, y: 460, w: 600, h: 80, type: "ground" },
      { x: 650, y: 400, w: 200, h: 40, type: "ground" },
      { x: 900, y: 340, w: 160, h: 40, type: "ground" },
      { x: 1150, y: 300, w: 160, h: 40, type: "ground" },
      { x: 1400, y: 260, w: 160, h: 40, type: "ground" },
      { x: 1650, y: 320, w: 260, h: 40, type: "ground" },
      { x: 1950, y: 380, w: 300, h: 40, type: "ground" },
      { x: 2300, y: 460, w: 320, h: 80, type: "ground" },
    ],
    spikes: [
      { x: 500, y: 430, w: 100, h: 30 },
      { x: 1200, y: 330, w: 80, h: 30 },
      { x: 1800, y: 350, w: 80, h: 30 },
    ],
    coins: [
      { x: 700, y: 350 },
      { x: 940, y: 300 },
      { x: 1180, y: 260 },
      { x: 1690, y: 270 },
      { x: 2350, y: 420 },
    ],
    enemies: [
      { type: "melee", x: 520, y: 410, range: [500, 760] },
      { type: "ranged", x: 1000, y: 320 },
      { type: "ranged", x: 1850, y: 300 },
      { type: "melee", x: 2250, y: 410, range: [2230, 2470] },
    ],
    portal: { x: 2550, y: 390, w: 60, h: 70 },
  },
  {
    name: "Citadel Core",
    platforms: [
      { x: 0, y: 460, w: 500, h: 80, type: "ground" },
      { x: 520, y: 380, w: 200, h: 40, type: "ground" },
      { x: 800, y: 320, w: 160, h: 40, type: "ground" },
      { x: 1100, y: 300, w: 160, h: 40, type: "ground" },
      { x: 1400, y: 340, w: 160, h: 40, type: "ground" },
      { x: 1700, y: 380, w: 200, h: 40, type: "ground" },
      { x: 2000, y: 320, w: 200, h: 40, type: "ground" },
      { x: 2300, y: 260, w: 200, h: 40, type: "ground" },
      { x: 2600, y: 460, w: 400, h: 80, type: "ground" },
    ],
    spikes: [
      { x: 600, y: 430, w: 80, h: 30 },
      { x: 900, y: 290, w: 80, h: 30 },
      { x: 1500, y: 310, w: 80, h: 30 },
    ],
    coins: [
      { x: 560, y: 340 },
      { x: 880, y: 270 },
      { x: 1150, y: 260 },
      { x: 2050, y: 280 },
      { x: 2450, y: 220 },
    ],
    enemies: [
      { type: "melee", x: 700, y: 410, range: [620, 820] },
      { type: "ranged", x: 1320, y: 320 },
      { type: "melee", x: 1900, y: 370, range: [1840, 2080] },
    ],
    boss: { x: 2800, y: 380 },
    portal: null, // final level uses boss defeat to win
  },
];

// Utility functions -------------------------------------------------------
function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Input management -------------------------------------------------------
class Input {
  constructor() {
    this.keys = {};
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      if (["ArrowUp", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
  }

  get left() {
    return this.keys["ArrowLeft"] || this.keys["KeyA"];
  }
  get right() {
    return this.keys["ArrowRight"] || this.keys["KeyD"];
  }
  get jump() {
    return this.keys["ArrowUp"] || this.keys["KeyW"] || this.keys["Space"];
  }
  get attack() {
    return this.keys["KeyJ"] || this.keys["KeyK"];
  }
  get restart() {
    return this.keys["KeyR"];
  }
}

// Entities ---------------------------------------------------------------
class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 60;
    this.y = 380;
    this.w = 32;
    this.h = 48;
    this.vx = 0;
    this.vy = 0;
    this.speed = 3;
    this.jumpForce = 9;
    this.color = "#63b1ff";
    this.onGround = false;
    this.doubleJump = true;
    this.jumpsRemaining = 2;
    this.attackCooldown = 0;
    this.attackTimer = 0;
    this.maxHealth = 3;
    this.health = this.maxHealth;
    this.damage = 1;
    this.coins = 0;
    this.totalCoins = 0;
  }

  applyUpgrades(upgrades) {
    this.maxHealth = upgrades.maxHealth;
    this.health = Math.min(this.health + 1, this.maxHealth);
    this.damageMultiplier = upgrades.damageMultiplier;
    this.speedMultiplier = upgrades.speedMultiplier;
  }

  update(input, level, projectiles) {
    const desiredSpeed = this.speed * (this.speedMultiplier || 1);

    if (input.left) {
      this.vx = -desiredSpeed;
    } else if (input.right) {
      this.vx = desiredSpeed;
    } else {
      this.vx = 0;
    }

    if (input.jump && this.canJump) {
      this.vy = -this.jumpForce;
      this.onGround = false;
      this.jumpsRemaining--;
      this.jumpBuffer = 10;
    }

    if (!input.jump) {
      this.canJump = this.jumpsRemaining > 0;
    } else if (this.jumpBuffer > 0) {
      this.jumpBuffer--;
    }

    this.vy += gravity;
    this.vy = Math.min(this.vy, 12);

    this.x += this.vx;
    this.handleCollisions(level.platforms, "x");
    this.y += this.vy;
    this.handleCollisions(level.platforms, "y");

    // Attack logic
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.attackTimer > 0) this.attackTimer--;
    if (input.attack && this.attackCooldown === 0) {
      this.attackCooldown = 25;
      this.attackTimer = 10;
    }

    // Collect coins
    level.coins = level.coins.filter((coin) => {
      const coinRect = { x: coin.x, y: coin.y, w: 20, h: 20 };
      if (rectsOverlap(this.bounds(), coinRect)) {
        this.coins += 1;
        this.totalCoins += 1;
        return false;
      }
      return true;
    });

    // Spike damage
    for (const spike of level.spikes) {
      if (rectsOverlap(this.bounds(), spike)) {
        this.takeDamage(1);
      }
    }

    // Portal detection (non boss level)
    if (level.portal && rectsOverlap(this.bounds(), level.portal)) {
      advanceToNextLevel();
    }
  }

  handleCollisions(platforms, axis) {
    this.onGround = false;
    for (const platform of platforms) {
      if (!rectsOverlap(this.bounds(), platform)) continue;

      if (axis === "x") {
        if (this.vx > 0) this.x = platform.x - this.w;
        else if (this.vx < 0) this.x = platform.x + platform.w;
        this.vx = 0;
      } else {
        if (this.vy > 0) {
          this.y = platform.y - this.h;
          this.vy = 0;
          this.onGround = true;
          this.jumpsRemaining = 2;
          this.canJump = true;
        } else if (this.vy < 0) {
          this.y = platform.y + platform.h;
          this.vy = 0;
        }
      }
    }
  }

  bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  attackRect() {
    if (this.attackTimer <= 0) return null;
    const facing = this.vx >= 0 ? 1 : -1;
    return {
      x: this.x + (facing === 1 ? this.w : -30),
      y: this.y + 10,
      w: 30,
      h: 24,
    };
  }

  takeDamage(amount) {
    if (this.invuln && this.invuln > 0) return;
    this.health -= amount;
    this.invuln = 40;
    if (this.health <= 0) {
      triggerGameOver();
    }
  }

  draw(offsetX) {
    ctx.fillStyle = this.invuln && this.invuln % 10 < 5 ? "#fff" : this.color;
    ctx.fillRect(this.x - offsetX, this.y, this.w, this.h);
    ctx.fillStyle = "#2f7fff";
    ctx.fillRect(this.x - offsetX + 6, this.y + 10, 8, 8);
    if (this.attackTimer > 0) {
      const atk = this.attackRect();
      if (atk) {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(atk.x - offsetX, atk.y, atk.w, atk.h);
      }
    }
    if (this.invuln > 0) this.invuln--;
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 40;
    this.health = 2;
    this.dead = false;
  }

  bounds() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) this.dead = true;
  }

  draw(offsetX, color = "#ff6262") {
    ctx.fillStyle = color;
    ctx.fillRect(this.x - offsetX, this.y, this.w, this.h);
  }
}

class MeleeEnemy extends Enemy {
  constructor(x, y, range) {
    super(x, y);
    this.range = range;
    this.speed = 1.2;
    this.direction = 1;
  }

  update(level) {
    this.x += this.speed * this.direction;
    if (this.x < this.range[0] || this.x + this.w > this.range[1]) {
      this.direction *= -1;
    }
  }

  draw(offsetX) {
    super.draw(offsetX, "#f05a4f");
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x - offsetX + 10, this.y + 10, 4, 4);
  }
}

class RangedEnemy extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.timer = 0;
    this.cooldown = 120;
  }

  update(level, projectiles) {
    this.timer++;
    if (this.timer >= this.cooldown) {
      this.timer = 0;
      projectiles.push(
        new Projectile(this.x + this.w / 2, this.y + this.h / 2, 4, 0)
      );
    }
  }

  draw(offsetX) {
    super.draw(offsetX, "#f9c74f");
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x - offsetX + 12, this.y + 8, 6, 12);
  }
}

class Boss extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.w = 48;
    this.h = 60;
    this.health = 12;
    this.speed = 2;
    this.timer = 0;
  }

  update(level, projectiles, player) {
    // Simple chase movement
    const dir = Math.sign(player.x - this.x);
    this.x += dir * this.speed;
    this.timer++;
    if (this.timer % 90 === 0) {
      // radial shot
      for (let angle = -0.6; angle <= 0.6; angle += 0.3) {
        const speed = 5;
        const vx = speed * Math.cos(angle) * dir;
        const vy = speed * Math.sin(angle);
        projectiles.push(new Projectile(this.x + this.w / 2, this.y + 20, vx, vy));
      }
    }
    if (this.timer % 150 === 0) {
      this.vy = -8;
    }
    this.vy = (this.vy || 0) + gravity;
    this.y += this.vy;

    // Keep boss on platforms
    for (const platform of level.platforms) {
      if (!rectsOverlap(this.bounds(), platform)) continue;
      if (this.vy > 0) {
        this.y = platform.y - this.h;
        this.vy = 0;
      }
    }
  }

  draw(offsetX) {
    super.draw(offsetX, "#ff4f87");
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.x - offsetX + 10, this.y + 10, 10, 10);
  }
}

class Projectile {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.w = 10;
    this.h = 10;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(offsetX) {
    ctx.fillStyle = "#ffef5c";
    ctx.fillRect(this.x - offsetX, this.y, this.w, this.h);
  }
}

// Game state ------------------------------------------------------------
const input = new Input();
const player = new Player();
let currentLevelIndex = 0;
let currentLevel = null;
let enemies = [];
let projectiles = [];
let state = "menu"; // menu, playing, shop, gameover, instructions
let upgrades = {
  maxHealth: 3,
  damageMultiplier: 1,
  speedMultiplier: 1,
};

function loadLevel(index) {
  const rawLevel = levelData[index];
  // Deep copy of arrays so we can mutate coins/enemies
  currentLevel = {
    name: rawLevel.name,
    platforms: rawLevel.platforms.map((p) => ({ ...p })),
    spikes: rawLevel.spikes.map((s) => ({ ...s })),
    coins: rawLevel.coins.map((c) => ({ ...c })),
    portal: rawLevel.portal ? { ...rawLevel.portal } : null,
    boss: rawLevel.boss ? { ...rawLevel.boss } : null,
  };
  enemies = rawLevel.enemies.map((enemy) => {
    if (enemy.type === "melee") {
      return new MeleeEnemy(enemy.x, enemy.y, enemy.range);
    }
    if (enemy.type === "ranged") {
      return new RangedEnemy(enemy.x, enemy.y);
    }
  });
  if (rawLevel.boss) {
    enemies.push(new Boss(rawLevel.boss.x, rawLevel.boss.y));
  }
  projectiles = [];
  player.x = 40;
  player.y = 380;
  player.vx = 0;
  player.vy = 0;
  player.jumpsRemaining = 2;
  player.health = Math.min(player.health + 1, player.maxHealth);
}

function updateHUD() {
  hudHearts.textContent = "".padStart(player.health, "♥") + "".padStart(player.maxHealth - player.health, "·");
  hudCoins.textContent = `Coins: ${player.coins}`;
  hudLevel.textContent = `Level ${currentLevelIndex + 1} - ${currentLevel.name}`;
}

function advanceToNextLevel() {
  if (currentLevelIndex < levelData.length - 1) {
    currentLevelIndex++;
    state = "shop";
    showPanel("shop");
    shopStatus.textContent = "";
  } else {
    finalScoreEl.textContent = `Victory! Total coins: ${player.totalCoins}`;
    showPanel("gameover");
    state = "gameover";
  }
}

function showPanel(name) {
  Object.values(panels).forEach((panel) => panel.classList.remove("visible"));
  if (name && panels[name]) {
    panels[name].classList.add("visible");
  }
}

function hidePanels() {
  Object.values(panels).forEach((panel) => panel.classList.remove("visible"));
}

function triggerGameOver() {
  state = "gameover";
  finalScoreEl.textContent = `You collected ${player.totalCoins} coins.`;
  showPanel("gameover");
}

function restartLevel() {
  loadLevel(currentLevelIndex);
}

// Panel button wiring ---------------------------------------------------
startBtn.addEventListener("click", () => {
  hidePanels();
  startGame();
});

instructionsBtn.addEventListener("click", () => {
  showPanel("instructions");
  state = "instructions";
});

instructionBackBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    showPanel("menu");
    state = "menu";
  })
);

retryBtn.addEventListener("click", () => {
  player.reset();
  upgrades = { maxHealth: 3, damageMultiplier: 1, speedMultiplier: 1 };
  currentLevelIndex = 0;
  loadLevel(currentLevelIndex);
  hidePanels();
  state = "playing";
});

shopContinueBtn.addEventListener("click", () => {
  hidePanels();
  loadLevel(currentLevelIndex);
  state = "playing";
});

shopOptionBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    const type = btn.dataset.upgrade;
    const costs = { health: 20, attack: 25, speed: 15 };
    if (player.coins < costs[type]) {
      shopStatus.textContent = "Not enough coins.";
      return;
    }
    player.coins -= costs[type];
    if (type === "health") {
      upgrades.maxHealth++;
      player.maxHealth = upgrades.maxHealth;
      player.health = player.maxHealth;
    } else if (type === "attack") {
      upgrades.damageMultiplier += 0.2;
      player.damage = player.damage * upgrades.damageMultiplier;
    } else if (type === "speed") {
      upgrades.speedMultiplier += 0.1;
    }
    shopStatus.textContent = `Purchased ${type}!`;
  })
);

function startGame() {
  player.reset();
  upgrades = { maxHealth: 3, damageMultiplier: 1, speedMultiplier: 1 };
  currentLevelIndex = 0;
  loadLevel(currentLevelIndex);
  state = "playing";
}

// Game loop -------------------------------------------------------------
function update() {
  if (state === "playing") {
    player.applyUpgrades(upgrades);
    player.update(input, currentLevel, projectiles);

    if (input.restart) restartLevel();

    enemies.forEach((enemy) => {
      if (enemy.dead) return;
      if (enemy instanceof MeleeEnemy) enemy.update(currentLevel);
      if (enemy instanceof RangedEnemy) enemy.update(currentLevel, projectiles);
      if (enemy instanceof Boss) enemy.update(currentLevel, projectiles, player);

      // Player collision
      if (rectsOverlap(player.bounds(), enemy.bounds())) {
        player.takeDamage(1);
      }
    });

    // Player attack hitting enemies
    const attackRect = player.attackRect();
    if (attackRect) {
      enemies.forEach((enemy) => {
        if (!enemy.dead && rectsOverlap(attackRect, enemy.bounds())) {
          enemy.takeDamage(player.damage * (player.damageMultiplier || 1));
        }
      });
    }

    enemies = enemies.filter((enemy) => !enemy.dead);

    projectiles.forEach((proj) => proj.update());
    projectiles = projectiles.filter((proj) => {
      if (
        proj.x < 0 ||
        proj.x > 9999 ||
        proj.y < 0 ||
        proj.y > canvas.height + 200
      )
        return false;
      if (rectsOverlap(player.bounds(), { x: proj.x, y: proj.y, w: proj.w, h: proj.h })) {
        player.takeDamage(1);
        return false;
      }
      return true;
    });

    // Boss check
    const bossPresent = levelData[currentLevelIndex].boss;
    if (bossPresent) {
      const bossAlive = enemies.some((e) => e instanceof Boss);
      if (!bossAlive) {
        finalScoreEl.textContent = `You defeated the Overseer! Coins: ${player.totalCoins}`;
        showPanel("gameover");
        state = "gameover";
      }
    }

    updateHUD();
  }
}

function renderBackground(offsetX) {
  ctx.fillStyle = "#1b2538";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0f1727";
  for (let i = 0; i < 20; i++) {
    const x = (i * 200 - offsetX * 0.3) % (canvas.width + 200);
    ctx.fillRect(x, 60 + ((i * 37) % 120), 120, 20);
  }
}

function render() {
  if (!currentLevel) {
    requestAnimationFrame(render);
    return;
  }
  const offsetX = clamp(player.x - canvas.width / 2, 0, 4000);
  renderBackground(offsetX);

  // Platforms
  ctx.fillStyle = "#3c516d";
  currentLevel.platforms.forEach((plat) => {
    ctx.fillRect(plat.x - offsetX, plat.y, plat.w, plat.h);
  });

  // Spikes
  ctx.fillStyle = "#f94144";
  currentLevel.spikes.forEach((spike) => {
    ctx.beginPath();
    const triangles = spike.w / 20;
    for (let i = 0; i < triangles; i++) {
      const x = spike.x + i * 20 - offsetX;
      ctx.moveTo(x, spike.y + spike.h);
      ctx.lineTo(x + 10, spike.y);
      ctx.lineTo(x + 20, spike.y + spike.h);
    }
    ctx.fill();
  });

  // Coins
  currentLevel.coins.forEach((coin) => {
    ctx.fillStyle = "#ffe066";
    ctx.beginPath();
    ctx.arc(coin.x - offsetX + 10, coin.y + 10, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // Portal
  if (currentLevel.portal) {
    ctx.fillStyle = "#7bffda";
    ctx.fillRect(currentLevel.portal.x - offsetX, currentLevel.portal.y, currentLevel.portal.w, currentLevel.portal.h);
  }

  enemies.forEach((enemy) => enemy.draw(offsetX));
  projectiles.forEach((proj) => proj.draw(offsetX));
  player.draw(offsetX);

  if (state === "menu" || state === "instructions" || state === "shop" || state === "gameover") {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(render);
}

function loop() {
  update();
  requestAnimationFrame(loop);
}

render();
loop();

// Persistence -----------------------------------------------------------
// No backend is used to keep the project simple and runnable as static files.
// Progress is stored in localStorage for future improvements if desired.
