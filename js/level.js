/* ============================================================
   level.js — Level System
   Defines platform layouts, enemy spawns, backgrounds.
   Easily expandable: just add new level configs.
   ============================================================ */

const LEVELS = [
  // ======== LEVEL 1: The Ruined Gateway ========
  {
    name: 'The Ruined Gateway',
    number: 1,
    width: 3200,
    height: 600,
    bgColor: '#1a1020',
    bgType: 'ruins',
    spawnX: 100,
    spawnY: 400,
    platforms: [
      // Continuous ground
      { x: 0,     y: 536, width: 3200, height: 64 },
      // Floating platforms
      { x: 400,   y: 400, width: 180,  height: 20 },
      { x: 750,   y: 350, width: 160,  height: 20 },
      { x: 1100,  y: 380, width: 200,  height: 20 },
      { x: 1600,  y: 320, width: 180,  height: 20 },
      { x: 2000,  y: 380, width: 180,  height: 20 },
      { x: 2400,  y: 340, width: 200,  height: 20 },
    ],
    enemies: [
      { type: 'grunt', x: 600,  y: 470, patrolMin: 500,  patrolMax: 780 },
      { type: 'grunt', x: 1100, y: 470, patrolMin: 900,  patrolMax: 1400 },
      { type: 'grunt', x: 2000, y: 470, patrolMin: 1600, patrolMax: 2400 },
    ],
    bgImage: 'assets/images/background.jpg',
    music: 'battle',
  },

  // ======== LEVEL 2: The Dark Forest ========
  {
    name: 'The Dark Forest',
    number: 2,
    width: 3600,
    height: 600,
    bgColor: '#0a1a0a',
    bgType: 'forest',
    bgImage: 'assets/images/bg_user.png',   // user's custom background
    spawnX: 100,
    spawnY: 400,
    platforms: [
      // Continuous ground (no death pits)
      { x: 0,     y: 536, width: 3600, height: 64 },
      // Floating platforms
      { x: 350,   y: 420, width: 150,  height: 20 },
      { x: 650,   y: 360, width: 150,  height: 20 },
      { x: 1050,  y: 400, width: 140,  height: 20 },
      { x: 1350,  y: 320, width: 160,  height: 20 },
      { x: 1750,  y: 380, width: 160,  height: 20 },
      { x: 2100,  y: 350, width: 150,  height: 20 },
      { x: 2600,  y: 300, width: 180,  height: 20 },
      { x: 2900,  y: 380, width: 150,  height: 20 },
    ],
    enemies: [
      { type: 'grunt',   x: 500,  y: 470, patrolMin: 100,  patrolMax: 580 },
      { type: 'soldier', x: 900,  y: 470, patrolMin: 720,  patrolMax: 1100 },
      { type: 'grunt',   x: 1500, y: 470, patrolMin: 1220, patrolMax: 1680 },
      { type: 'soldier', x: 2100, y: 470, patrolMin: 1820, patrolMax: 2280 },
      { type: 'grunt',   x: 2700, y: 470, patrolMin: 2320, patrolMax: 3100 },
    ],
    bgImage: 'assets/images/background.jpg',
    music: 'battle',
  },

  // ======== LEVEL 3: The Mountain Pass ========
  {
    name: 'The Mountain Pass',
    number: 3,
    width: 4000,
    height: 600,
    bgColor: '#101520',
    bgType: 'mountains',
    isFinalLevel: true,   // beating this = game complete!
    spawnX: 100,
    spawnY: 400,
    platforms: [
      // Elevated terrain — start low, climb
      { x: 0,     y: 536, width: 500,  height: 64 },
      { x: 550,   y: 460, width: 300,  height: 20 },   // step up
      { x: 900,   y: 400, width: 300,  height: 20 },
      { x: 1250,  y: 340, width: 250,  height: 20 },
      { x: 1550,  y: 300, width: 300,  height: 20 },
      { x: 1900,  y: 340, width: 250,  height: 20 },
      { x: 2200,  y: 400, width: 300,  height: 20 },
      { x: 2550,  y: 460, width: 300,  height: 20 },
      { x: 2900,  y: 536, width: 1100, height: 64 },
      // Extra platforms
      { x: 700,   y: 500, width: 120,  height: 20 },
      { x: 1050,  y: 440, width: 130,  height: 20 },
      { x: 1750,  y: 380, width: 120,  height: 20 },
      { x: 2400,  y: 440, width: 120,  height: 20 },
    ],
    enemies: [
      { type: 'soldier', x: 400,  y: 470, patrolMin: 100,  patrolMax: 480 },
      { type: 'soldier', x: 1000, y: 330, patrolMin: 920,  patrolMax: 1180 },
      { type: 'brute',   x: 1350, y: 270, patrolMin: 1270, patrolMax: 1530 },
      { type: 'soldier', x: 1700, y: 230, patrolMin: 1570, patrolMax: 1830 },
      { type: 'brute',   x: 2100, y: 330, patrolMin: 1920, patrolMax: 2180 },
      { type: 'soldier', x: 2600, y: 390, patrolMin: 2400, patrolMax: 2780 },
      { type: 'grunt',   x: 3200, y: 470, patrolMin: 2920, patrolMax: 3500 },
    ],
    bgImage: 'assets/images/background.jpg',
    music: 'battle',
  },

  // ======== LEVEL 4: The Forgotten Crypt ========
  {
    name: 'The Forgotten Crypt',
    number: 4,
    width: 4200,
    height: 600,
    bgColor: '#0a0a12',
    bgType: 'crypt',
    spawnX: 100,
    spawnY: 400,
    platforms: [
      // Complex layout: descending/ascending sections
      { x: 0,     y: 536, width: 400,  height: 64 },
      { x: 450,   y: 480, width: 250,  height: 20 },
      { x: 750,   y: 420, width: 200,  height: 20 },
      { x: 1000,  y: 360, width: 200,  height: 20 },
      { x: 1250,  y: 320, width: 350,  height: 20 },
      { x: 1650,  y: 360, width: 200,  height: 20 },
      { x: 1900,  y: 420, width: 200,  height: 20 },
      { x: 2150,  y: 480, width: 300,  height: 20 },
      { x: 2500,  y: 536, width: 600,  height: 64 },
      { x: 3150,  y: 480, width: 250,  height: 20 },
      { x: 3450,  y: 420, width: 200,  height: 20 },
      { x: 3700,  y: 360, width: 500,  height: 20 },
      // Ground pits
      { x: 415,   y: 536, width: 30,   height: 64 },   // Small platform between
      { x: 720,   y: 536, width: 30,   height: 64 },
      { x: 960,   y: 536, width: 30,   height: 64 },
    ],
    enemies: [
      { type: 'brute',   x: 350,  y: 470, patrolMin: 100,  patrolMax: 380 },
      { type: 'soldier', x: 800,  y: 350, patrolMin: 770,  patrolMax: 980 },
      { type: 'brute',   x: 1100, y: 290, patrolMin: 1020, patrolMax: 1230 },
      { type: 'soldier', x: 1400, y: 250, patrolMin: 1270, patrolMax: 1580 },
      { type: 'brute',   x: 1800, y: 350, patrolMin: 1670, patrolMax: 1830 },
      { type: 'soldier', x: 2200, y: 410, patrolMin: 2000, patrolMax: 2280 },
      { type: 'brute',   x: 2700, y: 470, patrolMin: 2520, patrolMax: 3080 },
      { type: 'soldier', x: 3300, y: 410, patrolMin: 3170, patrolMax: 3430 },
      { type: 'brute',   x: 3600, y: 350, patrolMin: 3470, patrolMax: 3680 },
      { type: 'grunt',   x: 3900, y: 290, patrolMin: 3720, patrolMax: 4180 },
    ],
    bgImage: 'assets/images/background.jpg',
    music: 'battle',
  },

  // ======== LEVEL 5: Throne of the Dark Lord (BOSS) ========
  {
    name: 'Throne of the Dark Lord',
    number: 5,
    width: 2400,
    height: 600,
    bgColor: '#0a000a',
    bgType: 'boss',
    spawnX: 100,
    spawnY: 400,
    platforms: [
      // Arena-style layout
      { x: 0,     y: 536, width: 2400, height: 64 },
      { x: 300,   y: 420, width: 200,  height: 20 },
      { x: 700,   y: 380, width: 200,  height: 20 },
      { x: 1100,  y: 340, width: 200,  height: 20 },
      { x: 1500,  y: 380, width: 200,  height: 20 },
      { x: 1900,  y: 420, width: 200,  height: 20 },
    ],
    enemies: [
      // Minions + Boss
      { type: 'soldier', x: 500,  y: 470, patrolMin: 100,  patrolMax: 700 },
      { type: 'soldier', x: 1500, y: 470, patrolMin: 1300, patrolMax: 1900 },
      { type: 'brute',   x: 900,  y: 470, patrolMin: 800,  patrolMax: 1100 },
      { type: 'boss',    x: 1200, y: 440, patrolMin: 1000, patrolMax: 1800 },
    ],
    bgImage: 'assets/images/background.jpg',
    music: 'battle',
    isBoss: true,
  },
];

