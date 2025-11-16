import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import GameDebug from './game-debug';
import { MessageDispatcher } from 'black-engine';
import SCENE_CONFIG from '../../core/configs/scene-config';
import DEBUG_CONFIG from '../../core/configs/debug-config';
import GameField from './game-field/game-field';
import CameraController from './camera-controller/camera-controller';
import { GAME_CONFIG } from './game-field/data/game-config';
import { GLOBAL_VARIABLES } from './game-field/data/global-variables';
import Environment from './environment/environment';
import Loader from '../../core/loader';
import { SOUNDS_CONFIG } from '../../core/configs/sounds-config';
import { getCoordinatesFromPosition } from '../../core/helpers/helpers';
import RaycasterController from './raycaster-controller';
import { ROUNDS_CONFIG } from './game-field/data/rounds-config';
import ParticleSystem from './effects/particle-system';

export default class GameScene extends THREE.Group {
  constructor(data) {
    super();

    this.events = new MessageDispatcher();

    this._data = data;

    this._gameDebug = null;
    this._gameField = null;
    this._music = null;
    this._raycasterController = null;
    this._particleSystem = null;
    this._heartbeatSound = null;
    this._owlHootSound = null;
    this._wolfHowlSound = null;
    this._owlSoundTimer = 0;
    this._wolfSoundTimer = 0;
    this._heartbeatPlaying = false;

    this._isSoundPlayed = false;

    this._init();
  }

  update(dt) {
    this._gameField.update(dt);
    this._cameraController.update(dt);
    this._environment.update(dt);
    this._particleSystem.update(dt);
    this._updateAmbientSounds(dt);
  }

  onSoundChanged() {
    this._gameDebug.updateSoundController();
    const musicVolume = SOUNDS_CONFIG.enabled ? SOUNDS_CONFIG.masterVolume * SOUNDS_CONFIG.musicVolume : 0;
    this._music.setVolume(musicVolume);

    // Update ambient sound volumes - all at 100%
    const ambientVolume = SOUNDS_CONFIG.enabled ? SOUNDS_CONFIG.masterVolume * 1.0 : 0;

    this._heartbeatSound.setVolume(ambientVolume);
    this._owlHootSound.setVolume(ambientVolume);
    this._wolfHowlSound.setVolume(ambientVolume);

    this._gameField.onSoundChanged();
    this._environment.onSoundChanged();
  }

  onStartGame() {
    this._unBlurScene();
    this._gameField.startGame();
    this._music.play();
    this._cameraController.enableRotation();

    // Play wolf howl on game start
    this._playWolfHowl();

    // Start heartbeat and owl sounds
    setTimeout(() => {
      this._playOwlHoot();
    }, 2000);
    setTimeout(() => {
      if (this._heartbeatSound && SOUNDS_CONFIG.enabled) {
        this._heartbeatSound.play();
        this._heartbeatPlaying = true;
      }
    }, 4000);
  }

  onRestartGame() {
    this._gameField.restartGame();
    this._unBlurScene();
    this._cameraController.backToPosition();

    // Play wolf howl on restart
    this._playWolfHowl();

    // Stop heartbeat on restart
    if (this._heartbeatPlaying) {
      this._heartbeatSound.stop();
      this._heartbeatPlaying = false;
    }
    this._owlSoundTimer = 0;
    this._wolfSoundTimer = 0;
  }

  onButtonPressed(buttonType) {
    this._gameField.onButtonPressed(buttonType);
  }

  onPointerMove(x, y) {
    this._cameraController.onPointerMove(x, y);
    this._environment.onPointerMove(x, y);
  }

  onPointerDown() {
    this._cameraController.onPointerDown();
    this._environment.onPointerDown();
  }

  onPointerUp() {
    this._cameraController.onPointerUp();
  }

  initLevel() {
    this._gameField.initLevel(0);
  }

  _blurScene(instant = false) {
    if (instant) {
      this._data.renderer.domElement.style.filter = `blur(${GAME_CONFIG.sceneBlur}px)`;

      return;
    }

    const blurObject = { value: 0 };

    new TWEEN.Tween(blurObject)
      .to({ value: GAME_CONFIG.sceneBlur }, 300)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .start()
      .onUpdate(() => {
        this._data.renderer.domElement.style.filter = `blur(${blurObject.value}px)`;
      });
  }

  _unBlurScene(instant = false) {
    if (instant) {
      this._data.renderer.domElement.style.filter = `blur(0px)`;

      return;
    }

    const blurObject = { value: GAME_CONFIG.sceneBlur };

    new TWEEN.Tween(blurObject)
      .to({ value: 0 }, 300)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onUpdate(() => {
        this._data.renderer.domElement.style.filter = `blur(${blurObject.value}px)`;
      });
  }

  _init() {
    this._initGameDebug();
    this._initEmptySound();
    this._initRaycaster();
    this._initCameraController();
    this._initParticleSystem();
    this._initGameField();
    this._initEnvironment();
    this._initSignals();
    this._initMusic();

    this._blurScene(true);
  }

