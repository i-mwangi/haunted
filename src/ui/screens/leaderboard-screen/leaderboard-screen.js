import { Black, DisplayObject, TextField, FontAlign, FontStyle } from 'black-engine';
import ScreenAbstract from '../screen-abstract';
import LeaderboardManager from '../../../core/leaderboard-manager';

export default class LeaderboardScreen extends ScreenAbstract {
  constructor() {
    super();

    this._leaderboardManager = new LeaderboardManager();
    this._titleText = null;
    this._entriesGroup = null;
    this._noScoresText = null;
    this._closeButton = null;
  }

  show(currentScore = null, currentCombo = null) {
    super.show();
    this._updateLeaderboard(currentScore, currentCombo);
  }

  _updateLeaderboard(currentScore, currentCombo) {
    // Clear existing entries
    if (this._entriesGroup) {
      this._entriesGroup.removeFromParent();
    }

    const entriesGroup = this._entriesGroup = new DisplayObject();
    this.add(entriesGroup);

    const leaderboard = this._leaderboardManager.getLeaderboard();

    if (leaderboard.length === 0) {
      this._noScoresText.visible = true;
      return;
    }

    this._noScoresText.visible = false;

    // Display top 10 scores
    leaderboard.forEach((entry, index) => {
      const isCurrentScore = currentScore !== null && 
                            entry.score === currentScore && 
                            index === 0;

      this._createLeaderboardEntry(entriesGroup, entry, index + 1, isCurrentScore);
    });
  }

  _createLeaderboardEntry(parent, entry, rank, isHighlight) {
    const entryGroup = new DisplayObject();
    parent.add(entryGroup);

    const yPos = (rank - 1) * 45;
    entryGroup.y = yPos;

    const color = isHighlight ? 0xff0000 : (rank <= 3 ? 0xff6600 : 0xffffff);
    const fontSize = isHighlight ? 32 : (rank <= 3 ? 28 : 24);

    // Rank
    const rankText = new TextField();
    entryGroup.add(rankText);
    rankText.fontFamily = 'AlarmClock, Arial';
    rankText.fontSize = fontSize;
    rankText.color = color;
    rankText.text = `#${rank}`;
    rankText.x = -200;
    rankText.style = FontStyle.BOLD;

    // Score
    const scoreText = new TextField();
    entryGroup.add(scoreText);
    scoreText.fontFamily = 'AlarmClock, Arial';
    scoreText.fontSize = fontSize;
    scoreText.color = color;
    scoreText.text = `${entry.score}`;
    scoreText.x = -50;
    scoreText.style = FontStyle.BOLD;

    // Combo
    if (entry.combo > 0) {
      const comboText = new TextField();
      entryGroup.add(comboText);
      comboText.fontFamily = 'AlarmClock, Arial';
      comboText.fontSize = fontSize * 0.7;
      comboText.color = 0x00ff00;
      comboText.text = `x${entry.combo}`;
      comboText.x = 100;
      comboText.style = FontStyle.BOLD;
    }

    // Date
    const dateText = new TextField();
    entryGroup.add(dateText);
    dateText.fontFamily = 'Arial';
    dateText.fontSize = fontSize * 0.6;
    dateText.color = 0xcccccc;
    dateText.text = this._leaderboardManager.formatDate(entry.date);
    dateText.x = 180;

    // Highlight effect
    if (isHighlight) {
      const newRecordText = new TextField();
      entryGroup.add(newRecordText);
      newRecordText.fontFamily = 'AlarmClock, Arial';
      newRecordText.fontSize = 20;
      newRecordText.color = 0xff0000;
      newRecordText.text = 'NEW!';
      newRecordText.x = -280;
      newRecordText.style = FontStyle.BOLD;
    }
  }

  _init() {
    this._initTitle();
    this._initNoScoresText();
    this._initCloseButton();
  }

  _initTitle() {
    const titleText = this._titleText = new TextField();
    this.add(titleText);

    titleText.fontFamily = 'AlarmClock, Arial';
    titleText.fontSize = 48;
    titleText.color = 0xff6600;
    titleText.align = FontAlign.CENTER;
    titleText.style = FontStyle.BOLD;
    titleText.text = 'LEADERBOARD';
    titleText.alignAnchor(0.5, 0.5);
  }

  _initNoScoresText() {
    const noScoresText = this._noScoresText = new TextField();
    this.add(noScoresText);

    noScoresText.fontFamily = 'AlarmClock, Arial';
    noScoresText.fontSize = 32;
    noScoresText.color = 0xffffff;
    noScoresText.align = FontAlign.CENTER;
    noScoresText.text = 'No scores yet!\nPlay to set a record!';
    noScoresText.alignAnchor(0.5, 0.5);
    noScoresText.visible = false;
    noScoresText.style = FontStyle.BOLD;
  }

  _initCloseButton() {
    const closeButton = this._closeButton = new TextField();
    this.add(closeButton);

    closeButton.fontFamily = 'AlarmClock, Arial';
    closeButton.fontSize = 32;
    closeButton.color = 0xffffff;
    closeButton.align = FontAlign.CENTER;
    closeButton.text = '[CLOSE]';
    closeButton.alignAnchor(0.5, 0.5);
    closeButton.touchable = true;
    closeButton.style = FontStyle.BOLD;

    closeButton.on('pointerDown', () => {
      this.post('onClose');
    });

    closeButton.on('pointerMove', () => {
      Black.engine.containerElement.style.cursor = 'pointer';
    });
  }

  _onResize() {
    const bounds = Black.stage.bounds;

    this._titleText.x = bounds.left + bounds.width / 2;
    this._titleText.y = bounds.top + 80;

    if (this._entriesGroup) {
      this._entriesGroup.x = bounds.left + bounds.width / 2;
      this._entriesGroup.y = bounds.top + 180;
    }

    this._noScoresText.x = bounds.left + bounds.width / 2;
    this._noScoresText.y = bounds.top + bounds.height / 2;

    this._closeButton.x = bounds.left + bounds.width / 2;
    this._closeButton.y = bounds.bottom - 80;
  }
}
