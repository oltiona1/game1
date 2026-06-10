/* ============================================================
   ui.js — UI Manager
   Menus, HUD, leaderboard, name entry, transitions, victory.
   ============================================================ */

class UIManager {
  constructor() {
    // DOM refs
    this.mainMenu         = document.getElementById('mainMenu');
    this.nameEntry        = document.getElementById('nameEntry');
    this.leaderboardScreen = document.getElementById('leaderboardScreen');
    this.settingsMenu     = document.getElementById('settingsMenu');
    this.hud              = document.getElementById('hud');
    this.pauseMenu        = document.getElementById('pauseMenu');
    this.levelTransition  = document.getElementById('levelTransition');
    this.gameOverScreen   = document.getElementById('gameOverScreen');
    this.victoryScreen    = document.getElementById('victoryScreen');

    // HUD elements
    this.playerHealthBar  = document.getElementById('playerHealthBar');
    this.playerHealthText = document.getElementById('playerHealthText');
    this.playerNameHud    = document.getElementById('playerNameHud');
    this.scoreDisplay     = document.getElementById('scoreDisplay');
    this.levelName        = document.getElementById('levelName');
    this.enemiesRemaining = document.getElementById('enemiesRemaining');

    // Name entry
    this.playerNameInput  = document.getElementById('playerNameInput');
    this.onlineStatus     = document.getElementById('onlineStatus');

    // Leaderboard
    this.leaderboardList  = document.getElementById('leaderboardList');

    // Transition elements
    this.transitionTitle    = document.getElementById('transitionTitle');
    this.transitionSubtitle = document.getElementById('transitionSubtitle');
    this.transitionStats    = document.getElementById('transitionStats');

    // Game over / victory
    this.gameOverScore  = document.getElementById('gameOverScore');
    this.gameOverLevel  = document.getElementById('gameOverLevel');
    this.victoryScore   = document.getElementById('victoryScore');
    this.victorySubtitle = document.getElementById('victorySubtitle');

    // Settings
    this.musicVolSlider = document.getElementById('musicVol');
    this.musicVolLabel  = document.getElementById('musicVolLabel');
    this.sfxVolSlider   = document.getElementById('sfxVol');
    this.sfxVolLabel    = document.getElementById('sfxVolLabel');
    this.difficultySel  = document.getElementById('difficultySelect');

    this.active = 'menu';
  }

  /** Show main menu */
  showMainMenu() {
    this._hideAll();
    this.mainMenu.classList.remove('hidden');
    this.active = 'menu';
    this._updateOnlineStatus();
  }

  /** Show name entry */
  showNameEntry() {
    this.mainMenu.classList.add('hidden');
    this.nameEntry.classList.remove('hidden');
    this.active = 'nameEntry';
    const name = getPlayerName();
    this.playerNameInput.value = name;
    setTimeout(() => this.playerNameInput.focus(), 200);
  }

  /** Get entered name */
  getEnteredName() {
    const name = this.playerNameInput.value.trim();
    return name || 'Anonymous';
  }

