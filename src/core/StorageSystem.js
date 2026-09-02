/**
 * StorageSystem - Handles local persistence of player name, level progress,
 * scores, times, progressive level unlocking (requiring >= 2 stars), and unlocked messages.
 */
const STORAGE_KEY = 'softskills_quest_progress_v2';

export const LEVEL_ORDER = [
  'autodisciplina',
  'perseverancia',
  'asertividad',
  'creatividad_innovacion',
  'capacidad_planificacion'
];

export const LEVEL_NAMES = {
  'autodisciplina': '1. Autodisciplina',
  'perseverancia': '2. Perseverancia',
  'asertividad': '3. Asertividad',
  'creatividad_innovacion': '4. Creatividad',
  'capacidad_planificacion': '5. Planificación'
};

const defaultState = {
  playerName: '',
  completedLevels: {},
  messagesUnlocked: {},
  stats: {
    totalScore: 0,
    totalTimeSpent: 0,
    totalAttempts: 0,
    levelsFinished: 0
  }
};

export class StorageSystem {
  static load() {
    try {
      if (typeof localStorage === 'undefined') return defaultState;
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaultState;
      const parsed = JSON.parse(data);
      return { ...defaultState, ...parsed };
    } catch (e) {
      return defaultState;
    }
  }

  static save(state) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }

  static getPlayerName() {
    const state = this.load();
    return state.playerName || 'Dev';
  }

  static setPlayerName(name) {
    const state = this.load();
    state.playerName = (name || 'Dev').trim().substring(0, 16);
    this.save(state);
    return state.playerName;
  }

  /**
   * Progressive Level Unlocking:
   * Level 1 (autodisciplina) is always unlocked.
   * Level N requires Level N-1 completed with at least 2 stars (stars >= 2).
   */
  static isLevelUnlocked(skillKey) {
    const index = LEVEL_ORDER.indexOf(skillKey);
    if (index <= 0) return true; // First level is always unlocked

    const prevLevelKey = LEVEL_ORDER[index - 1];
    const state = this.load();
    const prevProg = state.completedLevels[prevLevelKey];

    return Boolean(prevProg && prevProg.completed && prevProg.stars >= 2);
  }

  static getUnlockRequirement(skillKey) {
    const index = LEVEL_ORDER.indexOf(skillKey);
    if (index <= 0) return null;
    const prevKey = LEVEL_ORDER[index - 1];
    return `Requiere 2★ o más en ${LEVEL_NAMES[prevKey] || 'el nivel anterior'}`;
  }

  static unlockMessage(skillKey, messageMomentKey) {
    const state = this.load();
    if (!state.messagesUnlocked[skillKey]) {
      state.messagesUnlocked[skillKey] = [];
    }
    if (!state.messagesUnlocked[skillKey].includes(messageMomentKey)) {
      state.messagesUnlocked[skillKey].push(messageMomentKey);
    }
    this.save(state);
  }

  static saveLevelCompletion(skillKey, { score, timeSeconds, attempts, stars, performanceTier, finalMessageKey }) {
    const state = this.load();
    const existing = state.completedLevels[skillKey] || { bestScore: 0, bestTime: Infinity, minAttempts: Infinity, stars: 0 };

    state.completedLevels[skillKey] = {
      completed: true,
      bestScore: Math.max(existing.bestScore, score),
      bestTime: Math.min(existing.bestTime, timeSeconds),
      minAttempts: Math.min(existing.minAttempts, attempts),
      stars: Math.max(existing.stars || 0, stars),
      lastPerformanceTier: performanceTier,
      lastCompletedAt: new Date().toISOString()
    };

    this.unlockMessage(skillKey, finalMessageKey);

    state.stats.levelsFinished = Object.keys(state.completedLevels).length;
    let totalScore = 0;
    let totalTime = 0;
    let totalAtt = 0;
    Object.values(state.completedLevels).forEach(lvl => {
      totalScore += lvl.bestScore || 0;
      totalTime += (lvl.bestTime !== Infinity ? lvl.bestTime : 0);
      totalAtt += (lvl.minAttempts !== Infinity ? lvl.minAttempts : 1);
    });
    state.stats.totalScore = totalScore;
    state.stats.totalTimeSpent = Math.round(totalTime);
    state.stats.totalAttempts = totalAtt;

    this.save(state);
    return state;
  }

  static getSkillProgress(skillKey) {
    const state = this.load();
    return state.completedLevels[skillKey] || null;
  }

  static resetProgress() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    return defaultState;
  }
}
