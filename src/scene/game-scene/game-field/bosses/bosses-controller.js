import * as THREE from 'three';
import { MessageDispatcher } from 'black-engine';
import BOSS_CLASS from './data/boss-class';
import { BOSS_TYPE, BOSS_CONFIG } from './data/boss-data';
import { GLOBAL_VARIABLES } from '../data/global-variables';

export default class BossesController extends THREE.Group {
  constructor() {
    super();

    this.events = new MessageDispatcher();

    this._activeBosses = [];
    this._currentBoss = null;
  }

  update(dt) {
    this._activeBosses.forEach(boss => {
      boss.update(dt);
    });
  }

  checkBossRound(round) {
    // Check if this round should spawn a boss
    const config = BOSS_CONFIG[BOSS_TYPE.EvilPumpkin];
    return config.spawnRounds.includes(round + 1); // +1 because rounds are 0-indexed
  }

  spawnBoss(bossType = BOSS_TYPE.EvilPumpkin) {
    // Don't spawn if there's already an active boss
    if (this._currentBoss && !this._currentBoss.isDefeated()) {
      return;
    }

    const BossClass = BOSS_CLASS[bossType];
    const boss = new BossClass();
    this.add(boss);

    this._activeBosses.push(boss);
    this._currentBoss = boss;

    // Forward boss events
    boss.events.on('bossSpawned', () => {
      this.events.post('bossSpawned');
    });

    boss.events.on('bossDamaged', (msg, health, maxHealth) => {
      this.events.post('bossDamaged', health, maxHealth);
    });

    boss.events.on('bossAttack', () => {
      this.events.post('bossAttack');
    });

    boss.events.on('bossDefeated', (msg, scoreReward) => {
      this.events.post('bossDefeated', scoreReward);
      this._currentBoss = null;
    });
  }

  getCurrentBoss() {
    return this._currentBoss;
  }

  hasActiveBoss() {
    return this._currentBoss && !this._currentBoss.isDefeated();
  }

  reset() {
    this._activeBosses.forEach(boss => {
      boss.removeFromParent();
    });
    this._activeBosses = [];
    this._currentBoss = null;
  }
}