  _initParticleSystem() {
    const particleSystem = this._particleSystem = new ParticleSystem();
    this.add(particleSystem);
  }

  _initGameDebug() {
    this._gameDebug = new GameDebug();
  }

  _initEmptySound() {
    if (SCENE_CONFIG.isMobile) {
      window.addEventListener('touchstart', () => {
        if (this._isSoundPlayed) {
          return;
        }

        const sound = new THREE.PositionalAudio(this._data.audioListener);
        sound.setVolume(0);
        sound.play();

        this._isSoundPlayed = true;
      });
    }
  }

  _initRaycaster() {
    const camera = this._data.camera;
    this._raycasterController = new RaycasterController(camera);
  }

  _initCameraController() {
    const camera = this._data.camera;
    const orbitControls = this._data.orbitControls;
    const cameraController = this._cameraController = new CameraController(camera, orbitControls);
    this.add(cameraController);
  }

  _initGameField() {
    const renderer = this._data.renderer;
    const camera = this._data.camera;
    const audioListener = this._data.audioListener;
    const gameField = this._gameField = new GameField(renderer, camera, audioListener);
    this.add(gameField);
  }

  _initEnvironment() {
    const audioListener = this._data.audioListener;
    const environment = this._environment = new Environment(this._raycasterController, audioListener);
    this.add(environment);
  }

  _initMusic() {
    const music = this._music = new THREE.Audio(this._data.audioListener);

    Loader.events.on('onAudioLoaded', () => {
      music.setBuffer(Loader.assets['music']);
      music.setLoop(true);
      music.setVolume(SOUNDS_CONFIG.masterVolume * SOUNDS_CONFIG.musicVolume);
    });

    // Initialize ambient sounds
    this._heartbeatSound = new THREE.Audio(this._data.audioListener);
    this._owlHootSound = new THREE.Audio(this._data.audioListener);
    this._wolfHowlSound = new THREE.Audio(this._data.audioListener);

    Loader.events.on('onAudioLoaded', () => {
      this._heartbeatSound.setBuffer(Loader.assets['public_sound_heartbeat']);
      this._heartbeatSound.setLoop(true);
      this._heartbeatSound.setVolume(SOUNDS_CONFIG.masterVolume * 1.0);

      this._owlHootSound.setBuffer(Loader.assets['public_sound_owl_hoot']);
      this._owlHootSound.setVolume(SOUNDS_CONFIG.masterVolume * 1.0);

      this._wolfHowlSound.setBuffer(Loader.assets['public_sound_wolf-howl']);
      this._wolfHowlSound.setVolume(SOUNDS_CONFIG.masterVolume * 1.0);
    });
  }

  _initSignals() {
    this._gameDebug.events.on('fpsMeterChanged', () => this.events.post('fpsMeterChanged'));
    this._gameDebug.events.on('orbitControlsChanged', () => this._onOrbitControlsChanged());
    this._gameDebug.events.on('audioEnabledChanged', () => this.events.post('onSoundsEnabledChanged'));
    this._gameDebug.events.on('helpersChanged', () => this._gameField.onHelpersChanged());
    this._gameDebug.events.on('increaseRound', () => this._debugIncreaseRound());
    this._gameDebug.events.on('decreaseRound', () => this._debugDecreaseRound());

    this._gameField.events.on('gameOver', () => this._onGameOver());
    this._gameField.events.on('scoreChanged', (msg, score) => this.events.post('scoreChanged', score));
    this._gameField.events.on('onConsumableCollect', (msg, consumableType, position) => {
      this.events.post('onConsumableCollect', consumableType, position);
      this._onConsumableCollect(consumableType, position);
    });
    this._gameField.events.on('gameplayStarted', () => this.events.post('gameplayStarted'));
    this._gameField.events.on('roundUp', () => this._onRoundUp());
    this._gameField.events.on('onPlayerInArch', () => this._environment.setArchInvisible());
    this._gameField.events.on('onPlayerOutArch', () => this._environment.setArchVisible());
    this._gameField.events.on('initLevel', () => this._environment.setArchVisible());
    this._gameField.events.on('onButtonPress', () => this.events.post('onButtonPress'));
    this._gameField.events.on('focusCameraOnPlayer', () => this._onfocusCameraOnPlayer());
    this._gameField.events.on('stopBooster', () => this.events.post('stopBooster'));
    this._gameField.events.on('startInvulnerabilityBooster', (msg, duration) => this.events.post('startInvulnerabilityBooster', duration));
    this._gameField.events.on('livesChanged', () => {
      this.events.post('livesChanged');
      this._onPlayerHit();
    });

    this._gameField.events.on('comboChanged', (msg, combo, multiplier) => {
      this.events.post('comboChanged', combo, multiplier);
    });

    this._gameField.events.on('comboMilestone', (msg, multiplier) => {
      this.events.post('comboMilestone', multiplier);
    });

    this._gameField.events.on('comboLost', (msg, combo) => {
      this.events.post('comboLost', combo);
    });

    this._gameField.events.on('bossSpawned', () => {
      this.events.post('bossSpawned');
    });

    this._gameField.events.on('bossDamaged', (msg, health, maxHealth) => {
      this.events.post('bossDamaged', health, maxHealth);
    });

    this._gameField.events.on('bossDefeated', (msg, scoreReward) => {
      this.events.post('bossDefeated');
      // Emit explosion particles at boss position
      this._particleSystem.emitExplosion(new THREE.Vector3(0, 1, 0), 0xff8c42, 50);
    });

    this._environment.events.on('onEnvironmentPumpkinClick', () => this._gameField.onEnvironmentPumpkinClick());

    this._gameField.events.on('achievementUnlocked', (msg, achievement) => {
      this.events.post('achievementUnlocked', achievement);
    });
  }