/* ============================================================
   Level Manager
   ============================================================ */
class LevelManager {
  constructor() {
    this.currentIndex = 0;
    this.config = null;
    this.platforms = [];
    this.enemies = [];
    this.cameraX = 0;
    this.cameraTargetX = 0;

    // Level-end zone
    this.exitZone = null;
    this.levelComplete = false;
    this.completeTimer = 0;

    // Difficulty multiplier
    this.difficulty = 'normal';  // 'easy' | 'normal' | 'hard'
  }

  setDifficulty(d) {
    this.difficulty = d;
  }

  getDifficultyMultiplier() {
    switch (this.difficulty) {
      case 'easy':   return { hp: 0.7, dmg: 0.6, speed: 0.8 };
      case 'hard':   return { hp: 1.5, dmg: 1.5, speed: 1.2 };
      default:       return { hp: 1.0, dmg: 1.0, speed: 1.0 };
    }
  }

  loadLevel(index) {
    if (index >= LEVELS.length) return false;  // All levels complete

    this.currentIndex = index;
    this.config = JSON.parse(JSON.stringify(LEVELS[index]));  // Deep copy
    this.platforms = this.config.platforms;
    this.levelComplete = false;
    this.completeTimer = 0;
    this.cameraX = 0;
    this.cameraTargetX = 0;

    // Load custom background image if specified
    this.bgImage = null;
    this.bgLoaded = false;
    if (this.config.bgImage) {
      this.bgImage = new Image();
      this.bgImage.onload = () => { this.bgLoaded = true; };
      this.bgImage.onerror = () => { this.bgLoaded = false; };
      this.bgImage.src = this.config.bgImage;
    }

    // Create enemies
    this.enemies = [];
    const mult = this.getDifficultyMultiplier();
    this.config.enemies.forEach(e => {
      const enemy = new Enemy(e.type, e.x, e.y, e.patrolMin, e.patrolMax);
      enemy.maxHealth = Math.round(enemy.maxHealth * mult.hp);
      enemy.health = enemy.maxHealth;
      enemy.damage = Math.round(enemy.damage * mult.dmg);
      enemy.speed = Math.round(enemy.speed * mult.speed);
      this.enemies.push(enemy);
    });

    // Exit zone
    const lastPlat = this.platforms[this.platforms.length - 1];
    this.exitZone = {
      x: this.config.width - 120,
      y: 0,
      width: 100,
      height: this.config.height,
    };

    return true;
  }

