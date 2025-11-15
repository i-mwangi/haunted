import { Black, DisplayObject, Graphics, TextField, FontAlign, FontStyle } from 'black-engine';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class BossHealthBar extends DisplayObject {
  constructor() {
    super();

    this._background = null;
    this._healthBar = null;
    this._bossNameText = null;
    this._healthText = null;
    this._currentHealth = 5;
    this._maxHealth = 5;
    this._barWidth = 400;
    this._barHeight = 30;

    this._init();
  }

  show(maxHealth) {
    this._maxHealth = maxHealth;
    this._currentHealth = maxHealth;
    this._updateHealthBar();
    this.visible = true;
    this._animateIn();
  }

  hide() {
    this._animateOut();
  }

  updateHealth(health, maxHealth) {
    this._currentHealth = health;
    this._maxHealth = maxHealth;
    this._updateHealthBar();
    this._animateDamage();
  }

  _init() {
    this._initBackground();
    this._initHealthBar();
    this._initBossNameText();
    this._initHealthText();
    this.visible = false;
  }

  _initBackground() {
    const background = this._background = new Graphics();
    this.add(background);

    background.fillStyle(0x000000, 0.7);
    background.rect(-this._barWidth / 2, 0, this._barWidth, this._barHeight);
    background.fill();
  }

  _initHealthBar() {
    const healthBar = this._healthBar = new Graphics();
    this.add(healthBar);

    this._updateHealthBar();
  }

  _updateHealthBar() {
    this._healthBar.clear();

    const healthPercent = this._currentHealth / this._maxHealth;
    const barWidth = (this._barWidth - 8) * healthPercent;

    // Color based on health
    let color = 0xff3333; // Red
    if (healthPercent > 0.6) {
      color = 0xff8c42; // Orange
    } else if (healthPercent > 0.3) {
      color = 0xffaa44; // Yellow
    }

    this._healthBar.fillStyle(color, 1);
    this._healthBar.rect(-this._barWidth / 2 + 4, 4, barWidth, this._barHeight - 8);
    this._healthBar.fill();

    // Update health text
    if (this._healthText) {
      this._healthText.text = `${this._currentHealth} / ${this._maxHealth}`;
    }
  }

  _initBossNameText() {
    const bossNameText = this._bossNameText = new TextField();
    this.add(bossNameText);

    bossNameText.fontFamily = 'AlarmClock, Arial';
    bossNameText.fontSize = 28;
    bossNameText.color = 0xff3333;
    bossNameText.align = FontAlign.CENTER;
    bossNameText.style = FontStyle.BOLD;
    bossNameText.text = '👹 EVIL PUMPKIN BOSS 👹';
    bossNameText.y = -35;
  }

  _initHealthText() {
    const healthText = this._healthText = new TextField();
    this.add(healthText);

    healthText.fontFamily = 'AlarmClock, Arial';
    healthText.fontSize = 20;
    healthText.color = 0xffffff;
    healthText.align = FontAlign.CENTER;
    healthText.text = '5 / 5';
    healthText.y = 5;
  }

  _animateIn() {
    this.y = -100;
    this.alpha = 0;

    const pos = { y: -100 };
    const alpha = { value: 0 };

    new TWEEN.Tween(pos)
      .to({ y: 0 }, 500)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(() => {
        this.y = pos.y;
      })
      .start();

    new TWEEN.Tween(alpha)
      .to({ value: 1 }, 300)
      .onUpdate(() => {
        this.alpha = alpha.value;
      })
      .start();
  }

  _animateOut() {
    const pos = { y: this.y };
    const alpha = { value: this.alpha };

    new TWEEN.Tween(pos)
      .to({ y: -100 }, 400)
      .easing(TWEEN.Easing.Back.In)
      .onUpdate(() => {
        this.y = pos.y;
      })
      .start();

    new TWEEN.Tween(alpha)
      .to({ value: 0 }, 300)
      .onUpdate(() => {
        this.alpha = alpha.value;
      })
      .onComplete(() => {
        this.visible = false;
      })
      .start();
  }

  _animateDamage() {
    const scale = { value: 1 };

    new TWEEN.Tween(scale)
      .to({ value: 1.1 }, 100)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(() => {
        this._healthBar.scaleX = scale.value;
        this._healthBar.scaleY = scale.value;
      })
      .chain(
        new TWEEN.Tween(scale)
          .to({ value: 1 }, 100)
          .easing(TWEEN.Easing.Cubic.In)
          .onUpdate(() => {
            this._healthBar.scaleX = scale.value;
            this._healthBar.scaleY = scale.value;
          })
      )
      .start();
  }
}
