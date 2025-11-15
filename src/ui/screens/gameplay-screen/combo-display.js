import { Black, DisplayObject, TextField, FontAlign, FontStyle } from 'black-engine';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class ComboDisplay extends DisplayObject {
  constructor() {
    super();

    this._comboText = null;
    this._multiplierText = null;
    this._milestoneText = null;
    this._currentCombo = 0;
    this._currentMultiplier = 1;

    this._init();
  }

  onComboChanged(combo, multiplier) {
    this._currentCombo = combo;
    this._currentMultiplier = multiplier;

    if (combo === 0) {
      this._hide();
    } else {
      this._show();
      this._updateText();
      this._animatePulse();
    }
  }

  onComboMilestone(multiplier) {
    this._showMilestone(multiplier);
  }

  onComboLost(combo) {
    if (combo > 5) {
      this._showLostText(combo);
    }
  }

  _init() {
    this._initComboText();
    this._initMultiplierText();
    this._initMilestoneText();
    this._hide();
  }

  _initComboText() {
    const comboText = this._comboText = new TextField();
    this.add(comboText);

    comboText.fontFamily = 'AlarmClock, Arial';
    comboText.fontSize = 32;
    comboText.color = 0xffaa44;
    comboText.align = FontAlign.CENTER;
    comboText.style = FontStyle.BOLD;
    comboText.text = 'COMBO x1';
  }

  _initMultiplierText() {
    const multiplierText = this._multiplierText = new TextField();
    this.add(multiplierText);

    multiplierText.fontFamily = 'AlarmClock, Arial';
    multiplierText.fontSize = 24;
    multiplierText.color = 0x44ff44;
    multiplierText.align = FontAlign.CENTER;
    multiplierText.y = 40;
    multiplierText.text = 'x1 SCORE';
  }

  _initMilestoneText() {
    const milestoneText = this._milestoneText = new TextField();
    this.add(milestoneText);

    milestoneText.fontFamily = 'AlarmClock, Arial';
    milestoneText.fontSize = 48;
    milestoneText.color = 0xff3333;
    milestoneText.align = FontAlign.CENTER;
    milestoneText.style = FontStyle.BOLD;
    milestoneText.y = -60;
    milestoneText.visible = false;
  }

  _updateText() {
    this._comboText.text = `COMBO x${this._currentCombo}`;
    this._multiplierText.text = `x${this._currentMultiplier} SCORE`;

    // Change color based on multiplier
    if (this._currentMultiplier >= 5) {
      this._comboText.color = 0xff3333; // Red for max
      this._multiplierText.color = 0xff3333;
    } else if (this._currentMultiplier >= 3) {
      this._comboText.color = 0xff8c42; // Orange for high
      this._multiplierText.color = 0xff8c42;
    } else {
      this._comboText.color = 0xffaa44; // Gold for normal
      this._multiplierText.color = 0x44ff44;
    }
  }

  _animatePulse() {
    const scale = { value: 1 };

    new TWEEN.Tween(scale)
      .to({ value: 1.2 }, 100)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(() => {
        this._comboText.scaleX = scale.value;
        this._comboText.scaleY = scale.value;
      })
      .chain(
        new TWEEN.Tween(scale)
          .to({ value: 1 }, 100)
          .easing(TWEEN.Easing.Sinusoidal.Out)
          .onUpdate(() => {
            this._comboText.scaleX = scale.value;
            this._comboText.scaleY = scale.value;
          })
      )
      .start();
  }

  _showMilestone(multiplier) {
    this._milestoneText.text = `x${multiplier} MULTIPLIER!`;
    this._milestoneText.visible = true;
    this._milestoneText.alpha = 1;
    this._milestoneText.scaleX = 0.5;
    this._milestoneText.scaleY = 0.5;

    const scale = { value: 0.5 };
    const alpha = { value: 1 };

    new TWEEN.Tween(scale)
      .to({ value: 1.3 }, 200)
      .easing(TWEEN.Easing.Back.Out)
      .onUpdate(() => {
        this._milestoneText.scaleX = scale.value;
        this._milestoneText.scaleY = scale.value;
      })
      .chain(
        new TWEEN.Tween(scale)
          .to({ value: 1 }, 100)
          .easing(TWEEN.Easing.Sinusoidal.Out)
          .onUpdate(() => {
            this._milestoneText.scaleX = scale.value;
            this._milestoneText.scaleY = scale.value;
          })
          .chain(
            new TWEEN.Tween(alpha)
              .to({ value: 0 }, 500)
              .delay(500)
              .easing(TWEEN.Easing.Sinusoidal.In)
              .onUpdate(() => {
                this._milestoneText.alpha = alpha.value;
              })
              .onComplete(() => {
                this._milestoneText.visible = false;
              })
          )
      )
      .start();
  }

  _showLostText(combo) {
    this._milestoneText.text = `COMBO LOST! (${combo})`;
    this._milestoneText.color = 0xff3333;
    this._milestoneText.visible = true;
    this._milestoneText.alpha = 1;
    this._milestoneText.scaleX = 1;
    this._milestoneText.scaleY = 1;

    const alpha = { value: 1 };

    new TWEEN.Tween(alpha)
      .to({ value: 0 }, 800)
      .delay(300)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onUpdate(() => {
        this._milestoneText.alpha = alpha.value;
      })
      .onComplete(() => {
        this._milestoneText.visible = false;
      })
      .start();
  }

  _show() {
    this.visible = true;
  }

  _hide() {
    this.visible = false;
  }
}