  /** Show leaderboard */
  async showLeaderboard() {
    this._hideAll();
    this.leaderboardScreen.classList.remove('hidden');
    this.active = 'leaderboard';
    this._updateOnlineStatus();

    // Show loading
    this.leaderboardList.innerHTML = '<p class="loading-text">⚔️ Loading the Hall of Heroes...</p>';

    try {
      const scores = await leaderboard.getTopScores(10);
      if (!scores || scores.length === 0) {
        this.leaderboardList.innerHTML = `<p class="empty-leaderboard">
          🏜️ No heroes have ventured yet!<br>
          <span class="cta">⚔️ Start a game and be the first!</span>
        </p>`;
        return;
      }
      let html = '';
      scores.forEach((entry, i) => {
        const rank = i + 1;
        let rankClass = 'white';
        let entryClass = '';
        let medal = `${rank}`;
        if (rank === 1) { rankClass = 'gold';   entryClass = 'top1'; medal = '👑'; }
        else if (rank === 2) { rankClass = 'silver'; entryClass = 'top2'; medal = '🥈'; }
        else if (rank === 3) { rankClass = 'bronze'; entryClass = 'top3'; medal = '🥉'; }

        const date = entry.created_at
          ? new Date(entry.created_at).toLocaleDateString()
          : '';
        const completed = entry.level_reached >= 3;
        const badge = completed ? '<span class="lb-badge">🏆 Champion</span>' : '';
        const diffLabel = entry.difficulty && entry.difficulty !== 'normal'
          ? ` · ${entry.difficulty}` : '';

        html += `
          <div class="leaderboard-entry ${entryClass}">
            <span class="lb-rank ${rankClass}">${medal}</span>
            <div class="lb-info">
              <span class="lb-name">${this._escape(entry.player_name)}${badge}</span>
              <div class="lb-details">
                ⚔️ ${entry.kills} kills · Lv.${entry.level_reached}${diffLabel} · ${date}
              </div>
            </div>
            <span class="lb-score">${entry.score.toLocaleString()}</span>
          </div>
        `;
      });
      this.leaderboardList.innerHTML = html;
    } catch (e) {
      this.leaderboardList.innerHTML = '<p class="empty-leaderboard">⚠️ Could not load scores</p>';
    }
  }

  /** Show settings */
  showSettings() {
    this.mainMenu.classList.add('hidden');
    this.settingsMenu.classList.remove('hidden');
    this.active = 'settings';
  }

  /** Hide settings, go back to menu */
  hideSettings() {
    this.settingsMenu.classList.add('hidden');
    this.mainMenu.classList.remove('hidden');
    this.active = 'menu';
  }

  /** Hide leaderboard, go back to menu */
  hideLeaderboard() {
    this.leaderboardScreen.classList.add('hidden');
    this.mainMenu.classList.remove('hidden');
    this.active = 'menu';
  }

  /** Start gameplay HUD */
  showHUD() {
    this._hideAll();
    this.hud.classList.remove('hidden');
    this.playerNameHud.textContent = getPlayerName() || 'Anonymous';
    this.active = 'playing';
  }

  /** Show pause menu */
  showPause() {
    this.pauseMenu.classList.remove('hidden');
    this.active = 'paused';
  }

  /** Hide pause menu */
  hidePause() {
    this.pauseMenu.classList.add('hidden');
    this.active = 'playing';
  }

  /** Show level transition screen */
  showLevelTransition(levelName, levelNum, totalLevels, score, kills, enemiesDefeated) {
    this._hideAll();
    this.levelTransition.classList.remove('hidden');
    this.active = 'transition';

    this.transitionTitle.textContent = `Level ${levelNum} Complete!`;
    this.transitionSubtitle.textContent = levelName;

    const isLastLevel = levelNum + 1 > totalLevels;
    const nextMsg = isLastLevel
      ? `🔥 FINAL LEVEL — ${levelNum + 1}: Give it everything!`
      : `❤️ Continuing to Level ${levelNum + 1} of ${totalLevels}...`;

    this.transitionStats.innerHTML = `
      ⭐ Score: ${score}<br>
      ⚔️ Enemies Defeated: ${enemiesDefeated}<br>
      ${nextMsg}
    `;
  }

  /** Show victory / all-done screen */
  async showVictory(score, kills, finalLevelNum, finalLevelName, difficulty = 'normal') {
    this._hideAll();
    this.victoryScreen.classList.remove('hidden');
    this.active = 'victory';

    if (this.victorySubtitle && finalLevelName) {
      this.victorySubtitle.textContent = `You beat Level ${finalLevelNum} — ${finalLevelName}!`;
    }

    this.victoryScore.innerHTML = `
      ⭐ Final Score: ${score}<br>
      ⚔️ Total Kills: ${kills}<br>
      🏰 Levels Conquered: ${finalLevelNum}
    `;

    // Save score to leaderboard
    const name = getPlayerName() || 'Anonymous';
    try {
      await leaderboard.saveScore(name, score, kills, finalLevelNum, difficulty);
    } catch (e) {
      // Silently fail — score still saved locally
    }
  }

