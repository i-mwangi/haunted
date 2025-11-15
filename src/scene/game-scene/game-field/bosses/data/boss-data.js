const BOSS_TYPE = {
  EvilPumpkin: 'EVIL_PUMPKIN',
};

const BOSS_CONFIG = {
  [BOSS_TYPE.EvilPumpkin]: {
    health: 5,
    speed: 2,
    damage: 1,
    scale: 2.5,
    spawnRounds: [5, 10, 15, 20], // Spawn every 5 rounds
    attackCooldown: 3, // seconds
    movePattern: 'chase', // chase, circle, random
    scoreReward: 500,
  },
};

const BOSS_STATE = {
  Idle: 'IDLE',
  Chasing: 'CHASING',
  Attacking: 'ATTACKING',
  Hurt: 'HURT',
  Defeated: 'DEFEATED',
};

export { BOSS_TYPE, BOSS_CONFIG, BOSS_STATE };
