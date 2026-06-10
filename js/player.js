/* ============================================================
   player.js — Player Character
   Movement, jumping, attacking, health, animations.
   ============================================================ */

class Player {
  constructor(x, y) {
    // Position & physics
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 64;
    this.vx = 0;
    this.vy = 0;
    this.speed = 280;         // pixels/sec
    this.jumpForce = -520;    // initial jump velocity
    this.gravity = 1200;
    this.onGround = false;

    // Direction
    this.facing = 1;  // 1 = right, -1 = left

    // Health
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.invincibleDuration = 1.0;  // seconds after taking damage

    // Attack
    this.attacking = false;
    this.attackTimer = 0;
    this.attackDuration = 0.25;   // how long the attack hitbox is active
    this.attackCooldown = 0.4;    // time between attacks
    this.attackCooldownTimer = 0;
    this.attackDamage = 25;
    this.attackRange = 55;        // reach of the weapon
    this.attackId = 0;            // unique ID per swing (prevents multi-hit)

    // Animation
    this.animTimer = 0;
    this.currentAnim = 'idle';

    // Sprites (loaded from assets)
    this.sprites = {};
    this.spriteLoaded = false;

    // Score
    this.score = 0;
    this.kills = 0;

    this._loadSprites();
  }

  _loadSprites() {
    const loadImage = (key, src) => {
      const img = new Image();
      img.onload = () => { this.spriteLoaded = true; };
      img.onerror = () => console.warn(`Failed to load sprite: ${src}`);
      img.src = src;
      this.sprites[key] = img;
    };

    loadImage('idle',   'assets/images/player_idle.png');
    loadImage('walk',   'assets/images/player_walk.png');
    loadImage('attack', 'assets/images/player_attack.png');
  }

