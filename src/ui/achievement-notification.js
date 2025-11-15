import { Black, DisplayObject, TextField, FontAlign, FontStyle, Graphics } from 'black-engine';
import TWEEN from 'three/addons/libs/tween.module.js';

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
    this._animateIn(() => {
      setTimeout(() => {
        this._animateOut(() => {
          this._showNext();
        });
      }, 3000);
    });
  }

  _init() {
    this._initBackground();
    this._initIconText();
    this._initTitleText();
    this._initDescriptionText();
    this.visible = false;
  }

  _initBackground() {
    const background = this._background = new Graphics();
    this.add(background);

    background.fillStyle(0x000000, 0.9);
    background.rect(-200, -60, 400, 120);
    background.fill();

    // Border
    background.lineStyle(3, 0xffaa44, 1);
    background.rect(-200, -60, 400, 120);
    background.stroke();
  }

  _initIconText() {
    const iconText = this._iconText = new TextField();
    this.add(iconText);

    iconText.fontFamily = 'Arial';
    iconText.fontSize = 48;
    iconText.text = '🏆';
    iconText.x = -160;
    iconText.y = -20;
  }

  _initTitleText() {
    const titleText = this._titleText = new TextField();
    this.add(titleText);

    titleText.fontFamily = 'AlarmClock, Arial';
    titleText.fontSize = 28;
    titleText.color = 0xffaa44;
    titleText.style = FontStyle.BOLD;
    titleText.text = 'Achievement Unlocked!';
    titleText.x = -90;
    titleText.y = -30;
  }

  _initDescriptionText() {
    const descriptionText = this._descriptionText = new TextField();
    this.add(descriptionText);

    descriptionText.fontFamily = 'Arial';
    descriptionText.fontSize = 18;
    descriptionText.color = 0xffffff;
    descriptionText.text = 'Description here';
    descriptionText.x = -90;
    descriptionText.y = 5;
  }

  _animateIn(callback) {
    this.x = -500;
    this.alpha = 0;

    const pos = { x: -500 };
    const alpha = { value: 0 };

    new TWEEN.Tween(pos)
      .to({ x: 0 }, 500)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(() => {
        this.x = pos.x;
      })
      .onComplete(callback)
      .start();

    new TWEEN.Tween(alpha)
      .to({ value: 1 }, 300)
      .onUpdate(() => {
        this.alpha = alpha.value;
      })
      .start();
  }

  _animateOut(callback) {
    const pos = { x: this.x };
    const alpha = { value: this.alpha };

    new TWEEN.Tween(pos)
      .to({ x: -500 }, 400)
      .easing(TWEEN.Easing.Back.In)
      .onUpdate(() => {
        this.x = pos.x;
      })
      .onComplete(() => {
        this.visible = false;
        if (callback) callback();
      })
      .start();

    new TWEEN.Tween(alpha)
      .to({ value: 0 }, 300)
      .onUpdate(() => {
        this.alpha = alpha.value;
      })
      .start();
  }
}
