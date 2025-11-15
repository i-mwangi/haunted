import { Black, DisplayObject, Message } from "black-engine";
import Overlay from "./overlay";
import SoundIcon from "./sound-icon";
import DEBUG_CONFIG from "../core/configs/debug-config";
import StartGameScreen from "./screens/start-game-screen/start-game-screen";
import GameOverScreen from "./screens/game-over-screen/game-over-screen";
import GameplayScreen from "./screens/gameplay-screen/gameplay-screen";
import LeaderboardScreen from "./screens/leaderboard-screen/leaderboard-screen";
import AchievementsScreen from "./screens/achievements-screen/achievements-screen";

export default class UI extends DisplayObject {
  constructor() {
    super();

    this._overlay = null;
    this._soundIcon = null;

    this._startGameScreen = null;
    this._gameplayScreen = null;
    this._gameOverScreen = null;
    this._leaderboardScreen = null;
    this._achievementsScreen = null;

    this._allScreens = [];
    this._maxCombo = 0;

    this.touchable = true;
  }

  showAchievement(achievement) {
    this._gameplayScreen.showAchievement(achievement);
  }

  setAchievementManager(achievementManager) {
    this._achievementManager = achievementManager;
  }

  update(dt) {
    this._gameplayScreen.update(dt);
  }

  updateSoundIcon() {
    this._soundIcon.updateTexture();
  }

  onGameOver() {
    this._gameplayScreen.hide();
    this._gameplayScreen.reset();
    this._gameOverScreen.setMaxCombo(this._maxCombo);
    this._gameOverScreen.show();
    this._maxCombo = 0; // Reset for next game
  }

  onScoreChanged(score) {
    this._gameplayScreen.setScore(score);
    this._gameOverScreen.setScore(score);
  }

  onConsumableCollect(consumableType, position) {
    this._gameplayScreen.onConsumableCollect(consumableType, position);
  }

  onGameplayStarted() {
    this._gameplayScreen.showGoText();
  }

  onRoundChanged() {
    this._gameplayScreen.updateRound();
  }

  hideTutorial() {
    this._gameplayScreen.hideTutorial();
  }

  stopBooster() {
    this._gameplayScreen.stopBooster();
  }

  startInvulnerabilityBooster(duration) {
    this._gameplayScreen.startInvulnerabilityBooster(duration);
  }

  onLivesChanged() {
    this._gameplayScreen.updateLives();
  }

  onComboChanged(combo, multiplier) {
    this._gameplayScreen.onComboChanged(combo, multiplier);
    
    // Track max combo
    if (combo > this._maxCombo) {
      this._maxCombo = combo;
    }
  }

  onComboMilestone(multiplier) {
    this._gameplayScreen.onComboMilestone(multiplier);
  }

  onComboLost(combo) {
    this._gameplayScreen.onComboLost(combo);
  }

  onBossSpawned() {
    this._gameplayScreen.onBossSpawned();
  }

  onBossDamaged(health, maxHealth) {
    this._gameplayScreen.onBossDamaged(health, maxHealth);
  }

  onBossDefeated() {
    this._gameplayScreen.onBossDefeated();
  }

  showBossWarning() {
    this._gameplayScreen.showBossWarning();
  }

  onAdded() {
    this._initOverlay();
    this._initSoundIcon();
    this._initScreens();
    this._initSignals();

    this.stage.on(Message.RESIZE, this._handleResize, this);
    this._handleResize();
  }

  _initOverlay() {
    const overlay = this._overlay = new Overlay();
    this.add(overlay);
  }

  _initSoundIcon() {
    const soundIcon = this._soundIcon = new SoundIcon();
    this.add(soundIcon);
  }

  _initScreens() {
    this._initStartGameScreen();
    this._initGameplayScreen();
    this._initGameOverScreen();
    this._initLeaderboardScreen();
    this._initAchievementsScreen();

    this._startGameScreen.show();
  }

  _initAchievementsScreen() {
    const achievementsScreen = this._achievementsScreen = new AchievementsScreen();
    this.add(achievementsScreen);

    this._allScreens.push(achievementsScreen);
  }

