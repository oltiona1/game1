/* ============================================================
   combat.js — Combat System
   Collision detection, damage resolution, knockback.
   ============================================================ */

class CombatSystem {
  constructor(level, player) {
    this.level = level;
    this.player = player;
    this.combatLog = [];       // Floating damage numbers
    this.logDuration = 1.2;    // How long damage numbers persist
  }

  /** Run full combat tick */
  update(dt) {
    // Update floating damage texts
    for (let i = this.combatLog.length - 1; i >= 0; i--) {
      this.combatLog[i].timer -= dt;
      this.combatLog[i].y -= 30 * dt;  // Float upward
      this.combatLog[i].alpha = Math.max(0, this.combatLog[i].timer / this.logDuration);
      if (this.combatLog[i].timer <= 0) {
        this.combatLog.splice(i, 1);
      }
    }

    // --- Player attacks hitting enemies ---
    if (this.player.attacking) {
      const playerAtkBox = this.player.getAttackHitbox();
      if (playerAtkBox) {
        for (const enemy of this.level.enemies) {
          if (!enemy.isAlive()) continue;
          // Only one hit per enemy per attack swing (uses stable attackId)
          if (enemy._lastHitByPlayerId === this.player.attackId) continue;

          const enemyBox = enemy.getHitbox();
          if (this._aabbOverlap(playerAtkBox, enemyBox)) {
            const knockbackDir = this.player.facing;
            enemy.takeDamage(this.player.attackDamage, knockbackDir);
            enemy._lastHitByPlayerId = this.player.attackId;
            this._addDamageText(
              enemy.x + enemy.width / 2,
              enemy.y,
              this.player.attackDamage,
              '#ffcc00'
            );

            // If enemy died, award score
            if (!enemy.isAlive()) {
              this.player.addScore(enemy.scoreValue);
              this.player.kills++;
              this._addDamageText(
                enemy.x + enemy.width / 2,
                enemy.y - 20,
                `+${enemy.scoreValue}`,
                '#ffd700'
              );
            }
          }
        }
      }
    }

    // --- Enemy attacks hitting player ---
    for (const enemy of this.level.enemies) {
      if (!enemy.isAlive() || !enemy.attacking) continue;

      const enemyAtkBox = enemy.getAttackHitbox();
      if (!enemyAtkBox) continue;

      // Only one hit per enemy swing
      if (enemy._lastHitPlayerId === enemy.attackId) continue;

      const playerBox = this.player.getHitbox();
      if (this._aabbOverlap(enemyAtkBox, playerBox)) {
        const hit = this.player.takeDamage(enemy.damage);
        enemy._lastHitPlayerId = enemy.attackId;

        if (hit) {
          this._addDamageText(
            this.player.x + this.player.width / 2,
            this.player.y,
            enemy.damage,
            '#ff4444'
          );
        }
      }
    }

    // No cleanup needed — attackId is stable per swing and auto-increments
  }

  /** Axis-Aligned Bounding Box collision */
  _aabbOverlap(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /** Add a floating damage number */
  _addDamageText(x, y, value, color) {
    this.combatLog.push({
      x: x,
      y: y,
      value: typeof value === 'number' ? Math.round(value) : value,
      color: color,
      timer: this.logDuration,
      alpha: 1.0,
    });
  }

  /** Draw floating damage numbers */
  draw(ctx, cameraX) {
    for (const log of this.combatLog) {
      const sx = log.x - cameraX;
      ctx.globalAlpha = log.alpha;
      ctx.fillStyle = log.color;
      ctx.font = 'bold 16px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 2;
      ctx.strokeText(log.value.toString(), sx, log.y);
      ctx.fillText(log.value.toString(), sx, log.y);
    }
    ctx.globalAlpha = 1.0;
  }
}
