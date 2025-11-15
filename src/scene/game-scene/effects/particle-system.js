import * as THREE from 'three';

export default class ParticleSystem extends THREE.Group {
  constructor() {
    super();

    this._particlePools = new Map();
    this._activeParticles = [];

    this._init();
  }

  update(dt) {
    for (let i = this._activeParticles.length - 1; i >= 0; i--) {
      const particle = this._activeParticles[i];
      
      particle.life -= dt;
      
      if (particle.life <= 0) {
        this._returnParticleToPool(particle);
        this._activeParticles.splice(i, 1);
        continue;
      }

      // Update particle
      particle.velocity.y += particle.gravity * dt;
      particle.mesh.position.add(particle.velocity.clone().multiplyScalar(dt));
      
      // Fade out
      const lifeRatio = particle.life / particle.maxLife;
      particle.mesh.material.opacity = lifeRatio;
      
      // Scale animation
      const scale = particle.startScale * (0.5 + lifeRatio * 0.5);
      particle.mesh.scale.setScalar(scale);
    }
  }

  emitBurst(position, color, count = 20, config = {}) {
    const {
      speed = 3,
      spread = 1,
      size = 0.1,
      life = 0.8,
      gravity = -5
    } = config;

    for (let i = 0; i < count; i++) {
      const particle = this._getParticle();
      
      particle.mesh.position.copy(position);
      particle.mesh.material.color.setHex(color);
      particle.mesh.material.opacity = 1;
      
      // Random velocity
      const angle = Math.random() * Math.PI * 2;
      const elevation = Math.random() * Math.PI * 0.5;
      const velocity = speed * (0.5 + Math.random() * 0.5);
      
      particle.velocity.set(
        Math.cos(angle) * Math.cos(elevation) * velocity * spread,
        Math.sin(elevation) * velocity,
        Math.sin(angle) * Math.cos(elevation) * velocity * spread
      );
      
      particle.gravity = gravity;
      particle.life = life * (0.8 + Math.random() * 0.4);
      particle.maxLife = particle.life;
      particle.startScale = size * (0.8 + Math.random() * 0.4);
      particle.mesh.scale.setScalar(particle.startScale);
      
      this._activeParticles.push(particle);
      this.add(particle.mesh);
    }
  }

  emitTrail(position, color, count = 5) {
    this.emitBurst(position, color, count, {
      speed: 1,
      spread: 0.3,
      size: 0.05,
      life: 0.3,
      gravity: 0
    });
  }

  emitExplosion(position, color, count = 30) {
    this.emitBurst(position, color, count, {
      speed: 5,
      spread: 1.5,
      size: 0.15,
      life: 1.0,
      gravity: -8
    });
  }

  emitGlow(position, color, count = 10) {
    this.emitBurst(position, color, count, {
      speed: 0.5,
      spread: 0.5,
      size: 0.2,
      life: 0.5,
      gravity: 1
    });
  }

  _init() {
    // Pre-create particle pool
    this._createParticlePool('default', 200);
  }

  _createParticlePool(type, count) {
    const pool = [];
    
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.SphereGeometry(1, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 1,
        depthWrite: false
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      pool.push({
        mesh,
        velocity: new THREE.Vector3(),
        gravity: 0,
        life: 0,
        maxLife: 0,
        startScale: 1,
        inUse: false
      });
    }
    
    this._particlePools.set(type, pool);
  }

  _getParticle(type = 'default') {
    const pool = this._particlePools.get(type);
    
    for (const particle of pool) {
      if (!particle.inUse) {
        particle.inUse = true;
        return particle;
      }
    }
    
    // If no particles available, create a new one
    const geometry = new THREE.SphereGeometry(1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
      depthWrite: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    const particle = {
      mesh,
      velocity: new THREE.Vector3(),
      gravity: 0,
      life: 0,
      maxLife: 0,
      startScale: 1,
      inUse: true
    };
    
    pool.push(particle);
    return particle;
  }

  _returnParticleToPool(particle) {
    particle.inUse = false;
    this.remove(particle.mesh);
  }

  dispose() {
    for (const pool of this._particlePools.values()) {
      for (const particle of pool) {
        particle.mesh.geometry.dispose();
        particle.mesh.material.dispose();
      }
    }
    
    this._particlePools.clear();
    this._activeParticles = [];
  }
}
