# Ghost Dodger - Project Context

## Project Overview
A spooky Halloween-themed 3D game built with Three.js and Black Engine for the Kiroween hackathon. Players control a pumpkin character navigating through a Halloween environment, dodging ghosts, collecting candy, and avoiding obstacles.

## Technology Stack
- **3D Graphics**: Three.js for WebGL rendering
- **Game Engine**: Black Engine for game logic and entity management
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Custom UI system with Black Engine
- **Audio**: Web Audio API for spooky sound effects

## Development Guidelines

### Code Style
- Use ES6+ module syntax
- Keep components modular and reusable
- Maintain separation between 3D scene logic and UI logic
- Use event-driven architecture for component communication

### Halloween Theme Requirements
- All visual elements should have a spooky/Halloween aesthetic
- Color palette: oranges, purples, blacks, and dark greens
- Sound effects should enhance the haunted atmosphere
- UI should be polished and thematically consistent

### Performance Targets
- Maintain 60 FPS on desktop
- Optimize for mobile devices
- Lazy load assets where possible
- Use efficient collision detection

## Architecture
- `src/core/` - Core game engine setup and configuration
- `src/scene/` - 3D scene management and game objects
- `src/ui/` - User interface components
- `public/` - Static assets (models, textures, audio)
