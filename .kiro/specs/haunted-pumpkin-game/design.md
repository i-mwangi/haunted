# Haunted Pumpkin Game - Design Document

## Visual Design

### Art Direction
**Theme**: Spooky-but-fun Halloween aesthetic that's atmospheric without being scary
**Mood**: Playful darkness, nostalgic Halloween vibes, arcade game energy

### Color Palette
```
Primary Colors:
- Pumpkin Orange: #FF6B35 (player character, UI accents)
- Deep Purple: #6B2D5C (shadows, secondary UI)
- Haunted Green: #2D5016 (environmental accents)

Background Colors:
- Midnight Black: #1A1A1A (primary background)
- Dark Gray: #2A2A2A (UI backgrounds)
- Fog Gray: #4A4A4A (atmospheric effects)

Accent Colors:
- Ghost White: #F5F5F5 (text, highlights)
- Blood Red: #8B0000 (danger, life loss)
- Magic Gold: #FFD700 (collectibles, power-ups)
```

### Typography
- **Title Font**: Creepy/Halloween display font (e.g., "Creepster", "Nosifer")
- **UI Font**: Clean sans-serif (e.g., "Inter", "Roboto") for readability
- **Score Font**: Bold monospace for game stats

### 3D Environment Design

#### Game Field
- Bounded rectangular playing area (20x20 units)
- Dark ground plane with subtle texture
- Atmospheric fog for depth
- Ambient purple/orange lighting
- Particle effects (floating leaves, sparkles)

#### Player Character (Pumpkin)
- Classic jack-o'-lantern design
- Glowing eyes and mouth (emissive material)
- Slight bobbing animation when idle
- Rotation animation during movement
- Scale pulse on power-up collection

#### Obstacles
- Ghostly apparitions (semi-transparent)
- Floating skulls
- Dark tombstones
- Animated with floating/rotating motion
- Glow effects for visibility

#### Collectibles
- **Score Items**: Candy corn, small pumpkins
- **Power-ups**: Glowing orbs with particle trails
- Rotating animation
- Pulsing glow effect
- Particle burst on collection

### UI Design

#### Main Menu
```
┌─────────────────────────────────┐
│                                 │
│      🎃 HAUNTED PUMPKIN 🎃     │
│                                 │
│        [  START GAME  ]         │
│                                 │
│              [🔊]               │
│                                 │
└─────────────────────────────────┘
```

#### Game HUD
```
┌─────────────────────────────────┐
│ SCORE: 1250        ❤️ ❤️ ❤️      │
│                                 │
│                                 │
│         [GAME AREA]             │
│                                 │
│                                 │
│     ⚡ INVULNERABLE: 5s         │
└─────────────────────────────────┘
```

#### Game Over Screen
```
┌─────────────────────────────────┐
│                                 │
│         GAME OVER 👻            │
│                                 │
│      FINAL SCORE: 1250          │
│                                 │
│        [  PLAY AGAIN  ]         │
│                                 │
└─────────────────────────────────┘
```

## Technical Architecture

### System Overview
```
┌─────────────────────────────────────┐
│         index.html                  │
│         main.js (entry)             │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────────┐    ┌──────▼──────┐
│ BaseScene  │    │  Analytics  │
│  (core)    │    │   (Vercel)  │
└───┬────────┘    └─────────────┘
    │
┌───▼──────────────────────────────┐
│      MainScene                   │
│  (orchestration layer)           │
└───┬──────────────┬───────────────┘
    │              │
┌───▼────────┐ ┌──▼──────────┐
│  Scene3D   │ │     UI      │
│ (Three.js) │ │  (Black)    │
└───┬────────┘ └──┬──────────┘
    │              │
    │   Events     │
    └──────┬───────┘
           │
    Message Dispatcher
```

### Component Architecture

#### Scene3D (3D Game World)
```
Scene3D
├── GameScene
│   ├── CameraController
│   ├── Environment (lighting, fog)
│   ├── GameField
│   │   ├── Player (pumpkin)
│   │   ├── Obstacles
│   │   ├── Collectibles
│   │   └── CollisionDetection
│   └── RaycasterController
└── AudioManager
```

#### UI (2D Interface)
```
UI
├── MainMenu
├── HUD
│   ├── ScoreDisplay
│   ├── LivesDisplay
│   └── BoosterDisplay
├── Tutorial
├── GameOver
└── SoundToggle
```