  /** Show game over screen */
  showGameOver(score, levelName) {
    this._hideAll();
    this.gameOverScreen.classList.remove('hidden');
    this.active = 'gameover';

    this.gameOverScore.textContent = `⭐ Score: ${score}`;
    this.gameOverLevel.textContent = `Fell at: ${levelName}`;
  }

  /** Hide transition screen */
  hideTransition() {
    this.levelTransition.classList.add('hidden');
  }

  /** Update HUD in real-time */
  updateHUD(player, level) {
    const hpPct = (player.health / player.maxHealth) * 100;
    this.playerHealthBar.style.width = hpPct + '%';
    this.playerHealthText.textContent = `${Math.ceil(player.health)}/${player.maxHealth}`;

    if (hpPct > 50) {
      this.playerHealthBar.style.background = 'linear-gradient(90deg, #40a040 0%, #80e040 100%)';
    } else if (hpPct > 25) {
      this.playerHealthBar.style.background = 'linear-gradient(90deg, #c0a020 0%, #e0c040 100%)';
    } else {
      this.playerHealthBar.style.background = 'linear-gradient(90deg, #e04040 0%, #ff4040 100%)';
    }

    this.scoreDisplay.textContent = player.score;
    this.levelName.textContent = `Level ${level.config.number} — ${level.config.name}`;

    // Enemies remaining
    const alive = level.enemies.filter(e => e.isAlive()).length;
    const total = level.enemies.length;
    if (alive === 0) {
      this.enemiesRemaining.textContent = '✅ All enemies defeated — head to the exit!';
      this.enemiesRemaining.style.color = '#80e060';
    } else {
      this.enemiesRemaining.textContent = `⚔️ ${alive} of ${total} enemies remain`;
      this.enemiesRemaining.style.color = '#cc6666';
    }
  }

  /** Update online status indicator */
  _updateOnlineStatus() {
    if (this.onlineStatus) {
      if (leaderboard.isOnline()) {
        this.onlineStatus.innerHTML = '🌐 Online leaderboard';
        this.onlineStatus.style.color = '#6aaa50';
      } else {
        this.onlineStatus.innerHTML = '💾 Local scores';
        this.onlineStatus.style.color = '#5a4a3a';
      }
    }
  }

  /** Update settings UI */
  updateSettingsUI(musicVol, sfxVol, difficulty) {
    this.musicVolSlider.value = Math.round(musicVol * 100);
    this.musicVolLabel.textContent = Math.round(musicVol * 100) + '%';
    this.sfxVolSlider.value = Math.round(sfxVol * 100);
    this.sfxVolLabel.textContent = Math.round(sfxVol * 100) + '%';
    this.difficultySel.value = difficulty;
  }

  /** Setup settings handlers */
  setupSettingsHandlers(onMusicVol, onSfxVol, onDifficulty) {
    this.musicVolSlider.addEventListener('input', () => {
      const val = parseInt(this.musicVolSlider.value) / 100;
      this.musicVolLabel.textContent = Math.round(val * 100) + '%';
      onMusicVol(val);
    });

    this.sfxVolSlider.addEventListener('input', () => {
      const val = parseInt(this.sfxVolSlider.value) / 100;
      this.sfxVolLabel.textContent = Math.round(val * 100) + '%';
      onSfxVol(val);
    });

    this.difficultySel.addEventListener('change', () => {
      onDifficulty(this.difficultySel.value);
    });
  }

  /** Escape HTML to prevent XSS */
  _escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /** Hide all overlay screens */
  _hideAll() {
    this.mainMenu.classList.add('hidden');
    this.nameEntry.classList.add('hidden');
    this.leaderboardScreen.classList.add('hidden');
    this.settingsMenu.classList.add('hidden');
    this.hud.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.levelTransition.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.victoryScreen.classList.add('hidden');
  }
}
