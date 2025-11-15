import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import Loader from '../../../../core/loader';
import { BOSS_CONFIG, BOSS_STATE, BOSS_TYPE } from './data/boss-data';
import { MessageDispatcher } from 'black-engine';
import { GLOBAL_VARIABLES } from '../data/global-variables';
import { getCoordinatesFromPosition } from '../../../../core/helpers/helpers';

export default class EvilPumpkinBoss extends THREE.Group {
  constructor() {
    super();

    this.events = new MessageDispatcher();

    this._view = null;
    this._config = BOSS_CONFIG[BOSS_TYPE.EvilPumpkin];
    this._health = this._config.health;
    this._state = BOSS_STATE.Idle;
    this._attackTimer = 0;
    this._moveSpeed = this._config.speed;
    this._glowMaterial = null;
    this._isDefeated = false;

    this._init();
  }

  update(dt) {
    if (this._isDefeated) return;

    this._updateState(dt);
    this._updateGlow(dt);
  }

  takeDamage(amount = 1) {
    if (this._isDefeated) return;

    this._health -= amount;
    this._state = BOSS_STATE.Hurt;
    this._flashRed();

    this.events.post('bossDamaged', this._health, this._config.health);

    if (this._health <= 0) {
      this._defeat();
    } else {
      // Return to chasing after hurt
      setTimeout(() => {
        if (!this._isDefeated) {
          this._state = BOSS_STATE.Chasing;
        }
      }, 500);
    }
  }

  getHealth() {
    return this._health;
  }

  getMaxHealth() {
    return this._config.health;
  }

  isDefeated() {
    return this._isDefeated;
  }

  _init() {
    this._initView();
    this._initGlow();
    this._spawn();
  }

  _initView() {
    const model = Loader.assets['evil-pumpkin'];
    if (!model) {
      console.error('Evil pumpkin model not loaded');
      return;
    }

    const view = this._view = model.scene.clone();
    this.add(view);

    const scale = this._config.scale;
    view.scale.set(scale, scale, scale);
    view.position.y = 0.5;

    // Make it glow
    view.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color(0xff4400);
        child.material.emissiveIntensity = 0.3;
      }
    });
  }

  _initGlow() {
    const geometry = new THREE.SphereGeometry(1.5, 16, 16);
    const material = this._glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });

    const glow = new THREE.Mesh(geometry, material);
    glow.position.y = 1;
    this.add(glow);
  }

  _spawn() {
    // Spawn at a random edge position
    const spawnPositions = [
      { x: -4, z: -4 },
      { x: 4, z: -4 },
      { x: -4, z: 4 },
      { x: 4, z: 4 },
    ];

    const spawnPos = spawnPositions[Math.floor(Math.random() * spawnPositions.length)];
    this.position.set(spawnPos.x, 0, spawnPos.z);

    // Spawn animation
    this.scale.set(0, 0, 0);
    const scale = { value: 0 };

    new TWEEN.Tween(scale)
      .to({ value: 1 }, 1000)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(() => {
        this.scale.setScalar(scale.value);
      })
      .onComplete(() => {
        this._state = BOSS_STATE.Chasing;
        this.events.post('bossSpawned');
      })
      .start();
  }

  _updateState(dt) {
    switch (this._state) {
      case BOSS_STATE.Chasing:
        this._chasePlayer(dt);
        this._checkAttack(dt);
        break;
      case BOSS_STATE.Attacking:
        this._attack();
        break;
    }
  }

  _chasePlayer(dt) {
    const playerPos = GLOBAL_VARIABLES.playerPosition;
    const playerCoords = getCoordinatesFromPosition(playerPos);
    const targetPos = new THREE.Vector3(playerCoords.x, 0, playerCoords.z);

    // Move towards player
    const direction = new THREE.Vector3()
      .subVectors(targetPos, this.position)
      .normalize();

    this.position.add(direction.multiplyScalar(this._moveSpeed * dt));

    // Rotate to face player
    const angle = Math.atan2(direction.x, direction.z);
    this.rotation.y = angle;

    // Check collision with player
    const distance = this.position.distanceTo(targetPos);
    if (distance < 1.5) {
      this._state = BOSS_STATE.Attacking;
    }
  }

  _checkAttack(dt) {
    this._attackTimer += dt;
  }

  _attack() {
    if (this._attackTimer < this._config.attackCooldown) return;

    this._attackTimer = 0;
    this.events.post('bossAttack');

    // Quick lunge animation
    const originalPos = this.position.clone();
    const lungeDistance = 0.5;
    const direction = new THREE.Vector3(
      Math.sin(this.rotation.y),
      0,
      Math.cos(this.rotation.y)
    );

    const targetPos = originalPos.clone().add(direction.multiplyScalar(lungeDistance));

    const pos = { x: originalPos.x, z: originalPos.z };

    new TWEEN.Tween(pos)
      .to({ x: targetPos.x, z: targetPos.z }, 200)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(() => {
        this.position.x = pos.x;
        this.position.z = pos.z;
      })
      .chain(
        new TWEEN.Tween(pos)
          .to({ x: originalPos.x, z: originalPos.z }, 200)
          .easing(TWEEN.Easing.Cubic.In)
          .onUpdate(() => {
            this.position.x = pos.x;
            this.position.z = pos.z;
          })
          .onComplete(() => {
            this._state = BOSS_STATE.Chasing;
          })
      )
      .start();
  }

  _updateGlow(dt) {
    if (this._glowMaterial) {
      // Pulsing glow effect
      const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 0.2;
      this._glowMaterial.opacity = pulse;
    }
  }

  _flashRed() {
    if (!this._view) return;

    this._view.traverse((child) => {
      if (child.isMesh && child.material) {
        const originalEmissive = child.material.emissive.clone();
        child.material.emissive.setHex(0xff0000);
        child.material.emissiveIntensity = 1;

        setTimeout(() => {
          child.material.emissive.copy(originalEmissive);
          child.material.emissiveIntensity = 0.3;
        }, 200);
      }
    });
  }

  _defeat() {
    this._isDefeated = true;
    this._state = BOSS_STATE.Defeated;

    // Defeat animation
    const scale = { value: 1 };
    const rotation = { value: 0 };

    new TWEEN.Tween(scale)
      .to({ value: 0 }, 800)
      .easing(TWEEN.Easing.Back.In)
      .onUpdate(() => {
        this.scale.setScalar(scale.value);
      })
      .start();

    new TWEEN.Tween(rotation)
      .to({ value: Math.PI * 4 }, 800)
      .onUpdate(() => {
        this.rotation.y = rotation.value;
      })
      .onComplete(() => {
        this.events.post('bossDefeated', this._config.scoreReward);
        this.removeFromParent();
      })
      .start();
  }
}
