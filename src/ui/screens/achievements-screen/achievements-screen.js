import { Black, TextField } from 'black-engine';
import ScreenAbstract from '../screen-abstract';

export default class AchievementsScreen extends ScreenAbstract {
  constructor() {
    super();

    this._titleText = null;
    this._progressText = null;
    this._achievementsList = [];
    this._backButton = null;
    this._achievements = [];
    
    // Don't block touches when hidden
    this.touchable = false;
  }

  show() {
    super.show();
    this.touchable = true;
    
    // Refresh display when shown
    if (this._achievements.length > 0) {
      this._updateDisplay();
    }
    
    // Ensure back button is touchable
    if (this._backButton) {
      this._backButton.touchable = true;
    }
  }

  hide() {
    super.hide();
    this.touchable = false;
    
    // Clean up to prevent any lingering issues
    if (this._backButton) {
      this._backButton.touchable = false;
    }
  }

  setAchievements(allAchievements, unlockedIds) {
    this._achievements = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id)
    }));

    this._updateDisplay();
  }

  setProgress(progress) {
    this._progressText.text = `${progress.unlocked}/${progress.total} Unlocked (${progress.percentage}%)`;
  }

  _updateDisplay() {
    // Clear existing achievement displays
    if (this._achievementsList && this._achievementsList.length > 0) {
      this._achievementsList.forEach(container => {
        this.remove(container);
      });
    }

    this._achievementsList = [];

    const startY = -200;
    const spacing = 80;

    this._achievements.forEach((achievement, index) => {
      const yPos = startY + (index * spacing);
      const achievementDisplay = this._createAchievementDisplay(achievement, yPos);
      this._achievementsList.push(achievementDisplay);
    });
  }

  _createAchievementDisplay(achievement, yPos) {
    const container = new TextField('', 'halloween_spooky', 0xffffff, 1);
    this.add(container);

    const icon = new TextField(achievement.icon, 'halloween_spooky', 0xffffff, 50);
    container.add(icon);
    icon.alignAnchor(0.5, 0.5);
    icon.x = -300;
    icon.y = yPos;

    const color = achievement.unlocked ? 0xffaa00 : 0x666666;
    const name = new TextField(achievement.name, 'halloween_spooky', color, 35);
    container.add(name);
    name.alignAnchor(0, 0.5);
    name.x = -250;
    name.y = yPos - 15;

    const description = new TextField(achievement.description, 'halloween_spooky', 0xcccccc, 25);
    container.add(description);
    description.alignAnchor(0, 0.5);
    description.x = -250;
    description.y = yPos + 15;

    if (!achievement.unlocked) {
      icon.alpha = 0.3;
      name.alpha = 0.5;
      description.alpha = 0.5;
    }

    return container;
  }

  _init() {
    this._initTitle();
    this._initProgress();
    this._initBackButton();
  }

  _initTitle() {
    const titleText = this._titleText = new TextField('Achievements', 'halloween_spooky', 0xff6600, 80);
    this.add(titleText);

    titleText.alignAnchor(0.5, 0.5);

    titleText.dropShadow = true;
    titleText.shadowBlur = 2;
    titleText.shadowAlpha = 0.6;
    titleText.shadowDistanceX = 4;
    titleText.shadowDistanceY = 4;
  }

  _initProgress() {
    const progressText = this._progressText = new TextField('0/10 Unlocked (0%)', 'halloween_spooky', 0xffaa00, 40);
    this.add(progressText);

    progressText.alignAnchor(0.5, 0.5);
  }

  _initBackButton() {
    const backButton = this._backButton = new TextField('← Back', 'halloween_spooky', 0xff6600, 50);
    this.add(backButton);

    backButton.alignAnchor(0.5, 0.5);
    backButton.touchable = true;

    backButton.dropShadow = true;
    backButton.shadowBlur = 1;
    backButton.shadowAlpha = 0.4;
    backButton.shadowDistanceX = 3;
    backButton.shadowDistanceY = 3;

    backButton.on('pointerDown', () => this.post('onBack'));

    backButton.on('pointerMove', () => {
      Black.engine.containerElement.style.cursor = 'pointer';
    });
  }

  _onResize() {
    const bounds = Black.stage.bounds;

    this._titleText.x = bounds.left + bounds.width * 0.5;
    this._titleText.y = bounds.top + 100;

    this._progressText.x = bounds.left + bounds.width * 0.5;
    this._progressText.y = bounds.top + 200;

    this._backButton.x = bounds.left + bounds.width * 0.5;
    this._backButton.y = bounds.bottom - 100;
  }
}
