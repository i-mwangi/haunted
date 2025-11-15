import * as THREE from 'three';

export default class ChristmasLights extends THREE.Group {
  constructor(treeMesh) {
    super();

    this._treeMesh = treeMesh;
    this._lights = [];
    this._lightMeshes = [];
    this._time = 0;

    this._config = {
      colors: [
        0xff0000, // Red
        0x00ff00, // Green
        0x0000ff, // Blue
        0xffff00, // Yellow
        0xff00ff, // Magenta
        0x00ffff, // Cyan
        0xffffff, // White
      ],
      lightsPerRing: 8,
      rings: 6,
      lightSize: 0.08,
      glowIntensity: 2,
      twinkleSpeed: 2,
      spiralTightness: 1.5,
    };

    this._init();
  }

  update(dt) {
    this._time += dt;
    this._updateLightAnimation();
  }

  _init() {
    this._createLights();
  }

  _createLights() {
    const bbox = new THREE.Box3().setFromObject(this._treeMesh);
    const height = bbox.max.y - bbox.min.y;
    const baseRadius = Math.max(bbox.max.x - bbox.min.x, bbox.max.z - bbox.min.z) / 2;
    const centerX = (bbox.max.x + bbox.min.x) / 2;
    const centerZ = (bbox.max.z + bbox.min.z) / 2;
    const baseY = bbox.min.y;

    // Create lights in a spiral pattern around the tree
    for (let ring = 0; ring < this._config.rings; ring++) {
      const ringHeight = baseY + (height * (ring + 1) / (this._config.rings + 1));
      const ringRadius = baseRadius * (1 - ring / this._config.rings) * 0.8;

      for (let i = 0; i < this._config.lightsPerRing; i++) {
        const angle = (i / this._config.lightsPerRing) * Math.PI * 2 + (ring * this._config.spiralTightness);
        const x = centerX + Math.cos(angle) * ringRadius;
        const z = centerZ + Math.sin(angle) * ringRadius;

        const colorIndex = (ring * this._config.lightsPerRing + i) % this._config.colors.length;
        const color = this._config.colors[colorIndex];

        this._createLight(x, ringHeight, z, color, ring, i);
      }
    }
  }

  _createLight(x, y, z, color, ring, index) {
    // Create light bulb geometry
    const geometry = new THREE.SphereGeometry(this._config.lightSize, 8, 8);
    
    // Create emissive material for the light
    const material = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: this._config.glowIntensity,
      metalness: 0.2,
      roughness: 0.3,
    });

    const lightMesh = new THREE.Mesh(geometry, material);
    lightMesh.position.set(x, y, z);
    lightMesh.castShadow = false;
    lightMesh.receiveShadow = false;

    // Add point light for actual illumination
    const pointLight = new THREE.PointLight(color, 0.5, 1);
    pointLight.position.set(x, y, z);

    this.add(lightMesh);
    this.add(pointLight);

    this._lightMeshes.push(lightMesh);
    this._lights.push({
      mesh: lightMesh,
      pointLight: pointLight,
      material: material,
      baseColor: color,
      ring: ring,
      index: index,
      phase: Math.random() * Math.PI * 2, // Random starting phase for twinkling
    });
  }

  _updateLightAnimation() {
    this._lights.forEach((light, i) => {
      // Create twinkling effect with sine wave
      const twinkle = Math.sin(this._time * this._config.twinkleSpeed + light.phase) * 0.5 + 0.5;
      
      // Vary intensity between lights for more dynamic effect
      const offset = Math.sin(this._time * 0.5 + i * 0.5) * 0.3 + 0.7;
      const intensity = twinkle * offset * this._config.glowIntensity;

      light.material.emissiveIntensity = intensity;
      light.pointLight.intensity = intensity * 0.5;

      // Occasional bright flash
      if (Math.random() < 0.001) {
        light.material.emissiveIntensity = this._config.glowIntensity * 2;
        light.pointLight.intensity = 1;
      }
    });
  }

  setEnabled(enabled) {
    this.visible = enabled;
  }

  dispose() {
    this._lights.forEach(light => {
      light.mesh.geometry.dispose();
      light.mesh.material.dispose();
    });
    this._lights = [];
    this._lightMeshes = [];
  }
}