  update(dt, player) {
    // Update enemies
    for (const enemy of this.enemies) {
      if (enemy.isAlive()) {
        enemy.update(dt, player);
        // Resolve platform collisions for enemies
        for (const plat of this.platforms) {
          enemy.resolvePlatformCollision(plat);
        }
        // Clamp to ground
        if (enemy.y > 1000) {
          enemy.y = 1000;
          enemy.vy = 0;
        }
      }
    }

    // Check level complete
    if (player.x > this.exitZone.x && !this.levelComplete && this.enemies.every(e => !e.isAlive())) {
      this.levelComplete = true;
      this.completeTimer = 1.5;
    }

    // Level complete timer
    if (this.levelComplete) {
      this.completeTimer -= dt;
    }
  }

  /** Update camera to follow player */
  updateCamera(player, canvasWidth, dt) {
    this.cameraTargetX = player.x - canvasWidth / 3;

    // Clamp camera
    this.cameraTargetX = Math.max(0, Math.min(
      this.cameraTargetX,
      Math.max(0, this.config.width - canvasWidth)
    ));

    // Smooth camera (uses real frame time)
    const lerpFactor = 1 - Math.exp(-8 * dt);
    this.cameraX += (this.cameraTargetX - this.cameraX) * lerpFactor;
  }

  drawBackground(ctx, canvasWidth, canvasHeight) {
    const type = this.config.bgType || 'ruins';

    // If this level has a custom background image, draw it first
    if (this.bgImage && this.bgLoaded && this.bgImage.complete) {
      this._drawImageBg(ctx, canvasWidth, canvasHeight);
    }

    // Then overlay procedural elements on top
    switch (type) {
      case 'ruins':    this._drawRuinsOverlay(ctx, canvasWidth, canvasHeight); break;
      case 'forest':   this._drawForestOverlay(ctx, canvasWidth, canvasHeight); break;
      case 'mountains':this._drawMountainsBg(ctx, canvasWidth, canvasHeight); break;
      case 'crypt':    this._drawCryptBg(ctx, canvasWidth, canvasHeight); break;
      case 'boss':     this._drawBossBg(ctx, canvasWidth, canvasHeight); break;
      default:         this._drawRuinsBg(ctx, canvasWidth, canvasHeight);
    }
  }

  /** Draw the user's custom background image with parallax */
  _drawImageBg(ctx, w, h) {
    const parallax = this.cameraX * 0.25;
    const img = this.bgImage;
    const imgAspect = img.width / img.height;
    const bgHeight = h;
    const bgWidth = bgHeight * imgAspect;

    // Draw tiled with parallax
    for (let x = -(parallax % bgWidth); x < w; x += bgWidth) {
      ctx.drawImage(img, x, 0, bgWidth, bgHeight);
    }
  }

