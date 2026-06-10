/* ============================================================
   enemy.js — Enemy Characters
   AI: patrol, detect player, chase, attack.
   ============================================================ */

const ENEMY_TYPES = {
  grunt: {
    name: 'Grunt',
    speed: 100,
    health: 60,
    damage: 10,
    attackRange: 45,
    attackCooldown: 1.2,
    detectRange: 300,
    scoreValue: 100,
    width: 44,
    height: 56,
    color: '#cc4444',
  },
  soldier: {
    name: 'Soldier',
    speed: 150,
    health: 90,
    damage: 15,
    attackRange: 50,
    attackCooldown: 1.0,
    detectRange: 350,
    scoreValue: 200,
    width: 48,
    height: 60,
    color: '#cc6644',
  },
  brute: {
    name: 'Brute',
    speed: 70,
    health: 160,
    damage: 25,
    attackRange: 55,
    attackCooldown: 1.8,
    detectRange: 250,
    scoreValue: 350,
    width: 56,
    height: 72,
    color: '#884422',
  },
  boss: {
    name: 'Dark Lord',
    speed: 120,
    health: 400,
    damage: 35,
    attackRange: 65,
    attackCooldown: 1.0,
    detectRange: 500,
    scoreValue: 1000,
    width: 64,
    height: 84,
    color: '#660022',
  },
};

class Enemy {
  constructor(type, x, y, patrolMinX, patrolMaxX) {
    const config = ENEMY_TYPES[type] || ENEMY_TYPES['grunt'];
    this.type = type;

    // Stats
    this.name = config.name;
    this.speed = config.speed;
    this.maxHealth = config.health;
    this.health = config.health;
    this.damage = config.damage;
    this.attackRange = config.attackRange;
    this.attackCooldown = config.attackCooldown;
    this.detectRange = config.detectRange;
    this.scoreValue = config.scoreValue;

    // Position
    this.x = x;
    this.y = y;
    this.width = config.width;
    this.height = config.height;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 1200;
    this.onGround = false;
    this.facing = -1;  // Start facing left

    // Patrol
    this.patrolMinX = patrolMinX;
    this.patrolMaxX = patrolMaxX;
    this.patrolDir = -1;

    // AI state
    this.state = 'patrol';  // 'patrol' | 'chase' | 'attack' | 'hurt'
    this.stateTimer = 0;
    this.detectCooldown = 0;  // After losing sight, wait before going back to patrol

    // Attack
    this.attacking = false;
    this.attackTimer = 0;
    this.attackDuration = 0.3;
    this.attackCooldownTimer = 0;
    this.attackId = 0;             // unique per swing (prevents multi-hit)

    // Hurt
    this.hurtTimer = 0;

    // Sprite
    this.sprite = new Image();
    this.spriteLoaded = false;
    this._loadSprite();
  }

  _loadSprite() {
    // Use the warrior enemy image for all enemies (tinted in draw)
    this.sprite.onload = () => { this.spriteLoaded = true; };
    this.sprite.onerror = () => {};
    this.sprite.src = 'assets/images/enemy.png';
  }

  getHitbox() {
    return {
      x: this.x + 4,
      y: this.y + 4,
      width: this.width - 8,
      height: this.height - 8,
    };
  }

  getAttackHitbox() {
    if (!this.attacking) return null;
    return {
      x: this.x + (this.facing > 0 ? this.width : -this.attackRange),
      y: this.y + 8,
      width: this.attackRange,
      height: 36,
    };
  }

  /** Update AI */
  update(dt, player) {
    // Timers
    this.stateTimer += dt;
    if (this.detectCooldown > 0) this.detectCooldown -= dt;
    if (this.attackCooldownTimer > 0) this.attackCooldownTimer -= dt;
    if (this.hurtTimer > 0) {
      this.hurtTimer -= dt;
      if (this.hurtTimer <= 0 && this.state === 'hurt') {
        this.state = 'patrol';
      }
    }

    if (this.attacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attacking = false;
      }
    }

    if (this.state === 'hurt') {
      this.vy += this.gravity * dt;
      this.y += this.vy * dt;
      this.x += this.vx * dt;
      return;
    }

    // Distance to player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // State transitions
    if (player.isAlive() && dist < this.detectRange && this.detectCooldown <= 0) {
      if (dist < this.attackRange) {
        this.state = 'attack';
      } else {
        this.state = 'chase';
      }
    } else if (this.detectCooldown <= 0) {
      this.state = 'patrol';
    }

    // Execute state
    this.vx = 0;

    switch (this.state) {
      case 'patrol':
        this._patrol(dt);
        break;
      case 'chase':
        this._chase(dt, dx, dy, dist);
        break;
      case 'attack':
        this._attackPlayer(dt, dx, dist);
        break;
    }

