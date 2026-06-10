/* ============================================================
   ui.js — UI Manager
   Menus, HUD, level transitions, game over, victory screens.
   ============================================================ */

class UIManager {
  constructor() {
    // DOM refs
    this.mainMenu         = document.getElementById('mainMenu');
    this.settingsMenu     = document.getElementById('settingsMenu');
    this.hud              = document.getElementById('hud');
    this.pauseMenu        = document.getElementById('pauseMenu');
    this.levelTransition  = document.getElementById('levelTransition');
    this.gameOverScreen   = document.getElementById('gameOverScreen');
    this.victoryScreen    = document.getElementById('victoryScreen');

    // HUD elements
    this.playerHealthBar  = document.getElementById('playerHealthBar');
    this.playerHealthText = document.getElementById('playerHealthText');
    this.scoreDisplay     = document.getElementById('scoreDisplay');
    this.levelName        = document.getElementById('levelName');

    // Transition elements
    this.transitionTitle    = document.getElementById('transitionTitle');
    this.transitionSubtitle = document.getElementById('transitionSubtitle');
    this.transitionStats    = document.getElementById('transitionStats');

    // Game over / victory
    this.gameOverScore  = document.getElementById('gameOverScore');
    this.gameOverLevel  = document.getElementById('gameOverLevel');
    this.victoryScore   = document.getElementById('victoryScore');

    // Settings
    this.musicVolSlider = document.getElementById('musicVol');
    this.musicVolLabel  = document.getElementById('musicVolLabel');
    this.sfxVolSlider   = document.getElementById('sfxVol');
    this.sfxVolLabel    = document.getElementById('sfxVolLabel');
    this.difficultySel  = document.getElementById('difficultySelect');

    this.active = 'menu';  // 'menu' | 'settings' | 'playing' | 'paused' | 'transition' | 'gameover' | 'victory'
  }

  /** Show main menu */
  showMainMenu() {
    this._hideAll();
    this.mainMenu.classList.remove('hidden');
    this.active = 'menu';
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

  /** Start gameplay HUD */
  showHUD() {
    this._hideAll();
    this.hud.classList.remove('hidden');
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

  /** Show victory screen */
  /** Show victory / all-done screen */
  showVictory(score, kills, finalLevelNum, finalLevelName) {
    this._hideAll();
    this.victoryScreen.classList.remove('hidden');
    this.active = 'victory';

    const subtitle = document.getElementById('victorySubtitle');
    if (subtitle && finalLevelName) {
      subtitle.textContent = `You beat Level ${finalLevelNum} — ${finalLevelName}!`;
    }

    this.victoryScore.innerHTML = `
      ⭐ Final Score: ${score}<br>
      ⚔️ Total Kills: ${kills}<br>
      🏰 Levels Conquered: ${finalLevelNum}
    `;
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
    // Health bar
    const hpPct = (player.health / player.maxHealth) * 100;
    this.playerHealthBar.style.width = hpPct + '%';
    this.playerHealthText.textContent = `${Math.ceil(player.health)}/${player.maxHealth}`;

    // Color health bar
    if (hpPct > 50) {
      this.playerHealthBar.style.background = 'linear-gradient(90deg, #40a040 0%, #80e040 100%)';
    } else if (hpPct > 25) {
      this.playerHealthBar.style.background = 'linear-gradient(90deg, #c0a020 0%, #e0c040 100%)';
    } else {
      this.playerHealthBar.style.background = 'linear-gradient(90deg, #e04040 0%, #ff4040 100%)';
    }

    // Score
    this.scoreDisplay.textContent = player.score;

    // Level
    this.levelName.textContent = `Level ${level.config.number} — ${level.config.name}`;
  }

  /** Update settings UI from current values */
  updateSettingsUI(musicVol, sfxVol, difficulty) {
    this.musicVolSlider.value = Math.round(musicVol * 100);
    this.musicVolLabel.textContent = Math.round(musicVol * 100) + '%';
    this.sfxVolSlider.value = Math.round(sfxVol * 100);
    this.sfxVolLabel.textContent = Math.round(sfxVol * 100) + '%';
    this.difficultySel.value = difficulty;
  }

  /** Set up settings event handlers (called once during init) */
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

  /** Hide all overlay screens */
  _hideAll() {
    this.mainMenu.classList.add('hidden');
    this.settingsMenu.classList.add('hidden');
    this.hud.classList.add('hidden');
    this.pauseMenu.classList.add('hidden');
    this.levelTransition.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.victoryScreen.classList.add('hidden');
  }
}