  _initStartGameScreen() {
    const startGameScreen = this._startGameScreen = new StartGameScreen();
    this.add(startGameScreen);

    this._allScreens.push(startGameScreen);
  }

  _initGameplayScreen() {
    const gameplayScreen = this._gameplayScreen = new GameplayScreen();
    this.add(gameplayScreen);

    this._allScreens.push(gameplayScreen);
  }

  _initGameOverScreen() {
    const gameOverScreen = this._gameOverScreen = new GameOverScreen();
    this.add(gameOverScreen);

    this._allScreens.push(gameOverScreen);
  }

  _initLeaderboardScreen() {
    const leaderboardScreen = this._leaderboardScreen = new LeaderboardScreen();
    this.add(leaderboardScreen);

    this._allScreens.push(leaderboardScreen);
  }

  _initSignals() {
    this._overlay.on('onPointerMove', (msg, x, y) => this._onOverlayPointerMove(x, y));
    this._overlay.on('onPointerDown', () => this.post('onPointerDown'));
    this._overlay.on('onPointerUp', () => this.post('onPointerUp'));
    this._soundIcon.on('onSoundChanged', () => this.post('onSoundChanged'));

    this._startGameScreen.on('onStartGame', () => this.onStartGame());
    this._startGameScreen.on('onViewAchievements', () => this._onViewAchievementsFromStart());
    this._gameOverScreen.on('onRestartGame', () => this._onRestartGame());
    this._gameOverScreen.on('onViewLeaderboard', () => this._onViewLeaderboard());
    this._leaderboardScreen.on('onClose', () => this._onCloseLeaderboard());
    this._achievementsScreen.on('onBack', () => this._onCloseAchievements());

    this._gameplayScreen.on('onLeft', () => this.post('onLeft'));
    this._gameplayScreen.on('onRight', () => this.post('onRight'));
    this._gameplayScreen.on('onUp', () => this.post('onUp'));
    this._gameplayScreen.on('onDown', () => this.post('onDown'));

    this._onPressDownSignal = this._onPressDownSignal.bind(this);
    window.addEventListener("keydown", this._onPressDownSignal);
  }

  _onPressDownSignal(e) {
    if (e.repeat) {
      return;
    }

    if (e.code === 'Enter') {
      if (this._startGameScreen.visible) {
        this.onStartGame();
      }

      if (this._gameOverScreen.visible) {
        this._onRestartGame();
      }
    }
  }

  _onOverlayPointerMove(x, y) {
    this._allScreens.forEach(screen => screen.onOverlayMove());
    this.post('onPointerMove', x, y);
  }

  onStartGame() {
    this._startGameScreen.hide();
    this._gameplayScreen.show();
    this.post('onStartGame');
  }

  _onRestartGame() {
    this._gameOverScreen.hide();
    this._leaderboardScreen.hide();
    this._gameplayScreen.show();
    this.post('onRestartGame');
  }

  _onViewLeaderboard() {
    this._gameOverScreen.hide();
    this._leaderboardScreen.show();
  }

  _onCloseLeaderboard() {
    this._leaderboardScreen.hide();
    this._gameOverScreen.show();
  }

  _onViewAchievementsFromStart() {
    if (this._achievementManager) {
      const allAchievements = this._achievementManager.getAllAchievements();
      const unlockedIds = this._achievementManager.getUnlockedAchievements().map(a => a.id);
      const progress = this._achievementManager.getProgress();
      
      this._achievementsScreen.setAchievements(allAchievements, unlockedIds);
      this._achievementsScreen.setProgress(progress);
    }
    
    this._startGameScreen.hide();
    this._achievementsScreen.show();
  }

  _onCloseAchievements() {
    this._achievementsScreen.hide();
    this._startGameScreen.show();
  }

  _handleResize() {
    const bounds = Black.stage.bounds;

    this._soundIcon.x = bounds.left + 50;
    this._soundIcon.y = bounds.top + 50;
  }
}