  getAchievementManager() {
    return this._gameField.getAchievementManager();
  }

  _onRoundUp() {
    this._gameDebug.onRoundChanged();
    this._gameField.onRoundChanged();
    this.events.post('onRoundChanged');

    // Play wolf howl every 2 rounds (round 2, 4, 6, 8, etc.)
    if (GLOBAL_VARIABLES.round % 2 === 0 && GLOBAL_VARIABLES.round > 0) {
      this._playWolfHowl();
    }
  }

  _debugIncreaseRound() {
    GLOBAL_VARIABLES.round++;

    if (GLOBAL_VARIABLES.round > ROUNDS_CONFIG.length - 1) {
      GLOBAL_VARIABLES.round = ROUNDS_CONFIG.length - 1;
    }

    this.events.post('onRoundChanged');
    this._gameField.onRoundChanged();
    this._gameDebug.onRoundChanged();
  }

  _debugDecreaseRound() {
    GLOBAL_VARIABLES.round--;

    if (GLOBAL_VARIABLES.round < 0) {
      GLOBAL_VARIABLES.round = 0;
    }

    this.events.post('onRoundChanged');
    this._gameField.onRoundChanged();
    this._gameDebug.onRoundChanged();
  }

  _onGameOver() {
    this._blurScene();
    this.events.post('gameOver');

    // Stop heartbeat on game over
    if (this._heartbeatPlaying) {
      this._heartbeatSound.stop();
      this._heartbeatPlaying = false;
    }
  }

  _onfocusCameraOnPlayer() {
    const coordinates = getCoordinatesFromPosition(GLOBAL_VARIABLES.playerPosition);
    const playerPosition = new THREE.Vector3(coordinates.x, 0, coordinates.z);
    this._cameraController.focusCameraOnObject(playerPosition);
  }

  _onOrbitControlsChanged() {
    this._data.orbitControls.enabled = DEBUG_CONFIG.orbitControls;
  }

  _onConsumableCollect(consumableType, position) {
    // Get color based on consumable type
    let color = 0xffaa44; // Default golden

    if (consumableType.includes('Speed')) {
      color = 0x44ff44; // Green
    } else if (consumableType.includes('Invulnerability')) {
      color = 0xff3333; // Red
    } else if (consumableType.includes('Slow')) {
      color = 0x4444ff; // Blue
    }

    // Emit particles
    const worldPosition = new THREE.Vector3(position.x, position.y + 0.5, position.z);
    this._particleSystem.emitBurst(worldPosition, color, 15, {
      speed: 2,
      spread: 0.8,
      size: 0.1,
      life: 0.6,
      gravity: -3
    });
  }

  _onPlayerHit() {
    // Screen shake on hit
    this._cameraController.shake(0.15, 0.4);

    // Red particles at player position
    const coordinates = getCoordinatesFromPosition(GLOBAL_VARIABLES.playerPosition);
    const playerPosition = new THREE.Vector3(coordinates.x, 0.5, coordinates.z);
    this._particleSystem.emitExplosion(playerPosition, 0xff3333, 25);

    // Check if player has only 1 life left - start heartbeat
    this._updateHeartbeatSound();
  }

  _updateAmbientSounds(dt) {
    // Owl hoots every 3 seconds during gameplay
    if (GLOBAL_VARIABLES.gameState === 2) { // Gameplay state
      this._owlSoundTimer += dt;

      if (this._owlSoundTimer >= 3) {
        this._playOwlHoot();
        this._owlSoundTimer = 0;
      }
    }
  }

  _playOwlHoot() {
    if (!SOUNDS_CONFIG.enabled) return;

    if (this._owlHootSound.isPlaying) {
      this._owlHootSound.stop();
    }
    this._owlHootSound.play();
  }

  _playWolfHowl() {
    if (!SOUNDS_CONFIG.enabled) return;

    if (this._wolfHowlSound.isPlaying) {
      this._wolfHowlSound.stop();
    }
    this._wolfHowlSound.play();
  }

  _updateHeartbeatSound() {
    // Heartbeat plays continuously from game start, not based on lives
    // It's started in onStartGame() and stopped on game over/restart
  }
}
