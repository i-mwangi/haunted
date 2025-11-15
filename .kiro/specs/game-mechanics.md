# Game Mechanics Specification

## Overview
Specification for the core gameplay mechanics of Haunted Pumpkin, a Halloween-themed arcade game.

## Player Character
- 3D pumpkin model as the player character
- Smooth movement in 4 directions (up, down, left, right)
- Responsive to both keyboard and touch/pointer controls
- Visual feedback on movement and collisions

## Game Field
- Bounded 3D playing area
- Collision detection at boundaries
- Halloween-themed environment (fog, lighting, decorations)
- Dynamic obstacles that appear based on round progression

## Collectibles System

### Types
1. **Score Items**: Regular collectibles that increase score
2. **Power-ups**: Special items with temporary effects
   - Invulnerability booster (temporary immunity)
   - Speed boost (faster movement)

### Behavior
- Spawn at random positions within game field
- Animate/rotate for visibility
- Despawn after collection with visual effect
- Trigger UI feedback on collection

## Lives System
- Player starts with 3 lives
- Lose a life on collision with obstacles
- Game over when lives reach 0
- Visual indicator in UI showing remaining lives

## Scoring
- Points awarded for collecting items
- Bonus points for consecutive collections
- Score multiplier during power-up states
- High score tracking (future enhancement)

## Round Progression
- Difficulty increases with each round
- More obstacles spawn over time
- Faster obstacle movement in later rounds
- Visual indication of round changes

## Controls

### Keyboard
- Arrow keys or WASD for movement
- Space for special actions (if implemented)
- ESC for pause menu (future enhancement)

### Touch/Pointer
- Tap/click to move toward pointer position
- Drag for continuous movement
- Touch-friendly UI buttons for mobile

## Audio
- Background spooky music
- Sound effects for:
  - Collectible pickup
  - Power-up activation
  - Collision/damage
  - Game over
- Mute toggle in UI

## Implementation Notes
- Use Three.js for 3D rendering
- Black Engine for game state management
- Event-driven architecture for loose coupling
- Optimize for 60 FPS performance
