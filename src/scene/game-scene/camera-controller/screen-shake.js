import * as THREE from 'three';

export default class ScreenShake {
  constructor(camera) {
    this._camera = camera;
    this._originalPosition = new THREE.Vector3();
    this._shakeIntensity = 0;
    this._shakeDuration = 0;
    this._shakeTime = 0;
    this._isShaking = false;
  }

  update(dt) {
    if (!this._isShaking) return;

    this._shakeTime += dt;

    if (this._shakeTime >= this._shakeDuration) {
      this._stopShake();
      return;
    }

    // Decay shake intensity over time
    const progress = this._shakeTime / this._shakeDuration;
    const currentIntensity = this._shakeIntensity * (1 - progress);

    // Random shake offset
    const offsetX = (Math.random() - 0.5) * currentIntensity;
    const offsetY = (Math.random() - 0.5) * currentIntensity;
    const offsetZ = (Math.random() - 0.5) * currentIntensity * 0.5;

    this._camera.position.x = this._originalPosition.x + offsetX;
    this._camera.position.y = this._originalPosition.y + offsetY;
    this._camera.position.z = this._originalPosition.z + offsetZ;
  }

  shake(intensity = 0.1, duration = 0.3) {
    if (!this._isShaking) {
      this._originalPosition.copy(this._camera.position);
    }

    this._shakeIntensity = Math.max(this._shakeIntensity, intensity);
    this._shakeDuration = duration;
    this._shakeTime = 0;
    this._isShaking = true;
  }

  _stopShake() {
    this._camera.position.copy(this._originalPosition);
    this._isShaking = false;
    this._shakeIntensity = 0;
    this._shakeTime = 0;
  }

  reset() {
    if (this._isShaking) {
      this._stopShake();
    }
  }
}
