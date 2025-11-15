import { MessageDispatcher } from 'black-engine';

const ACHIEVEMENT_TYPE = {
  FirstBlood: 'FIRST_BLOOD',
  Collector: 'COLLECTOR',
  Survivor: 'SURVIVOR',
  ComboMaster: 'COMBO_MASTER',
  BossSlayer: 'BOSS_SLAYER',
  Untouchable: 'UNTOUCHABLE',
  SpeedDemon: 'SPEED_DEMON',
  PumpkinMaster: 'PUMPKIN_MASTER',
  Immortal: 'IMMORTAL',
  ComboGod: 'COMBO_GOD',
};

const ACHIEVEMENTS = {
  [ACHIEVEMENT_TYPE.FirstBlood]: {
    id: ACHIEVEMENT_TYPE.FirstBlood,
    name: 'First Blood',
    description: 'Collect your first item',
    icon: '🎃',
    requirement: { type: 'collect', count: 1 },
  },
  [ACHIEVEMENT_TYPE.Collector]: {
    id: ACHIEVEMENT_TYPE.Collector,
    name: 'Collector',
    description: 'Collect 50 items in one game',
    icon: '🍬',
    requirement: { type: 'collect', count: 50 },
  },
  [ACHIEVEMENT_TYPE.Survivor]: {
    id: ACHIEVEMENT_TYPE.Survivor,
    name: 'Survivor',
    description: 'Reach round 10',
    icon: '💀',
    requirement: { type: 'round', count: 10 },
  },
  [ACHIEVEMENT_TYPE.ComboMaster]: {
    id: ACHIEVEMENT_TYPE.ComboMaster,
    name: 'Combo Master',
    description: 'Achieve a 10x combo',
    icon: '🔥',
    requirement: { type: 'combo', count: 10 },
  },
  [ACHIEVEMENT_TYPE.BossSlayer]: {
    id: ACHIEVEMENT_TYPE.BossSlayer,
    name: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: '⚔️',
    requirement: { type: 'boss', count: 1 },
  },
  [ACHIEVEMENT_TYPE.Untouchable]: {
    id: ACHIEVEMENT_TYPE.Untouchable,
    name: 'Untouchable',
    description: 'Complete 3 rounds without taking damage',
    icon: '🛡️',
    requirement: { type: 'noDamage', count: 3 },
  },
  [ACHIEVEMENT_TYPE.SpeedDemon]: {
    id: ACHIEVEMENT_TYPE.SpeedDemon,
    name: 'Speed Demon',
    description: 'Collect 5 items in 5 seconds',
    icon: '⚡',
    requirement: { type: 'speed', count: 5, time: 5 },
  },
  [ACHIEVEMENT_TYPE.PumpkinMaster]: {
    id: ACHIEVEMENT_TYPE.PumpkinMaster,
    name: 'Pumpkin Master',
    description: 'Score 1000 points',
    icon: '👑',
    requirement: { type: 'score', count: 1000 },
  },
  [ACHIEVEMENT_TYPE.Immortal]: {
    id: ACHIEVEMENT_TYPE.Immortal,
    name: 'Immortal',
    description: 'Reach round 20',
    icon: '👻',
    requirement: { type: 'round', count: 20 },
  },
  [ACHIEVEMENT_TYPE.ComboGod]: {
    id: ACHIEVEMENT_TYPE.ComboGod,
    name: 'Combo God',
    description: 'Achieve a 20x combo',
    icon: '🌟',
    requirement: { type: 'combo', count: 20 },
  },
};

export default class AchievementManager {
  constructor() {
    this.events = new MessageDispatcher();

    this._storageKey = 'haunted-pumpkin-achievements';
    this._unlockedAchievements = this._loadAchievements();
    
    // Session tracking
    this._sessionStats = {
      collectCount: 0,
      collectTimes: [],
      maxCombo: 0,
      bossesDefeated: 0,
      roundsWithoutDamage: 0,
      currentRound: 0,
      score: 0,
    };
  }

