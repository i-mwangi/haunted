import { MessageDispatcher } from 'black-engine';

export default class ComboSystem {
  constructor() {
    this.events = new MessageDispatcher();

    this._combo = 0;
    this._comboTimer = 0;
    this._comboTimeout = 2.0; // 2 seconds to maintain combo
    this._comboMultiplier = 1;
    this._isActive = false;
  }

  update(dt) {
    if (!this._isActive) return;

    this._comboTimer -= dt;

    if (this._comboTimer <= 0) {
      this._resetCombo();
    }
  }

  onCollect() {
    this._combo++;
    this._comboTimer = this._comboTimeout;
    this._isActive = true;

    // Calculate multiplier (1x, 2x, 3x, 4x, 5x max)
    this._comboMultiplier = Math.min(Math.floor(this._combo / 3) + 1, 5);

    this.events.post('comboChanged', this._combo, this._comboMultiplier);

    // Show combo text for significant milestones
    if (this._combo === 3 || this._combo === 6 || this._combo === 9 || this._combo === 12 || this._combo === 15) {
      this.events.post('comboMilestone', this._comboMultiplier);
    }
  }

  getMultiplier() {
    return this._comboMultiplier;
  }

  getCombo() {
    return this._combo;
  }

  reset() {
    this._resetCombo();
  }

  _resetCombo() {
    if (this._combo > 0) {
      this.events.post('comboLost', this._combo);
    }

    this._combo = 0;
    this._comboMultiplier = 1;
    this._isActive = false;
    this.events.post('comboChanged', 0, 1);
  }
}
