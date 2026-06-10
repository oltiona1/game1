/* ============================================================
   supabase.js — Supabase + localStorage fallback
   Leaderboard: save/load scores online or offline
   ============================================================ */

const SUPABASE_URL = 'https://hqsoogjijtnaqikjlhl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxc29namppanRuYXFpamtqbGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MzEwMTEsImV4cCI6MjA5NjUwNzAxMX0.qKJ4CmHKZFN94c6DGokFNx3H7JAHAYUBjloblq5SIZQ';

class Leaderboard {
  constructor() {
    this.online = false;
    this.supabase = null;
    this._initSupabase();
  }

  async _initSupabase() {
    // Check if supabase-js is loaded from CDN
    if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
      try {
        this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        // Quick health check
        const { error } = await this.supabase.from('leaderboard').select('id', { count: 'exact', head: true });
        if (!error || error.code === 'PGRST116') {
          this.online = true;
          console.log('📡 Supabase connected — leaderboard online');
        } else {
          console.warn('⚠️ Supabase table missing — using local storage. Run setup.sql.');
        }
      } catch (e) {
        console.warn('⚠️ Supabase unreachable — using local storage:', e.message);
      }
    } else {
      console.log('💾 Supabase CDN not loaded — using local storage');
    }
  }

  /** Save a score */
  async saveScore(name, score, kills, levelReached, difficulty) {
    const entry = {
      player_name: name,
      score,
      kills,
      level_reached: levelReached,
      difficulty,
      created_at: new Date().toISOString(),
    };

    // Always save to localStorage
    this._saveLocal(entry);

    // Try Supabase if online
    if (this.online && this.supabase) {
      try {
        const { error } = await this.supabase.from('leaderboard').insert(entry);
        if (error) {
          console.warn('Supabase insert failed:', error.message);
        }
      } catch (e) {
        console.warn('Supabase insert error:', e.message);
      }
    }
  }

  /** Get top scores */
  async getTopScores(limit = 10) {
    if (this.online && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('leaderboard')
          .select('*')
          .order('score', { ascending: false })
          .limit(limit);

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local');
      }
    }

    // Fallback to localStorage
    return this._getLocalTop(limit);
  }

  /** Check online status */
  isOnline() {
    return this.online;
  }

  // ---- Local Storage fallback ----

  _saveLocal(entry) {
    try {
      const scores = JSON.parse(localStorage.getItem('rpg_leaderboard') || '[]');
      scores.push(entry);
      // Keep only top 50
      scores.sort((a, b) => b.score - a.score);
      localStorage.setItem('rpg_leaderboard', JSON.stringify(scores.slice(0, 50)));
    } catch (e) {
      // localStorage full or unavailable
    }
  }

  _getLocalTop(limit) {
    try {
      const scores = JSON.parse(localStorage.getItem('rpg_leaderboard') || '[]');
      return scores.sort((a, b) => b.score - a.score).slice(0, limit);
    } catch (e) {
      return [];
    }
  }
}

// Global instance
const leaderboard = new Leaderboard();

/** Save the player's name for this session */
function setPlayerName(name) {
  localStorage.setItem('rpg_player_name', name);
}

function getPlayerName() {
  return localStorage.getItem('rpg_player_name') || '';
}
