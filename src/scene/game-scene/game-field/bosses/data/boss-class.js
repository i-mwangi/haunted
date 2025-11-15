import { BOSS_TYPE } from './boss-data';
import EvilPumpkinBoss from '../evil-pumpkin-boss';

const BOSS_CLASS = {
  [BOSS_TYPE.EvilPumpkin]: EvilPumpkinBoss,
};

export default BOSS_CLASS;