### Data Flow

#### Input Flow
```
User Input (keyboard/touch)
    ↓
UI Component
    ↓
Event Emission
    ↓
MainScene (routing)
    ↓
Scene3D (game logic)
    ↓
Game State Update
```

#### Game State Flow
```
Game State Change
    ↓
Scene3D Event Emission
    ↓
MainScene (routing)
    ↓
UI Component
    ↓
Visual Update
```

## Game Mechanics Design

### Player Movement
- **Speed**: 5 units/second base speed
- **Acceleration**: Instant (arcade-style)
- **Boundaries**: Hard stop at field edges
- **Mobile**: Move toward touch/click position

### Collision System
- **Detection**: Bounding box collision
- **Player vs Obstacles**: Lose life, brief invulnerability (1s)
- **Player vs Collectibles**: Instant collection, score increase
- **Feedback**: Visual flash, sound effect, particle burst

### Scoring System
```
Regular Collectible: +10 points
Power-up Collection: +25 points
Consecutive Collection Bonus: +5 per streak
Round Completion: +100 points
```

### Lives System
- Start with 3 lives
- Lose 1 life per obstacle collision
- Brief invulnerability after hit (1 second)
- Visual feedback: screen flash, life icon removal
- Game over at 0 lives

### Power-up System

#### Invulnerability Booster
- Duration: 10 seconds
- Effect: No damage from obstacles
- Visual: Glowing aura around player
- UI: Timer countdown display

### Round Progression
```
Round 1: 3 obstacles, slow speed
Round 2: 5 obstacles, medium speed
Round 3: 7 obstacles, fast speed
Round 4+: +2 obstacles per round, max speed
```

## Audio Design

### Music
- **Main Menu**: Ambient spooky atmosphere (low intensity)
- **Gameplay**: Upbeat Halloween theme (medium intensity)
- **Game Over**: Dramatic sting followed by calm theme

### Sound Effects
- **Collectible Pickup**: Cheerful chime
- **Power-up Activation**: Magical whoosh
- **Collision**: Spooky impact sound
- **Life Lost**: Ghostly wail
- **Game Over**: Dramatic organ chord
- **UI Click**: Subtle click sound

### Audio Implementation
- Background music loops seamlessly
- Sound effects layer over music
- Volume balancing (music 60%, SFX 100%)
- Fade in/out for smooth transitions
- Mute state persists in localStorage

## Animation Design

### Player Animations
- **Idle**: Gentle bobbing (0.5s cycle)
- **Move**: Rotation in movement direction
- **Collect**: Quick scale pulse (1.2x → 1.0x)
- **Hit**: Red flash + shake
- **Power-up**: Continuous glow pulse

### Collectible Animations
- **Idle**: Rotation (2s cycle) + vertical float
- **Spawn**: Scale up from 0 → 1 (0.3s)
- **Collect**: Particle burst + fade out (0.2s)

### Obstacle Animations
- **Idle**: Slow rotation + floating motion
- **Spawn**: Fade in + scale up (0.5s)
- **Collision**: Brief flash

### UI Animations
- **Screen Transitions**: Fade in/out (0.3s)
- **Score Update**: Number count-up animation
- **Life Lost**: Icon fade + shake
- **Button Hover**: Scale 1.0 → 1.05
- **Button Click**: Scale 1.0 → 0.95 → 1.0

## Performance Optimization

### Asset Optimization
- Texture sizes: Max 1024x1024
- Model poly count: < 5000 triangles per object
- Audio: Compressed MP3/OGG format
- Lazy load non-critical assets

### Rendering Optimization
- Object pooling for collectibles/obstacles
- Frustum culling enabled
- LOD (Level of Detail) for distant objects
- Limit particle count (max 100 active)

### Memory Management
- Dispose Three.js geometries/materials on removal
- Remove event listeners on cleanup
- Clear intervals/timeouts
- Reuse objects instead of creating new ones

## Responsive Design

### Desktop (> 768px)
- Full 3D view
- Keyboard controls prominent
- Larger UI elements
- Higher quality graphics

### Mobile (< 768px)
- Optimized 3D view
- Touch controls
- Larger touch targets (min 44x44px)
- Reduced particle effects
- Lower texture resolution

### Orientation
- **Landscape**: Optimal experience
- **Portrait**: Adjusted camera angle, UI repositioning
