# Spooky Sound Integration

## New Sounds Added

Three atmospheric sounds have been integrated into Ghost Dodger:

### 1. 🫀 Heartbeat (`public_sound_heartbeat.mp3`)
**When it plays:**
- Automatically starts when player has only **1 life remaining**
- Loops continuously to create tension
- Stops when player gains lives or dies

**Purpose:** Creates urgency and warns player they're in danger

**Volume:** 30% of master volume (subtle but noticeable)

---

### 2. 🦉 Owl Hoot (`public_sound_owl_hoot.mp3`)
**When it plays:**
- Randomly during gameplay every **15-30 seconds**
- Only plays during active gameplay (not in menus)

**Purpose:** Adds atmospheric Halloween ambience

**Volume:** 50% of master volume

---

### 3. 🐺 Wolf Howl (`public_sound_wolf-howl.mp3`)
**When it plays:**
- When a **boss enemy spawns**
- When entering **Round 3 or higher** (dramatic effect)

**Purpose:** Signals important/dangerous game events

**Volume:** 60% of master volume (most prominent)

---

## Technical Implementation

### Files Modified

**1. `src/core/loader.js`**
- Added three new sound files to the loading queue

**2. `src/scene/game-scene/game-scene.js`**
- Created THREE.Audio instances for each sound
- Added ambient sound timer for random owl hoots
- Connected sounds to game events (boss spawn, round change, low health)
- Implemented heartbeat loop logic
- Added sound cleanup on game over/restart

### Sound Behavior

**Heartbeat:**
```javascript
// Starts looping when lives === 1
if (playerLives === 1) {
  heartbeatSound.play(); // loops
}
```

**Owl Hoot:**
```javascript
// Plays randomly every 15-30 seconds
if (timer > 15 + random(15)) {
  owlHootSound.play(); // one-shot
}
```

**Wolf Howl:**
```javascript
// Plays on boss spawn
onBossSpawn() {
  wolfHowlSound.play(); // one-shot
}

// Plays on round 3+
onRoundChange() {
  if (round >= 3) {
    wolfHowlSound.play();
  }
}
```

### Volume Control

All sounds respect the game's sound toggle:
- When sound is muted, all ambient sounds are silenced
- Volumes are proportional to master volume setting
- Heartbeat: 30% (subtle)
- Owl: 50% (ambient)
- Wolf: 60% (dramatic)

---

## Testing Checklist

- [ ] Heartbeat starts when player loses 2 lives (1 remaining)
- [ ] Heartbeat stops when player dies or gains lives
- [ ] Owl hoots play randomly during gameplay
- [ ] Wolf howl plays when boss spawns
- [ ] Wolf howl plays on round 3+
- [ ] All sounds respect mute toggle
- [ ] Sounds stop properly on game over
- [ ] Sounds reset properly on restart
- [ ] No audio overlapping issues

---

## Future Enhancements

Potential additions:
- Thunder sound on lightning effects
- Creaking door sound when entering new areas
- Witch cackle on power-up collection
- Ghostly whispers as ambient layer
- Footsteps sound for player movement

---

## Audio Files Location

```
public/audio/
├── public_sound_heartbeat.mp3  ← Tension/danger
├── public_sound_owl_hoot.mp3   ← Ambient atmosphere
└── public_sound_wolf-howl.mp3  ← Dramatic events
```

All sounds are loaded automatically on game start and ready to play when triggered.
