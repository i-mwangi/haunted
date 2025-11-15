const SCENE_CONFIG = {
  backgroundColor: 0x0a0a15, // Dark blue-black for spooky night atmosphere
  antialias: true,
  fxaaPass: false,
  maxPixelRatio: 2,
  isMobile: false,
  fov: {
    desktop: 50,
    mobile: {
      portrait: 60,
      landscape: 38,
    },
  },
  fog: {
    enabled: true,
    color: 0x1a0f2e, // Dark purple fog for supernatural atmosphere
    desktop: { near: 16, far: 20 },
    mobile: { 
      portrait: { near: 21, far: 25.5 },
      landscape: { near: 16, far: 20 },
    },
  }
};

export default SCENE_CONFIG;