  checkAchievement(type, value) {
    const achievement = ACHIEVEMENTS[type];
    if (!achievement) return;

    // Skip if already unlocked
    if (this._unlockedAchievements.includes(type)) return;

    let unlocked = false;

    switch (achievement.requirement.type) {
      case 'collect':
        unlocked = value >= achievement.requirement.count;
        break;
      case 'round':
        unlocked = value >= achievement.requirement.count;
        break;
      case 'combo':
        unlocked = value >= achievement.requirement.count;
        break;
      case 'boss':
        unlocked = value >= achievement.requirement.count;
        break;
      case 'score':
        unlocked = value >= achievement.requirement.count;
        break;
      case 'noDamage':
        unlocked = value >= achievement.requirement.count;
        break;
      case 'speed':
        unlocked = this._checkSpeedAchievement();
        break;
    }

    if (unlocked) {
      this._unlockAchievement(type);
    }
  }

  onCollect() {
    this._sessionStats.collectCount++;
    this._sessionStats.collectTimes.push(Date.now());

    // Check achievements
    this.checkAchievement(ACHIEVEMENT_TYPE.FirstBlood, this._sessionStats.collectCount);
    this.checkAchievement(ACHIEVEMENT_TYPE.Collector, this._sessionStats.collectCount);
    this.checkAchievement(ACHIEVEMENT_TYPE.SpeedDemon, 0);
  }

  onCombo(combo) {
    if (combo > this._sessionStats.maxCombo) {
      this._sessionStats.maxCombo = combo;
      this.checkAchievement(ACHIEVEMENT_TYPE.ComboMaster, combo);
      this.checkAchievement(ACHIEVEMENT_TYPE.ComboGod, combo);
    }
  }

  onRoundComplete(round) {
    this._sessionStats.currentRound = round;
    this.checkAchievement(ACHIEVEMENT_TYPE.Survivor, round);
    this.checkAchievement(ACHIEVEMENT_TYPE.Immortal, round);
  }

  onBossDefeated() {
    this._sessionStats.bossesDefeated++;
    this.checkAchievement(ACHIEVEMENT_TYPE.BossSlayer, this._sessionStats.bossesDefeated);
  }

  onDamage() {
    this._sessionStats.roundsWithoutDamage = 0;
  }

  onRoundNoDamage() {
    this._sessionStats.roundsWithoutDamage++;
    this.checkAchievement(ACHIEVEMENT_TYPE.Untouchable, this._sessionStats.roundsWithoutDamage);
  }

  onScore(score) {
    this._sessionStats.score = score;
    this.checkAchievement(ACHIEVEMENT_TYPE.PumpkinMaster, score);
  }

  resetSession() {
    this._sessionStats = {
      collectCount: 0,
      collectTimes: [],
      maxCombo: 0,
      bossesDefeated: 0,
      roundsWithoutDamage: 0,
      currentRound: 0,
      score: 0,
    };
  }

  getUnlockedAchievements() {
    return this._unlockedAchievements.map(id => ACHIEVEMENTS[id]);
  }

  getAllAchievements() {
    return Object.values(ACHIEVEMENTS);
  }

  getProgress() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = this._unlockedAchievements.length;
    return { unlocked, total, percentage: Math.floor((unlocked / total) * 100) };
  }

  isUnlocked(achievementType) {
    return this._unlockedAchievements.includes(achievementType);
  }

  _checkSpeedAchievement() {
    const now = Date.now();
    const recentCollects = this._sessionStats.collectTimes.filter(time => now - time < 5000);
    return recentCollects.length >= 5;
  }

  _unlockAchievement(type) {
    this._unlockedAchievements.push(type);
    this._saveAchievements();

    const achievement = ACHIEVEMENTS[type];
    this.events.post('achievementUnlocked', achievement);
  }

  _loadAchievements() {
    try {
      const data = localStorage.getItem(this._storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load achievements:', error);
      return [];
    }
  }

  _saveAchievements() {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify(this._unlockedAchievements));
    } catch (error) {
      console.error('Failed to save achievements:', error);
    }
  }
}

export { ACHIEVEMENT_TYPE, ACHIEVEMENTS };
