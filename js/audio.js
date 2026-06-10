/* ============================================================
   audio.js — Audio Manager
   Handles background music and sound effects.
   ============================================================ */

class AudioManager {
  constructor() {
    this.musicVolume = 0.5;
    this.sfxVolume = 0.7;
    this.currentBGM = null;
    this.bgmPlaying = false;

    // Music tracks
    this.tracks = {
      menu:     new Audio('assets/music/menu.mp3'),
      battle:   new Audio('assets/music/battle.mp3'),
      levelEnd: new Audio('assets/music/level_complete.mp3'),
      gameOver: new Audio('assets/music/game_over.mp3'),
      theme:    new Audio('assets/music/theme.mp3'),
    };

    // Configure all tracks
    Object.values(this.tracks).forEach(track => {
      track.preload = 'auto';
      track.loop = false;
    });

    // Sound effects (using Web Audio API for latency-free playback)
    this.ctx = null;
    this.sfxBuffers = {};
    this._initSfx();
  }

  _initSfx() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not available — SFX disabled');
    }
  }

  /** Generate a simple synthesized SFX */
  _synthesizeSfx(type) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.value = this.sfxVolume * 0.3;

    switch (type) {
      case 'attack':
        this._playNoise(ctx, gain, now, 0.08, 200, 600, 'square');
        break;
      case 'hit':
        this._playNoise(ctx, gain, now, 0.12, 100, 300, 'sawtooth');
        break;
      case 'jump':
        this._playTone(ctx, gain, now, 0.15, 300, 600, 'sine');
        break;
      case 'enemyDeath':
        this._playNoise(ctx, gain, now, 0.25, 150, 50, 'sawtooth');
        break;
      case 'levelUp':
        this._playArpeggio(ctx, gain, now, [523, 659, 784, 1047], 0.12, 'sine');
        break;
      case 'pickup':
        this._playTone(ctx, gain, now, 0.1, 800, 1200, 'sine');
        break;
    }
  }

  _playTone(ctx, gain, now, duration, freqStart, freqEnd, type) {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.linearRampToValueAtTime(freqEnd, now + duration);
    const env = ctx.createGain();
    env.gain.setValueAtTime(gain.gain.value, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(env).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  _playNoise(ctx, gain, now, duration, freqStart, freqEnd, type) {
    this._playTone(ctx, gain, now, duration, freqStart, freqEnd, type);
  }

  _playArpeggio(ctx, gain, now, freqs, step, type) {
    freqs.forEach((f, i) => {
      const t = now + i * step;
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = f;
      const env = ctx.createGain();
      env.gain.setValueAtTime(gain.gain.value * 0.6, t);
      env.gain.exponentialRampToValueAtTime(0.001, t + step * 1.2);
      osc.connect(env).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + step * 1.2);
    });
  }

  // --- Public API ---

  playSfx(name) {
    this._synthesizeSfx(name);
  }

  playMusic(trackName, loop = true) {
    // Stop current
    if (this.currentBGM) {
      this.currentBGM.pause();
      this.currentBGM.currentTime = 0;
    }

    const track = this.tracks[trackName];
    if (!track) {
      console.warn(`Music track "${trackName}" not found`);
      return;
    }

    track.loop = loop;
    track.volume = this.musicVolume;
    track.currentTime = 0;

    const playPromise = track.play();
    if (playPromise) {
      playPromise.catch(e => console.warn('Music playback blocked (browser policy):', e.message));
    }

    this.currentBGM = track;
    this.bgmPlaying = true;
  }

  stopMusic() {
    if (this.currentBGM) {
      this.currentBGM.pause();
      this.currentBGM.currentTime = 0;
      this.bgmPlaying = false;
    }
  }

  pauseMusic() {
    if (this.currentBGM && this.bgmPlaying) {
      this.currentBGM.pause();
    }
  }

  resumeMusic() {
    if (this.currentBGM && !this.bgmPlaying) {
      const playPromise = this.currentBGM.play();
      if (playPromise) playPromise.catch(e => {});
      this.bgmPlaying = true;
    }
  }

  setMusicVolume(v) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.currentBGM) {
      this.currentBGM.volume = this.musicVolume;
    }
  }

  setSfxVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
  }

  /** Resume AudioContext after user gesture (required by browsers) */
  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

// Global instance
const audio = new AudioManager();