  /** Reset player to starting position */
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.health = this.maxHealth;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.attacking = false;
    this.attackTimer = 0;
    this.attackCooldownTimer = 0;
    this.facing = 1;
  }

  /** Get current sprite based on state */
  getSprite() {
    if (this.attacking) return this.sprites['attack'];
    if (!this.onGround) return this.sprites['walk'];  // fallback in air
    if (Math.abs(this.vx) > 10) return this.sprites['walk'];
    return this.sprites['idle'];
  }

  /** Get attack hitbox (relative to world position) */
  getAttackHitbox() {
    if (!this.attacking) return null;
    return {
      x: this.x + (this.facing > 0 ? this.width : -this.attackRange),
      y: this.y + 10,
      width: this.attackRange,
      height: 40,
    };
  }

  /** Get player hitbox for receiving damage */
  getHitbox() {
    return {
      x: this.x + 4,
      y: this.y + 4,
      width: this.width - 8,
      height: this.height - 8,
    };
  }

  /** Input handling */
  handleInput(keys, dt) {
    // Movement
    this.vx = 0;

    if (keys['KeyA'] || keys['ArrowLeft'])  { this.vx = -this.speed; this.facing = -1; }
    if (keys['KeyD'] || keys['ArrowRight']) { this.vx =  this.speed; this.facing =  1; }

    // Jump
    if ((keys['KeyW'] || keys['Space'] || keys['ArrowUp']) && this.onGround) {
      this.vy = this.jumpForce;
      this.onGround = false;
      audio.playSfx('jump');
    }

    // Attack
    if ((keys['KeyJ'] || keys['KeyF']) && this.attackCooldownTimer <= 0 && !this.attacking) {
      this.attacking = true;
      this.attackId++;  // new unique ID: only one hit per enemy per swing
      this.attackTimer = this.attackDuration;
      this.attackCooldownTimer = this.attackCooldown;
      audio.playSfx('attack');
    }
  }

  /** Physics update */
  update(dt) {
    // Apply gravity
    this.vy += this.gravity * dt;

    // Move
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Attack timer
    if (this.attacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attacking = false;
        this.attackTimer = 0;
      }
    }

    // Attack cooldown
    if (this.attackCooldownTimer > 0) {
      this.attackCooldownTimer -= dt;
    }

    // Invincibility frames
    if (this.invincible) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) {
        this.invincible = false;
      }
    }

    // Clamp to ground
    if (this.y > 1000) this.y = 1000;
  }

  /** Resolve collision with platforms */
  resolvePlatformCollision(platform) {
    const pLeft = this.x + 4;
    const pRight = pLeft + this.width - 8;
    const pTop = this.y;
    const pBottom = pTop + this.height;

    const platLeft = platform.x;
    const platRight = platform.x + platform.width;
    const platTop = platform.y;
    const platBottom = platform.y + platform.height;

    // Check if overlapping
    if (pRight > platLeft && pLeft < platRight &&
        pBottom > platTop && pTop < platBottom) {

      // Determine collision direction
      const overlapLeft = pRight - platLeft;
      const overlapRight = platRight - pLeft;
      const overlapTop = pBottom - platTop;
      const overlapBottom = platBottom - pTop;

      const minOverlapX = Math.min(overlapLeft, overlapRight);
      const minOverlapY = Math.min(overlapTop, overlapBottom);

      if (minOverlapX < minOverlapY) {
        // Side collision
        if (overlapLeft < overlapRight) {
          this.x = platLeft - (this.width - 4);
        } else {
          this.x = platRight - 4;
        }
        this.vx = 0;
      } else {
        // Top/bottom collision
        if (overlapTop < overlapBottom && this.vy >= 0) {
          // Landing on top
          this.y = platTop - this.height;
          this.vy = 0;
          this.onGround = true;
        } else if (overlapBottom < overlapTop && this.vy < 0) {
          // Hitting head
          this.y = platBottom;
          this.vy = 0;
        }
      }
    }
  }

  /** Take damage from an enemy */
  takeDamage(amount) {
    if (this.invincible) return false;
    this.health -= amount;
    this.invincible = true;
    this.invincibleTimer = this.invincibleDuration;
    audio.playSfx('hit');

    // Knockback
    this.vx = -this.facing * 200;
    this.vy = -150;

    if (this.health <= 0) {
      this.health = 0;
    }
    return true;
  }

  /** Heal */
  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  /** Add score */
  addScore(points) {
    this.score += points;
  }

  isAlive() {
    return this.health > 0;
  }

  /** Draw player */
  draw(ctx, cameraX) {
    const screenX = this.x - cameraX;

    // Invincibility flash
    if (this.invincible && Math.floor(this.invincibleTimer * 10) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    const sprite = this.getSprite();

    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      // Draw sprite
      ctx.save();
      if (this.facing < 0) {
        ctx.translate(screenX + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, 0, 0, this.width, this.height);
      } else {
        ctx.drawImage(sprite, screenX, this.y, this.width, this.height);
      }
      ctx.restore();
    } else {
      // Fallback: draw rectangle
      ctx.fillStyle = '#4488cc';
      ctx.fillRect(screenX, this.y, this.width, this.height);
      ctx.strokeStyle = '#2266aa';
      ctx.strokeRect(screenX, this.y, this.width, this.height);
      // Eyes
      ctx.fillStyle = '#fff';
      const eyeX = this.facing > 0 ? screenX + this.width - 14 : screenX + 6;
      ctx.fillRect(eyeX, this.y + 12, 6, 6);
    }

    // Draw attack hitbox (debug — comment out for production)
    // const ab = this.getAttackHitbox();
    // if (ab) {
    //   ctx.strokeStyle = 'rgba(255,255,0,0.6)';
    //   ctx.lineWidth = 2;
    //   ctx.strokeRect(ab.x - cameraX, ab.y, ab.width, ab.height);
    // }

    ctx.globalAlpha = 1.0;

    // Health bar above player (during combat only)
    if (this.health < this.maxHealth) {
      const barWidth = 44;
      const barHeight = 5;
      const barX = screenX + (this.width - barWidth) / 2;
      const barY = this.y - 10;
      ctx.fillStyle = '#1a0a0a';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      const hpPct = this.health / this.maxHealth;
      const hpColor = hpPct > 0.5 ? '#40a040' : hpPct > 0.25 ? '#c0a020' : '#e04040';
      ctx.fillStyle = hpColor;
      ctx.fillRect(barX, barY, barWidth * hpPct, barHeight);
    }
  }
}
