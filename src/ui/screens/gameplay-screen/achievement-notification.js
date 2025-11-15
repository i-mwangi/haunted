import { DisplayObject, TextField, Tween, Ease } from 'black-engine';

export default class AchievementNotification extends DisplayObject {
  constructor() {
    super();

    this._background = null;
    this._iconText = null;
    this._titleText = null;
    this._descriptionText = null;
    this._queue = [];
    this._isShowing = false;

    this._init();
  }

  showAchievement(achievement) {
    this._queue.push(achievement);
    
    if (!this._isShowing) {
      this._showNext();
    }
  }

  _showNext() {
    if (this._queue.length === 0) {
      this._isShowing = false;
      return;
    }

    this._isShowing = true;
    const achievement = this._queue.shift();

    this._iconText.text = achievement.icon;
    this._titleText.text = achievement.name;
    this._descriptionText.text = achievement.description;

    this.visible = true;
    this.alpha = 0;
    this.y = -100;

    // Slide in animation
    const slideIn = new Tween({ alpha: 1, y: 0 }, 500, { ease: Ease.backOut });
    this.add(slideIn);

    slideIn.on('complete', () => {
      // Hold for 3 seconds
      const hold = new Tween({}, 3000);
      this.add(hold);

      hold.on('complete', () => {
        // Slide out animation
        const slideOut = new Tween({ alpha: 0, y: -100 }, 400, { ease: Ease.backIn });
        this.add(slideOut);

        slideOut.on('complete', () => {
          this.visible = false;
          this._showNext();
        });
      });
    });
  }

  _init() {
    this._initBackground();
    this._initIcon();
    this._initTitle();
    this._initDescription();

    this.visible = false;
  }

  _initBackground() {
    const background = this._background = new DisplayObject();
    this.add(background);
  }

  _initIcon() {
    const iconText = this._iconText = new TextField('🎃', 'halloween_spooky', 0xffffff, 60);
    this.add(iconText);

    iconText.alignAnchor(0.5, 0.5);
    iconText.x = -200;
  }

  _initTitle() {
    const titleText = this._titleText = new TextField('Achievement Unlocked!', 'halloween_spooky', 0xffaa00, 40);
    this.add(titleText);

    titleText.alignAnchor(0, 0.5);
    titleText.x = -150;
    titleText.y = -20;

    titleText.dropShadow = true;
    titleText.shadowBlur = 2;
    titleText.shadowAlpha = 0.6;
    titleText.shadowDistanceX = 2;
    titleText.shadowDistanceY = 2;
  }

  _initDescription() {
    const descriptionText = this._descriptionText = new TextField('Description', 'halloween_spooky', 0xcccccc, 28);
    this.add(descriptionText);

    descriptionText.alignAnchor(0, 0.5);
    descriptionText.x = -150;
    descriptionText.y = 20;
  }
}
