import { Black, Ease, TextField, Tween } from "black-engine";
import ScreenAbstract from "../screen-abstract";
import LeaderboardManager from "../../../core/leaderboard-manager";

export default class GameOverScreen extends ScreenAbstract {
  constructor() {
    super();

    this._gameOverText = null;
    this._scoreText = null;
    this._restartGameButton = null;
    this._viewLeaderboardButton = null;
    this._rankText = null;
    this._newRecordText = null;
    this._leaderboardManager = new LeaderboardManager();

    this._score = 0;
    this._maxCombo = 0;
  }

  setMaxCombo(combo) {
    this._maxCombo = combo;
  }

  setScore(value) {
    this._score = value;
  }

  show() {
    super.show();

    this._animateRestartGameButton();
    this._updateScoreText();
    this._updateLeaderboardInfo();
  }

  _updateLeaderboardInfo() {
    const result = this._leaderboardManager.addScore(this._score, this._maxCombo);
    
    if (result.isNewRecord) {
      this._newRecordText.visible = true;
      this._newRecordText.text = '🏆 NEW HIGH SCORE! 🏆';
      this._animateNewRecord();
    } else if (result.isTopTen) {
      this._rankText.visible = true;
      this._rankText.text = `Rank #${result.rank}`;
    } else {
      this._rankText.visible = false;
      this._newRecordText.visible = false;
    }
  }

  _animateNewRecord() {
    const tween = new Tween({ scale: 1.1 }, 0.6, { ease: Ease.sinusoidalInOut, loop: true, yoyo: true });
    this._newRecordText.add(tween);
  }

  hide() {
    super.hide();

    this._restartGameButton.removeComponent(this._restartGameButton.getComponent(Tween));
    this._restartGameButton.scale = 1;
  }

  _updateScoreText() {
    this._scoreText.text = `Your score: ${this._score}`;
  }

  _init() {
    this._initGameOverText();
    this._initScoreText();
    this._initRankText();
    this._initNewRecordText();
    this._initRestartGameButton();
    this._initViewLeaderboardButton();
    this._initSignals();
  }

  _initRankText() {
    const rankText = this._rankText = new TextField('Rank #5', 'halloween_spooky', 0xffaa44, 50);

    rankText.dropShadow = true;
    rankText.shadowBlur = 1;
    rankText.shadowAlpha = 0.4;
    rankText.shadowDistanceX = 4;
    rankText.shadowDistanceY = 4;

    rankText.alignAnchor(0.5, 0.5);
    rankText.visible = false;
    this.add(rankText);
  }

  _initNewRecordText() {
    const newRecordText = this._newRecordText = new TextField('NEW HIGH SCORE!', 'halloween_spooky', 0xff3333, 60);

    newRecordText.dropShadow = true;
    newRecordText.shadowBlur = 1;
    newRecordText.shadowAlpha = 0.4;
    newRecordText.shadowDistanceX = 4;
    newRecordText.shadowDistanceY = 4;

    newRecordText.alignAnchor(0.5, 0.5);
    newRecordText.visible = false;
    this.add(newRecordText);
  }

  _initViewLeaderboardButton() {
    const viewLeaderboardButton = this._viewLeaderboardButton = new TextField('View Leaderboard', 'halloween_spooky', 0x0088aa, 70);
    this.add(viewLeaderboardButton);

    viewLeaderboardButton.dropShadow = true;
    viewLeaderboardButton.shadowBlur = 1;
    viewLeaderboardButton.shadowAlpha = 0.4;
    viewLeaderboardButton.shadowDistanceX = 4;
    viewLeaderboardButton.shadowDistanceY = 4;

    viewLeaderboardButton.alignAnchor(0.5, 0.5);
    viewLeaderboardButton.touchable = true;
  }

  _initGameOverText() {
    const gameOverText = this._gameOverText = new TextField('Game Over', 'halloween_spooky', 0x000000, 140);

    gameOverText.dropShadow = true;
    gameOverText.shadowBlur = 1;
    gameOverText.shadowAlpha = 0.4;
    gameOverText.shadowDistanceX = 4;
    gameOverText.shadowDistanceY = 4;

    gameOverText.alignAnchor(0.5, 0.5);
    this.add(gameOverText);
  }

  _initScoreText() {
    const scoreText = this._scoreText = new TextField('Your score: 1000', 'halloween_spooky', 0x000000, 70);

    scoreText.dropShadow = true;
    scoreText.shadowBlur = 1;
    scoreText.shadowAlpha = 0.4;
    scoreText.shadowDistanceX = 4;
    scoreText.shadowDistanceY = 4;

    scoreText.alignAnchor(0.5, 0.5);
    this.add(scoreText);
  }

  _initRestartGameButton() {
    const restartGameButton = this._restartGameButton = new TextField('Restart Game', 'halloween_spooky', 0xaa0000, 100);
    this.add(restartGameButton);

    restartGameButton.dropShadow = true;
    restartGameButton.shadowBlur = 1;
    restartGameButton.shadowAlpha = 0.4;
    restartGameButton.shadowDistanceX = 4;
    restartGameButton.shadowDistanceY = 4;

    restartGameButton.alignAnchor(0.5, 0.5);
    restartGameButton.touchable = true;
  }

  _animateRestartGameButton() {
    const tween = new Tween({ scale: 1.03 }, 0.8, { ease: Ease.sinusoidalInOut, loop: true, yoyo: true });
    this._restartGameButton.add(tween);
  }

  _initSignals() {
    this._restartGameButton.on('pointerDown', () => this.post('onRestartGame'));

    this._restartGameButton.on('pointerMove', () => {
      Black.engine.containerElement.style.cursor = 'pointer';
    });

    this._viewLeaderboardButton.on('pointerDown', () => this.post('onViewLeaderboard'));

    this._viewLeaderboardButton.on('pointerMove', () => {
      Black.engine.containerElement.style.cursor = 'pointer';
    });
  }

  _onResize() {
    const bounds = Black.stage.bounds;

    this._gameOverText.x = bounds.left + bounds.width * 0.5;
    this._gameOverText.y = bounds.top + bounds.height * 0.25;

    this._newRecordText.x = bounds.left + bounds.width * 0.5;
    this._newRecordText.y = bounds.top + bounds.height * 0.38;

    this._scoreText.x = bounds.left + bounds.width * 0.5;
    this._scoreText.y = bounds.top + bounds.height * 0.45;

    this._rankText.x = bounds.left + bounds.width * 0.5;
    this._rankText.y = bounds.top + bounds.height * 0.53;

    this._restartGameButton.x = bounds.left + bounds.width * 0.5;
    this._restartGameButton.y = bounds.top + bounds.height * 0.65;

    this._viewLeaderboardButton.x = bounds.left + bounds.width * 0.5;
    this._viewLeaderboardButton.y = bounds.top + bounds.height * 0.78;
  }
}
