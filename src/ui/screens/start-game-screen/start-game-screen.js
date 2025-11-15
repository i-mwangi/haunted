import { Black, Ease, Sprite, TextField, Tween } from "black-engine";
import ScreenAbstract from "../screen-abstract";
import SCENE_CONFIG from "../../../core/configs/scene-config";

export default class StartGameScreen extends ScreenAbstract {
  constructor() {
    super();

    this._startGameButton = null;
    this._achievementsButton = null;

    this.touchable = true;
  }

  show() {
    console.log('StartGameScreen.show() called');
    super.show();

    this._animateStartGameButton();
    
    // Ensure buttons are touchable when shown
    this._startGameButton.touchable = true;
    this._achievementsButton.touchable = true;
    
    console.log('Start button touchable:', this._startGameButton.touchable);
    console.log('Achievements button touchable:', this._achievementsButton.touchable);
  }

  hide() {
    super.hide();

    this._startGameButton.removeComponent(this._startGameButton.getComponent(Tween));
    this._startGameButton.scale = 1;
  }

  _init() {
    this._initLogo();
    this._initStartGameButton();
    this._initAchievementsButton();
    this._initSignals();
  }

  _initAchievementsButton() {
    const achievementsButton = this._achievementsButton = new TextField('🏆 Achievements', 'halloween_spooky', 0xffaa00, 50);
    this.add(achievementsButton);

    achievementsButton.dropShadow = true;
    achievementsButton.shadowBlur = 1;
    achievementsButton.shadowAlpha = 0.4;
    achievementsButton.shadowDistanceX = 3;
    achievementsButton.shadowDistanceY = 3;

    achievementsButton.alignAnchor(0.5, 0.5);
    achievementsButton.touchable = true;
  }

  _initLogo() {
    const logo = this._logo = new Sprite('logo');
    this.add(logo);

    logo.alignPivot();
  }

  _initStartGameButton() {
    const startGameButton = this._startGameButton = new TextField('Start Game', 'halloween_spooky', 0x008800, 100);
    this.add(startGameButton);

    startGameButton.dropShadow = true;
    startGameButton.shadowBlur = 1;
    startGameButton.shadowAlpha = 0.4;
    startGameButton.shadowDistanceX = 4;
    startGameButton.shadowDistanceY = 4;

    startGameButton.alignAnchor(0.5, 0.5);
    startGameButton.touchable = true;
  }

  _animateStartGameButton() {
    const tween = new Tween({ scale: 1.03 }, 0.8, { ease: Ease.sinusoidalInOut, loop: true, yoyo: true });
    this._startGameButton.add(tween);
  }

  _initSignals() {
    this._startGameButton.on('pointerDown', () => {
      console.log('Start game button clicked');
      this.post('onStartGame');
    });
    
    this._achievementsButton.on('pointerDown', () => {
      console.log('Achievements button clicked');
      this.post('onViewAchievements');
    });

    this._startGameButton.on('pointerMove', () => {
      Black.engine.containerElement.style.cursor = 'pointer';
    });

    this._achievementsButton.on('pointerMove', () => {
      Black.engine.containerElement.style.cursor = 'pointer';
    });
  }

  _onResize() {
    const bounds = Black.stage.bounds;

    this._logo.x = bounds.left + bounds.width * 0.5;
    this._logo.y = bounds.top + bounds.height * 0.3;

    this._startGameButton.x = bounds.left + bounds.width * 0.5;
    this._startGameButton.y = bounds.top + bounds.height * 0.65;

    this._achievementsButton.x = bounds.left + bounds.width * 0.5;
    this._achievementsButton.y = bounds.top + bounds.height * 0.8;

    if (SCENE_CONFIG.isMobile) {
      if (window.innerWidth < window.innerHeight) {
        this._logo.scale = 0.6;
      } else {
        this._logo.scale = 1;
      }
    }
  }
}