  /** Forest overlay: fog + fireflies over the user's background image */
  _drawForestOverlay(ctx, w, h) {
    // If no custom image, draw full procedural forest
    if (!this.bgImage || !this.bgLoaded) {
      this._drawForestBg(ctx, w, h);
      return;
    }

    const t = Date.now() / 1000;

    // Fog layer over the custom image
    const fogGrad = ctx.createLinearGradient(0, h * 0.6, 0, h * 0.95);
    fogGrad.addColorStop(0, 'rgba(20,30,20,0)');
    fogGrad.addColorStop(0.4, 'rgba(140,170,140,0.06)');
    fogGrad.addColorStop(0.8, 'rgba(100,140,100,0.12)');
    fogGrad.addColorStop(1, 'rgba(80,110,80,0.18)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    // Fireflies
    for (let i = 0; i < 20; i++) {
      const fx = ((Math.sin(t * 0.7 + i * 4.1) * 0.5 + 0.5) * w) - this.cameraX * 0.2;
      const fy = h * 0.25 + Math.cos(t * 0.8 + i * 2.7) * h * 0.3;
      const fa = 0.2 + Math.sin(t * 3 + i * 5) * 0.25;
      const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 6);
      fg.addColorStop(0, `rgba(180,255,140,${fa})`);
      fg.addColorStop(1, 'rgba(180,255,140,0)');
      ctx.fillStyle = fg;
      ctx.fillRect(fx - 8, fy - 8, 16, 16);
    }

    // Subtle light rays
    ctx.fillStyle = 'rgba(200,220,180,0.03)';
    for (let i = 0; i < 4; i++) {
      const rx = i * w * 0.3 + Math.sin(t * 0.3 + i) * 50;
      ctx.beginPath();
      ctx.moveTo(rx, 0);
      ctx.lineTo(rx + 40, h);
      ctx.lineTo(rx - 40, h);
      ctx.closePath();
      ctx.fill();
    }
  }

