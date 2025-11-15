const CONSUMABLE_TYPE = {
  SmallCandy: 'SMALL_CANDY',
  BigCandy: 'BIG_CANDY',
  BoosterCandyPlayerSpeed: 'BOOSTER_CANDY_PLAYER_SPEED',
  BoosterCandyPlayerInvulnerability: 'BOOSTER_CANDY_PLAYER_INVULNERABILITY',
  BoosterCandyEnemiesSlow: 'BOOSTER_CANDY_ENEMIES_SLOW',
}

const CONSUMABLES_CONFIG = {
  [CONSUMABLE_TYPE.SmallCandy]: {
    spawnTime: { min: 3000, max: 6000 },
    lifeTime: { min: 10000, max: 15000 },
    chanceToSpawn: 0.9,
  },
  [CONSUMABLE_TYPE.BigCandy]: {
    spawnTime: { min: 7000, max: 10000 },
    lifeTime: { min: 10000, max: 15000 },
    chanceToSpawn: 0.5,
  },
  [CONSUMABLE_TYPE.BoosterCandyPlayerSpeed]: {
    lifeTime: { min: 20000, max: 25000 },
    name: 'Speed Boost',
    color: 0x44ff44, // Brighter toxic green for better visibility
    particlesColor: 0x44ff44,
    progressBarWidth: 200,
    duration: 18000,
    speedMultiplier: 2.2,
  },
  [CONSUMABLE_TYPE.BoosterCandyPlayerInvulnerability]: {
    lifeTime: { min: 20000, max: 25000 },
    name: 'Invincibility',
    color: 0xff3333, // More vibrant red for danger/power
    particlesColor: 0xff3333,
    progressBarWidth: 190,
    duration: 12000,
  },
  [CONSUMABLE_TYPE.BoosterCandyEnemiesSlow]: {
    lifeTime: { min: 20000, max: 25000 },
    name: 'SlowMo',
    color: 0x4444ff, // Brighter blue for magical effect
    particlesColor: 0x66aaff, // Lighter blue particles
    progressBarWidth: 130,
    duration: 18000,
    speedMultiplier: 0.4,
  },
  boosterCandyConfig: {
    spawnTime: { min: 10000, max: 15000 },
    chanceToSpawn: 0.65,
  },
}

export {
  CONSUMABLE_TYPE,
  CONSUMABLES_CONFIG,
};
