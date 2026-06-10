/* ============================================================
   main.js — Game Initialization & Main Loop
   State machine, rendering, input handling.
   ============================================================ */

(function () {
  'use strict';

  // --- DOM elements ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // --- State ---
  const STATE = {
    MENU: 'menu',
    SETTINGS: 'settings',
    PLAYING: 'playing',
    PAUSED: 'paused',
    TRANSITION: 'transition',
    GAMEOVER: 'gameover',
    VICTORY: 'victory',
  };

  let gameState = STATE.MENU;
  let keys = {};
  let lastTime = 0;
  let animFrameId = null;

  // --- Core objects ---
  let player = null;
  let level = null;
  let combat = null;
  let ui = null;

  // --- Transition state ---
  let transitionTimer = 0;
  const TRANSITION_DURATION = 2.8;  // seconds to show level transition

  // --- Settings ---
  let musicVolume = 0.5;
  let sfxVolume = 0.7;
  let difficulty = 'normal';

  // --- Initialize ---
  function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create UI manager
    ui = new UIManager();
    ui.showMainMenu();

    // Create player
    player = new Player(100, 400);

    // Create level manager
    level = new LevelManager();
    level.setDifficulty(difficulty);

    // Create combat system
    combat = new CombatSystem(level, player);

    // --- Input handling ---
    window.addEventListener('keydown', e => {
      keys[e.code] = true;

      // Pause toggle
      if (e.code === 'KeyP' && gameState === STATE.PLAYING) {
        pauseGame();
      } else if (e.code === 'KeyP' && gameState === STATE.PAUSED) {
        resumeGame();
      }

      // Escape
      if (e.code === 'Escape') {
        if (gameState === STATE.PAUSED) resumeGame();
        else if (gameState === STATE.PLAYING) pauseGame();
      }

      // Prevent browser scrolling on game keys
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
           'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyJ', 'KeyF', 'KeyP'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', e => {
      keys[e.code] = false;
    });

    // --- Button handlers ---
    document.getElementById('btnStart').addEventListener('click', () => {
      audio.resumeContext();
      // Show name entry instead of starting directly
      ui.showNameEntry();
    });

    // Name entry
    document.getElementById('btnConfirmName').addEventListener('click', () => {
      audio.resumeContext();
      const name = ui.getEnteredName();
      setPlayerName(name);
      startNewGame();
    });

    document.getElementById('btnSkipName').addEventListener('click', () => {
      audio.resumeContext();
      setPlayerName('Anonymous');
      startNewGame();
    });

    // Allow Enter key on name input
    document.getElementById('playerNameInput').addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        const name = ui.getEnteredName();
        setPlayerName(name);
        startNewGame();
      }
    });

    // Leaderboard
    document.getElementById('btnLeaderboard').addEventListener('click', () => {
      audio.resumeContext();
      ui.showLeaderboard();
    });

    document.getElementById('btnCloseLeaderboard').addEventListener('click', () => {
      ui.hideLeaderboard();
    });

    document.getElementById('btnSettings').addEventListener('click', () => {
      audio.resumeContext();
      ui.updateSettingsUI(musicVolume, sfxVolume, difficulty);
      ui.showSettings();
    });

    document.getElementById('btnBackFromSettings').addEventListener('click', () => {
      ui.hideSettings();
    });

    document.getElementById('btnExit').addEventListener('click', () => {
      if (window.close) window.close();
      else alert('Thanks for playing! Close this tab to exit.');
    });

    document.getElementById('btnResume').addEventListener('click', resumeGame);
    document.getElementById('btnRestart').addEventListener('click', restartLevel);
    document.getElementById('btnQuit').addEventListener('click', quitToMenu);

    document.getElementById('btnRetry').addEventListener('click', restartLevel);
    document.getElementById('btnQuitGameOver').addEventListener('click', quitToMenu);

    document.getElementById('btnPlayAgain').addEventListener('click', startNewGame);
    document.getElementById('btnViewLeaderboard').addEventListener('click', () => {
      ui.showLeaderboard();
    });
    document.getElementById('btnQuitVictory').addEventListener('click', quitToMenu);

    // Settings handlers
    ui.setupSettingsHandlers(
      (vol) => {
        musicVolume = vol;
        audio.setMusicVolume(vol);
      },
      (vol) => {
        sfxVolume = vol;
        audio.setSfxVolume(vol);
      },
      (diff) => {
        difficulty = diff;
        level.setDifficulty(diff);
      }
    );

    // Set initial audio volumes
    audio.setMusicVolume(musicVolume);
    audio.setSfxVolume(sfxVolume);

    // Start music for menu
    audio.playMusic('menu');

    // Start render loop
    lastTime = performance.now();
    animFrameId = requestAnimationFrame(gameLoop);
  }

  // --- Game state transitions ---

  function startNewGame() {
    gameState = STATE.TRANSITION;
    ui.showHUD();
    ui.hideTransition();

    // Load first level
    if (!level.loadLevel(0)) {
      console.error('No levels defined!');
      return;
    }

    player.reset(level.config.spawnX, level.config.spawnY);
    player.score = 0;
    player.kills = 0;
    player.health = player.maxHealth;
    combat = new CombatSystem(level, player);

    // Play battle music
    audio.playMusic('battle');

    gameState = STATE.PLAYING;
  }

  function nextLevel() {
    const nextIdx = level.nextLevelIndex();

    // Check if this was the final level
    if (nextIdx === -1 || level.config.isFinalLevel) {
      // Game complete — victory!
      gameState = STATE.VICTORY;
      ui.showVictory(player.score, player.kills, level.config.number, level.config.name, difficulty);
      audio.stopMusic();
      audio.playMusic('theme', true);
      player.health = player.maxHealth;  // Full heal for display

      // Auto-show leaderboard after 3 seconds so the player sees their rank
      setTimeout(() => {
        if (gameState === STATE.VICTORY) {
          ui.showLeaderboard();
        }
      }, 3000);
      return;
    }

    // Show transition screen
    const prevCfg = level.config;
    const enemiesDefeated = level.enemies.filter(e => !e.isAlive()).length;
    const nextCfg = LEVELS[nextIdx];
    const effectiveTotal = nextCfg && nextCfg.isFinalLevel ? nextCfg.number : level.totalLevels;

    ui.showLevelTransition(
      prevCfg.name,
      prevCfg.number,
      effectiveTotal,
      player.score,
      player.kills,
      enemiesDefeated
    );

    // Load next level
    if (!level.loadLevel(nextIdx)) {
      console.error('Failed to load level', nextIdx);
      return;
    }

    // Keep player score but reset position
    player.reset(level.config.spawnX, level.config.spawnY);
    player.health = Math.min(player.maxHealth, player.health + 40);  // Heal between levels
    combat = new CombatSystem(level, player);

    // Transition timing
    transitionTimer = TRANSITION_DURATION;
    gameState = STATE.TRANSITION;

    // Play level complete music briefly
    audio.playSfx('levelUp');
  }

  function pauseGame() {
    if (gameState !== STATE.PLAYING) return;
    gameState = STATE.PAUSED;
    ui.showPause();
    audio.pauseMusic();
  }

  function resumeGame() {
    if (gameState !== STATE.PAUSED) return;
    gameState = STATE.PLAYING;
    ui.hidePause();
    audio.resumeMusic();
  }

  function restartLevel() {
    ui._hideAll();

    if (!level.loadLevel(level.currentIndex)) {
      console.error('Failed to reload level');
      return;
    }

    player.reset(level.config.spawnX, level.config.spawnY);
    player.health = player.maxHealth;
    combat = new CombatSystem(level, player);

    ui.showHUD();
    audio.playMusic('battle');
    gameState = STATE.PLAYING;
  }

  function quitToMenu() {
    gameState = STATE.MENU;
    ui.showMainMenu();
    audio.stopMusic();
    audio.playMusic('menu');
  }

  // --- Game Loop ---

  function gameLoop(timestamp) {
    animFrameId = requestAnimationFrame(gameLoop);

    // Calculate delta time (cap at 100ms to avoid spiral of death)
    let dt = (timestamp - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1;
    if (dt <= 0) dt = 0.016;
    lastTime = timestamp;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gameState) {
      case STATE.MENU:
      case STATE.SETTINGS:
        renderMenuBackground(dt);
        break;

      case STATE.PLAYING:
        updatePlaying(dt);
        renderPlaying();
        ui.updateHUD(player, level);
        break;

      case STATE.PAUSED:
        renderPlaying();  // Keep game visible behind pause menu
        break;

      case STATE.TRANSITION:
        transitionTimer -= dt;
        renderPlaying();
        if (transitionTimer <= 0) {
          ui.hideTransition();
          gameState = STATE.PLAYING;
          audio.playMusic('battle');
        }
        break;

      case STATE.GAMEOVER:
        renderPlaying();  // Frozen last frame behind overlay
        break;

      case STATE.VICTORY:
        renderPlaying();
        break;
    }
  }

  function updatePlaying(dt) {
    // Player input
    player.handleInput(keys, dt);

    // Physics
    player.update(dt);

    // Platform collisions
    for (const plat of level.platforms) {
      player.resolvePlatformCollision(plat);
    }

    // Level update (enemies, exit zone check)
    level.update(dt, player);

    // Combat
    combat.update(dt);

    // Camera
    level.updateCamera(player, canvas.width, dt);

    // Clamp player to level bounds
    player.x = Math.max(0, Math.min(player.x, level.config.width - player.width));

    // Fall death
    if (player.y > level.config.height + 100) {
      player.health = 0;
    }

    // Check death
    if (!player.isAlive()) {
      gameState = STATE.GAMEOVER;
      ui.showGameOver(player.score, level.config.name);
      audio.stopMusic();
      audio.playMusic('gameOver', false);
      return;
    }

    // Check level complete
    if (level.shouldTransition()) {
      nextLevel();
    }
  }

  function renderPlaying() {
    // Background
    level.drawBackground(ctx, canvas.width, canvas.height);

    // Platforms
    level.drawPlatforms(ctx);

    // Exit zone
    level.drawExitZone(ctx);

    // Enemies (skip dead)
    for (const enemy of level.enemies) {
      if (enemy.isAlive()) {
        enemy.draw(ctx, level.cameraX);
      }
    }

    // Player
    player.draw(ctx, level.cameraX);

    // Combat effects (floating damage numbers)
    combat.draw(ctx, level.cameraX);
  }

  function renderMenuBackground(dt) {
    // Animated gradient background for menus
    const t = Date.now() / 3000;
    const hue1 = (Math.sin(t) * 0.1 + 0.75) * 360;
    const hue2 = (Math.sin(t + 2) * 0.1 + 0.85) * 360;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, `hsl(${hue1}, 20%, 5%)`);
    grad.addColorStop(0.5, `hsl(${hue1 + 20}, 25%, 8%)`);
    grad.addColorStop(1, `hsl(${hue2}, 15%, 4%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw atmospheric particles
    ctx.fillStyle = 'rgba(200, 160, 80, 0.08)';
    for (let i = 0; i < 30; i++) {
      const px = ((Math.sin(t * 0.7 + i * 3.7) * 0.5 + 0.5) * canvas.width);
      const py = ((Math.cos(t * 0.5 + i * 5.1) * 0.5 + 0.5) * canvas.height);
      const pr = 2 + Math.sin(t + i) * 1;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // --- Canvas ---

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // --- Start ---

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