  /** Ruins overlay: dust + pillars over background */
  _drawRuinsOverlay(ctx, w, h) {
    if (!this.bgImage || !this.bgLoaded) {
      this._drawRuinsBg(ctx, w, h);
      return;
    }

    const t = Date.now() / 1000;
    const px3 = this.cameraX * 0.5;

    // Ruined pillars
    ctx.fillStyle = 'rgba(10,4,18,0.5)';
    for (let i = 0; i < 6; i++) {
      const bx = (i * 600 + 200) - px3;
      if (bx < -80 || bx > w + 80) continue;
      const bw = 16 + Math.sin(i * 3.7) * 6;
      const bh = 120 + Math.sin(i * 1.3) * 50;
      ctx.fillRect(bx, h * 0.72 - bh, bw, bh);
      ctx.fillRect(bx - 4, h * 0.72 - bh, bw + 8, 8 + Math.sin(i * 7) * 4);
      ctx.fillRect(bx - 6, h * 0.72 - 10, bw + 12, 10);
    }

    // Dust particles
    ctx.fillStyle = 'rgba(200,160,100,0.05)';
    for (let i = 0; i < 30; i++) {
      const dx = ((Math.sin(t * 0.3 + i * 2.17) * 0.5 + 0.5) * w) - this.cameraX * 0.15;
      const dy = h * 0.5 + Math.sin(t * 0.5 + i * 3.1) * h * 0.2;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.5 + Math.sin(t + i) * 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ============================================================
     PROCEDURAL BACKGROUND: Ruins (Level 1)
     Golden sunset, ruined pillars, dusty haze
     ============================================================ */
  _drawRuinsBg(ctx, w, h) {
    const t = Date.now() / 1000;
    // Sky gradient: deep purple → orange → gold
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#1a0a2e');
    sky.addColorStop(0.35, '#3d1c4a');
    sky.addColorStop(0.55, '#8b4513');
    sky.addColorStop(0.7, '#d4843a');
    sky.addColorStop(0.85, '#e8b860');
    sky.addColorStop(1, '#3a2010');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Distant mountains (parallax layer 1)
    const px1 = this.cameraX * 0.15;
    ctx.fillStyle = '#2a1035';
    this._drawMountainRange(ctx, px1, h * 0.65, w, h, 5, 120, 200);

    // Midground hills (parallax layer 2)
    const px2 = this.cameraX * 0.3;
    ctx.fillStyle = '#1a0a20';
    this._drawMountainRange(ctx, px2, h * 0.72, w, h, 7, 60, 140);

    // Ruined pillars (parallax layer 3)
    const px3 = this.cameraX * 0.5;
    ctx.fillStyle = '#0d0412';
    for (let i = 0; i < 8; i++) {
      const bx = (i * 500 + 150) - px3;
      if (bx < -80 || bx > w + 80) continue;
      const bw = 18 + Math.sin(i * 3.7) * 8;
      const bh = 140 + Math.sin(i * 1.3) * 60;
      ctx.fillRect(bx, h * 0.72 - bh, bw, bh);
      // Broken top
      ctx.fillRect(bx - 4, h * 0.72 - bh, bw + 8, 10 + Math.sin(i * 7) * 5);
      // Pillar base
      ctx.fillRect(bx - 6, h * 0.72 - 12, bw + 12, 12);
    }

    // Dust particles
    ctx.fillStyle = 'rgba(200,160,100,0.06)';
    for (let i = 0; i < 40; i++) {
      const dx = ((Math.sin(t * 0.3 + i * 2.17) * 0.5 + 0.5) * w) - this.cameraX * 0.2;
      const dy = h * 0.5 + Math.sin(t * 0.5 + i * 3.1) * h * 0.2;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.5 + Math.sin(t + i) * 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sun glow
    const sunX = w * 0.7;
    const sunY = h * 0.4;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 180);
    sunGrad.addColorStop(0, 'rgba(255,240,200,0.5)');
    sunGrad.addColorStop(0.4, 'rgba(255,180,80,0.15)');
    sunGrad.addColorStop(1, 'rgba(255,100,20,0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);
  }

  /* ============================================================
     PROCEDURAL BACKGROUND: Dark Forest (Level 2)
     Deep green canopy, tree trunks, fog, fireflies
     ============================================================ */
  _drawForestBg(ctx, w, h) {
    const t = Date.now() / 1000;
    // Sky: dark teal → black-green
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#020508');
    sky.addColorStop(0.3, '#061210');
    sky.addColorStop(0.55, '#0a2418');
    sky.addColorStop(0.75, '#0d2a1a');
    sky.addColorStop(1, '#061208');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Distant trees (silhouettes, parallax 1)
    const px1 = this.cameraX * 0.15;
    ctx.fillStyle = '#05150c';
    this._drawTreeSilhouettes(ctx, px1, h * 0.6, w, h, 10, 200, 300, 0.7);

    // Midground trees (parallax 2)
    const px2 = this.cameraX * 0.3;
    ctx.fillStyle = '#0a2015';
    this._drawTreeSilhouettes(ctx, px2, h * 0.68, w, h, 14, 160, 260, 0.85);

    // Foreground tree trunks (parallax 3)
    const px3 = this.cameraX * 0.6;
    ctx.fillStyle = '#061208';
    for (let i = 0; i < 6; i++) {
      const tx = (i * 700 + 200) - px3;
      if (tx < -100 || tx > w + 100) continue;
      const tw = 22 + Math.sin(i * 2.3) * 10;
      // Trunk
      ctx.fillRect(tx, h * 0.45, tw, h * 0.55);
      // Branches
      ctx.fillRect(tx - 30, h * 0.48, tw + 60, 6 + Math.sin(i) * 4);
      ctx.fillRect(tx - 20, h * 0.55, tw + 40, 5);
      // Canopy blob
      ctx.beginPath();
      ctx.arc(tx + tw / 2, h * 0.42, 50 + Math.sin(i * 1.7) * 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fog layer
    const fogGrad = ctx.createLinearGradient(0, h * 0.65, 0, h * 0.9);
    fogGrad.addColorStop(0, 'rgba(140,170,140,0)');
    fogGrad.addColorStop(0.5, 'rgba(140,170,140,0.08)');
    fogGrad.addColorStop(1, 'rgba(100,130,100,0.15)');
    ctx.fillStyle = fogGrad;
    ctx.fillRect(0, h * 0.65, w, h * 0.35);

    // Fireflies
    for (let i = 0; i < 25; i++) {
      const fx = ((Math.sin(t * 0.7 + i * 4.1) * 0.5 + 0.5) * w) - this.cameraX * 0.3;
      const fy = h * 0.3 + Math.cos(t * 0.8 + i * 2.7) * h * 0.25;
      const fa = 0.3 + Math.sin(t * 3 + i * 5) * 0.3;
      const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 6);
      fg.addColorStop(0, `rgba(180,255,140,${fa})`);
      fg.addColorStop(1, 'rgba(180,255,140,0)');
      ctx.fillStyle = fg;
      ctx.fillRect(fx - 8, fy - 8, 16, 16);
    }
  }

  /* ============================================================
     PROCEDURAL BACKGROUND: Mountains (Level 3)
     Blue-grey sky, snow-capped peaks, clouds, wind
     ============================================================ */
  _drawMountainsBg(ctx, w, h) {
    const t = Date.now() / 1000;
    // Sky: dark navy → steel blue → pale grey
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0a0e1a');
    sky.addColorStop(0.3, '#162038');
    sky.addColorStop(0.55, '#2a3a5a');
    sky.addColorStop(0.75, '#5a6a8a');
    sky.addColorStop(1, '#2a3040');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Far mountains (parallax 1, snow-capped)
    const px1 = this.cameraX * 0.1;
    ctx.fillStyle = '#1a2840';
    this._drawMountainRange(ctx, px1, h * 0.58, w, h, 6, 150, 280);
    // Snow caps
    ctx.fillStyle = '#e8eef8';
    for (let i = 0; i < 6; i++) {
      const mx = (i * 550 + 100) - px1;
      if (mx < -100 || mx > w + 100) continue;
      const mh = 200 + Math.sin(i * 1.5) * 60;
      ctx.beginPath();
      ctx.moveTo(mx, h * 0.58);
      ctx.lineTo(mx + 130, h * 0.58 - mh);
      ctx.lineTo(mx + 260, h * 0.58);
      ctx.closePath();
      // Snow cap on top 30%
      ctx.save();
      ctx.clip();
      ctx.fillRect(mx, h * 0.58 - mh * 0.3, 260, mh * 0.3);
      ctx.restore();
    }

    // Mid mountains (parallax 2)
    const px2 = this.cameraX * 0.25;
    ctx.fillStyle = '#1a2848';
    this._drawMountainRange(ctx, px2, h * 0.65, w, h, 8, 100, 200);

    // Clouds (drifting)
    ctx.fillStyle = 'rgba(180,200,220,0.15)';
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 600 + 100 + Math.sin(t * 0.2 + i) * 80) % (w + 400)) - 200;
      const cy = h * 0.15 + Math.sin(i * 2.3) * h * 0.12;
      this._drawCloud(ctx, cx, cy, 45 + Math.sin(i) * 20);
    }

    // Wind streaks
    ctx.strokeStyle = 'rgba(200,220,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 15; i++) {
      const sx = ((Math.sin(t * 0.6 + i * 3.7) * 0.5 + 0.5) * w) - this.cameraX * 0.2;
      const sy = h * 0.2 + i * h * 0.04;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 60 + Math.sin(i) * 30, sy + Math.cos(i * 2) * 3);
      ctx.stroke();
    }
  }

  /* ============================================================
     PROCEDURAL BACKGROUND: Crypt (Level 4)
     Deep purple, stone arches, torchlight, crystals
     ============================================================ */
  _drawCryptBg(ctx, w, h) {
    const t = Date.now() / 1000;
    // Deep underground feel
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#050510');
    sky.addColorStop(0.4, '#0a0a1e');
    sky.addColorStop(0.7, '#120a1e');
    sky.addColorStop(1, '#080410');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Stone arches (parallax)
    const px = this.cameraX * 0.4;
    ctx.fillStyle = '#0d0818';
    for (let i = 0; i < 7; i++) {
      const ax = (i * 550 + 80) - px;
      if (ax < -200 || ax > w + 200) continue;
      // Arch pillar left
      ctx.fillRect(ax, h * 0.35, 16, h * 0.65);
      // Arch pillar right
      ctx.fillRect(ax + 180, h * 0.35, 16, h * 0.65);
      // Arch top
      ctx.beginPath();
      ctx.arc(ax + 98, h * 0.35, 98, Math.PI, 0);
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#0d0818';
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // Torches (flickering glow)
    for (let i = 0; i < 5; i++) {
      const tx = (i * 700 + 100) - this.cameraX * 0.4;
      if (tx < -50 || tx > w + 50) continue;
      const ty = h * 0.3;
      const flicker = 0.6 + Math.sin(t * 12 + i * 3) * 0.2 + Math.sin(t * 17 + i * 5) * 0.2;
      const glow = ctx.createRadialGradient(tx, ty, 4, tx, ty, 90);
      glow.addColorStop(0, `rgba(255,160,40,${flicker * 0.35})`);
      glow.addColorStop(0.5, `rgba(255,100,20,${flicker * 0.1})`);
      glow.addColorStop(1, 'rgba(255,60,10,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(tx - 90, ty - 90, 180, 180);
      // Flame
      ctx.fillStyle = `rgba(255,200,60,${flicker * 0.8})`;
      ctx.beginPath();
      ctx.arc(tx, ty, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing crystals on ceiling
    for (let i = 0; i < 12; i++) {
      const cx = ((i * 300 + 50)) - this.cameraX * 0.15;
      if (cx < -20 || cx > w + 20) continue;
      const cy = h * 0.05 + Math.sin(i * 4.1) * h * 0.04;
      const cg = ctx.createRadialGradient(cx, cy, 1, cx, cy, 12);
      cg.addColorStop(0, 'rgba(140,100,255,0.6)');
      cg.addColorStop(1, 'rgba(80,40,180,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(cx - 12, cy - 12, 24, 24);
    }
  }

  /* ============================================================
     PROCEDURAL BACKGROUND: Boss Arena (Level 5)
     Blood-red sky, black spires, lava glow, ash
     ============================================================ */
  _drawBossBg(ctx, w, h) {
    const t = Date.now() / 1000;
    // Sky: black → blood red → dark
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#020002');
    sky.addColorStop(0.3, '#1a0008');
    sky.addColorStop(0.5, '#3d0010');
    sky.addColorStop(0.7, '#1a0008');
    sky.addColorStop(1, '#080008');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Lava glow at bottom
    const lavaGrad = ctx.createLinearGradient(0, h * 0.85, 0, h);
    lavaGrad.addColorStop(0, 'rgba(255,40,10,0)');
    lavaGrad.addColorStop(0.5, 'rgba(255,30,5,0.12)');
    lavaGrad.addColorStop(1, 'rgba(200,20,0,0.25)');
    ctx.fillStyle = lavaGrad;
    ctx.fillRect(0, h * 0.85, w, h * 0.15);

    // Lava cracks
    ctx.strokeStyle = 'rgba(255,80,20,0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const lx = ((i * 500 + 100)) - this.cameraX * 0.3;
      if (lx < 0 || lx > w) continue;
      ctx.beginPath();
      ctx.moveTo(lx, h * 0.92);
      ctx.lineTo(lx + 30, h * 0.95);
      ctx.lineTo(lx + 15, h);
      ctx.stroke();
    }

    // Black spires (parallax)
    const px = this.cameraX * 0.2;
    ctx.fillStyle = '#020008';
    for (let i = 0; i < 5; i++) {
      const sx = (i * 700 + 300) - px;
      if (sx < -120 || sx > w + 120) continue;
      const sh = 200 + Math.sin(i * 2.1) * 80;
      // Spire triangle
      ctx.beginPath();
      ctx.moveTo(sx, h * 0.5);
      ctx.lineTo(sx + 60, h * 0.5);
      ctx.lineTo(sx + 30, h * 0.5 - sh);
      ctx.closePath();
      ctx.fill();
    }

    // Floating embers/ash
    for (let i = 0; i < 20; i++) {
      const ex = ((Math.sin(t * 0.4 + i * 3.7) * 0.5 + 0.5) * w) - this.cameraX * 0.15;
      const ey = h * 0.3 + Math.sin(t * 0.7 + i * 2.1) * h * 0.35;
      const ea = 0.3 + Math.sin(t * 5 + i * 4) * 0.3;
      ctx.fillStyle = `rgba(255,120,30,${ea})`;
      ctx.beginPath();
      ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pulsing red aura behind boss area
    const pulse = 0.3 + Math.sin(t * 2) * 0.15;
    const auraGr = ctx.createRadialGradient(w * 0.5, h * 0.5, 50, w * 0.5, h * 0.5, 400);
    auraGr.addColorStop(0, `rgba(255,20,20,${pulse})`);
    auraGr.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = auraGr;
    ctx.fillRect(0, 0, w, h);
  }

  /* ---- Background helpers ---- */

  _drawMountainRange(ctx, px, baseY, w, h, count, minH, maxH) {
    for (let i = 0; i < count; i++) {
      const mx = (i * (w / (count - 1 || 1))) - px;
      const mw = w / count + 40;
      const mh = minH + Math.abs(Math.sin(i * 1.7)) * (maxH - minH);
      ctx.beginPath();
      ctx.moveTo(mx - mw / 2, baseY);
      ctx.lineTo(mx, baseY - mh);
      ctx.lineTo(mx + mw / 2, baseY);
      ctx.closePath();
      ctx.fill();
    }
  }

  _drawTreeSilhouettes(ctx, px, baseY, w, h, count, minH, maxH, narrow) {
    for (let i = 0; i < count; i++) {
      const tx = (i * (w / (count - 1 || 1)) + 40) - px;
      const th = minH + Math.abs(Math.sin(i * 2.3)) * (maxH - minH);
      const tw = narrow ? 14 : 22;
      // Trunk
      ctx.fillRect(tx - tw / 2, baseY, tw, h - baseY);
      // Canopy (triangle)
      ctx.beginPath();
      ctx.moveTo(tx - 35, baseY);
      ctx.lineTo(tx, baseY - th);
      ctx.lineTo(tx + 35, baseY);
      ctx.closePath();
      ctx.fill();
      // Second layer
      ctx.beginPath();
      ctx.moveTo(tx - 25, baseY - th * 0.5);
      ctx.lineTo(tx, baseY - th * 1.1);
      ctx.lineTo(tx + 25, baseY - th * 0.5);
      ctx.closePath();
      ctx.fill();
    }
  }

  _drawCloud(ctx, cx, cy, size) {
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
    ctx.arc(cx + size * 0.4, cy - size * 0.15, size * 0.4, 0, Math.PI * 2);
    ctx.arc(cx + size * 0.8, cy, size * 0.35, 0, Math.PI * 2);
    ctx.arc(cx - size * 0.3, cy + size * 0.05, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPlatforms(ctx) {
    for (const plat of this.platforms) {
      const sx = plat.x - this.cameraX;
      // Cull off-screen
      if (sx + plat.width < -50 || sx > ctx.canvas.width + 50) continue;

      // Ground platforms
      if (plat.height > 30) {
        // Stone texture look
        const grad = ctx.createLinearGradient(sx, plat.y, sx, plat.y + plat.height);
        grad.addColorStop(0, '#4a3a3a');
        grad.addColorStop(0.1, '#5a4a4a');
        grad.addColorStop(0.5, '#3a2a2a');
        grad.addColorStop(1, '#2a1a1a');
        ctx.fillStyle = grad;
        ctx.fillRect(sx, plat.y, plat.width, plat.height);

        // Top edge highlight
        ctx.fillStyle = '#6a5a4a';
        ctx.fillRect(sx, plat.y, plat.width, 3);

        // Edge lines
        ctx.strokeStyle = '#1a0a0a';
        ctx.lineWidth = 1;
        ctx.strokeRect(sx, plat.y, plat.width, plat.height);
      } else {
        // Thin platform (floating)
        const grad = ctx.createLinearGradient(sx, plat.y, sx, plat.y + plat.height);
        grad.addColorStop(0, '#6a5a4a');
        grad.addColorStop(1, '#4a3a3a');
        ctx.fillStyle = grad;
        ctx.fillRect(sx, plat.y, plat.width, plat.height);
        ctx.strokeStyle = '#2a1a1a';
        ctx.strokeRect(sx, plat.y, plat.width, plat.height);
      }
    }
  }

  drawExitZone(ctx) {
    if (!this.exitZone) return;
    const sx = this.exitZone.x - this.cameraX;
    const allDead = this.allEnemiesDead();

    if (allDead) {
      // --- CLEARED: bright portal + pulsing arrow ---
      const pulse = 0.5 + Math.sin(Date.now() / 400) * 0.3;
      const grad = ctx.createLinearGradient(sx, 0, sx + this.exitZone.width, 0);
      grad.addColorStop(0, `rgba(255,215,0,0)`);
      grad.addColorStop(0.3, `rgba(255,215,0,${pulse * 0.6})`);
      grad.addColorStop(0.7, `rgba(255,215,0,${pulse * 0.6})`);
      grad.addColorStop(1, `rgba(255,215,0,0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(sx, 0, this.exitZone.width, ctx.canvas.height);

      // "GO TO EXIT" label
      ctx.fillStyle = `rgba(255,215,0,${0.7 + pulse * 0.3})`;
      ctx.font = 'bold 22px Cinzel, serif';
      ctx.textAlign = 'center';
      const labelY = ctx.canvas.height / 2;
      ctx.strokeStyle = 'rgba(0,0,0,0.8)';
      ctx.lineWidth = 3;
      ctx.strokeText('▶ GO TO EXIT ▶', sx + this.exitZone.width / 2, labelY);
      ctx.fillText('▶ GO TO EXIT ▶', sx + this.exitZone.width / 2, labelY);

      // Downward arrow (pulsing)
      const arrowY = labelY + 30 + Math.sin(Date.now() / 300) * 8;
      ctx.fillStyle = `rgba(255,215,0,${0.8 + pulse * 0.2})`;
      ctx.font = 'bold 30px Cinzel, serif';
      ctx.fillText('▼', sx + this.exitZone.width / 2, arrowY);
    } else {
      // --- LOCKED: dim hint ---
      const alpha = 0.15 + Math.sin(Date.now() / 500) * 0.08;
      const grad = ctx.createLinearGradient(sx, 0, sx + this.exitZone.width, 0);
      grad.addColorStop(0, `rgba(255,215,0,0)`);
      grad.addColorStop(0.5, `rgba(255,215,0,${alpha})`);
      grad.addColorStop(1, `rgba(255,215,0,0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(sx, 0, this.exitZone.width, ctx.canvas.height);

      const remaining = this.enemies.filter(e => e.isAlive()).length;
      ctx.fillStyle = 'rgba(255,200,80,0.5)';
      ctx.font = '12px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🔒 ${remaining} enemies remain`, sx + this.exitZone.width / 2, 40);
    }
  }

  /** Check if all enemies are dead */
  allEnemiesDead() {
    return this.enemies.every(e => !e.isAlive());
  }

  /** Check if level transition should happen */
  shouldTransition() {
    return this.levelComplete && this.completeTimer <= 0;
  }

  /** Get next level index; returns -1 if all levels complete */
  nextLevelIndex() {
    const next = this.currentIndex + 1;
    return next < LEVELS.length ? next : -1;
  }

  /** Get total level count */
  get totalLevels() {
    return LEVELS.length;
  }
}