    // Gravity
    this.vy += this.gravity * dt;
    this.y += this.vy * dt;
    this.x += this.vx * dt;
  }

  _patrol(dt) {
    this.vx = this.speed * this.patrolDir * 0.5;  // Patrol at half speed
    this.facing = this.patrolDir;

    // Reverse at patrol bounds
    if (this.x <= this.patrolMinX) {
      this.patrolDir = 1;
    } else if (this.x + this.width >= this.patrolMaxX) {
      this.patrolDir = -1;
    }
  }

  _chase(dt, dx, dy, dist) {
    this.facing = dx > 0 ? 1 : -1;
    this.vx = this.speed * this.facing;
  }

  _attackPlayer(dt, dx, dist) {
    this.facing = dx > 0 ? 1 : -1;
    this.vx = 0;

    // If player moved out of range, chase
    if (dist > this.attackRange + 10) {
      this.state = 'chase';
      return;
    }

    // Attack
    if (this.attackCooldownTimer <= 0) {
      this.attacking = true;
      this.attackId++;  // unique per swing
      this.attackTimer = this.attackDuration;
      this.attackCooldownTimer = this.attackCooldown;
    }
  }

  /** Resolve collision with platforms */
  resolvePlatformCollision(platform) {
    const eLeft = this.x + 2;
    const eRight = eLeft + this.width - 4;
    const eTop = this.y;
    const eBottom = eTop + this.height;

    const pLeft = platform.x;
    const pRight = platform.x + platform.width;
    const pTop = platform.y;
    const pBottom = platform.y + platform.height;

    if (eRight > pLeft && eLeft < pRight &&
        eBottom > pTop && eTop < pBottom) {

      const overlapLeft = eRight - pLeft;
      const overlapRight = pRight - eLeft;
      const overlapTop = eBottom - pTop;
      const overlapBottom = pBottom - eTop;

      const minX = Math.min(overlapLeft, overlapRight);
      const minY = Math.min(overlapTop, overlapBottom);

      if (minX < minY) {
        if (overlapLeft < overlapRight) {
          this.x = pLeft - (this.width - 2);
        } else {
          this.x = pRight - 2;
        }
        this.vx = 0;
        this.patrolDir *= -1;  // Reverse patrol on wall hit
      } else {
        if (overlapTop < overlapBottom && this.vy >= 0) {
          this.y = pTop - this.height;
          this.vy = 0;
          this.onGround = true;
        } else if (overlapBottom < overlapTop && this.vy < 0) {
          this.y = pBottom;
          this.vy = 0;
        }
      }
    }
  }

  /** Take damage */
  takeDamage(amount, knockbackDir) {
    this.health -= amount;
    this.state = 'hurt';
    this.hurtTimer = 0.3;
    this.vx = knockbackDir * 250;
    this.vy = -150;
    this.attacking = false;
    this.detectCooldown = 0.1;

    audio.playSfx('hit');

    if (this.health <= 0) {
      this.health = 0;
      audio.playSfx('enemyDeath');
    }
  }

  isAlive() {
    return this.health > 0;
  }

  /** Draw enemy */
  draw(ctx, cameraX) {
    const screenX = this.x - cameraX;

    // Skip if off-screen
    if (screenX + this.width < -100 || screenX > ctx.canvas.width + 100) return;

    // Hurt flash
    let alpha = 1.0;
    if (this.state === 'hurt' && Math.floor(this.hurtTimer * 20) % 2 === 0) {
      alpha = 0.5;
    }

    ctx.globalAlpha = alpha;

    if (this.sprite.complete && this.sprite.naturalWidth > 0) {
      ctx.save();
      if (this.facing < 0) {
        ctx.translate(screenX + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
      } else {
        ctx.drawImage(this.sprite, screenX, this.y, this.width, this.height);
      }
      ctx.restore();
    } else {
      // Fallback: colored rectangle with helmet
      const color = ENEMY_TYPES[this.type]?.color || '#cc4444';
      ctx.fillStyle = color;
      ctx.fillRect(screenX, this.y, this.width, this.height);
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(screenX + 4, this.y + 4, this.width - 8, this.height - 8);
      // Helmet
      ctx.fillStyle = color;
      ctx.fillRect(screenX + 8, this.y + 4, this.width - 16, 14);
      // Eyes (red glow)
      ctx.fillStyle = '#ff3333';
      const eyeOff = this.facing > 0 ? this.width - 18 : 8;
      ctx.fillRect(screenX + eyeOff, this.y + 10, 4, 4);
    }

    ctx.globalAlpha = 1.0;

    // Health bar
    if (this.health < this.maxHealth) {
      const bw = this.width;
      const bh = 4;
      const bx = screenX;
      const by = this.y - 8;
      ctx.fillStyle = '#1a0a0a';
      ctx.fillRect(bx, by, bw, bh);
      const hp = this.health / this.maxHealth;
      ctx.fillStyle = hp > 0.5 ? '#e04040' : '#ff2020';
      ctx.fillRect(bx, by, bw * hp, bh);
    }

    // Attack hitbox debug
    // const ab = this.getAttackHitbox();
    // if (ab) {
    //   ctx.strokeStyle = 'rgba(255,100,0,0.4)';
    //   ctx.strokeRect(ab.x - cameraX, ab.y, ab.width, ab.height);
    // }
  }
}
