# Visual Guide - What You'll See

## The Kiwi Journey 🥝🪂

### Stage 1: Ready to Drop (0% Complete)
```
          Sky - Light Blue (#87CEEB)

    ☁️           ☁️          ☁️
           ☁️         ☁️

         [Parachute Canopy - Red]
             /    |    \
            /     |     \
           /      |      \
        rope    rope    rope
              [Kiwi]
         (at top - 80px)

    ☁️           ☁️          ☁️

    ________________________________
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\ Ground
```

**Details:**
- Kiwi positioned at Y = 80px from top
- Parachute fully deployed and billowing
- Clouds drifting left to right
- Time display: "5m 0s" (example)

---

### Stage 2: Mid-Flight (50% Complete)
```
          Sky - Transitioning Blue

    ☁️   (clouds have moved)   ☁️


              [moved clouds]

         [Parachute Canopy]
             /    |    \
            /     |     \
        rope    rope    rope
              [Kiwi]
         (middle - ~350px)

           ☁️         ☁️

    ________________________________
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\ Ground
```

**Details:**
- Kiwi at midpoint of journey
- Swaying left and right gently
- Parachute billowing continuously
- Clouds at different positions
- Time display: "2m 30s" (example)

---

### Stage 3: Final Approach (90% Complete)
```
          Sky - Lighter at Bottom

       ☁️  (more clouds passed)





         [Parachute Canopy]
             /    |    \
        rope    rope    rope
              [Kiwi]
        (near bottom - ~480px)
    ___________________________________
   /~~~~[ground approaching]~~~~~~~~~~\ Ground - Grass Green
```

**Details:**
- Kiwi very close to ground
- Ground details become visible
- Descent speed increased (easing)
- Time display: "30s" (example)

---

### Stage 4: Landing! (100% Complete)
```
          Sky

       ☁️           ☁️




         [collapsed parachute]

              [Kiwi]
              o   o    ← feet visible
    ___________________________________
   /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\ Ground
        ╔═══════════════════╗
        ║   Time's Up! 🎉   ║
        ║ The kiwi has      ║
        ║    landed! 🎉     ║
        ╚═══════════════════╝
```

**Details:**
- Kiwi on ground with bounce animation
- Parachute collapsed behind
- Feet touching ground
- Celebration message displayed
- Time display: "Time's up!"

---

## Component Closeups

### The Kiwi Bird (Actual Drawing)
```
    Beak →  ▶◯    ← Eye (white + black)
           ╱ ◉╲   ← Head (brown)
          │  ●  │  ← Body (brown ellipse)
           ╲___╱
         (body 25px radius)
         (head 18px radius)
```

**Colors:**
- Body/Head: `#8B4513` (saddle brown)
- Beak: `#FF8C00` (dark orange)
- Eye: White with black pupil

**Animation:**
- Swaying: ±15px horizontal
- Rotation: ±0.05 radians
- Speed: 0.002 per millisecond

---

### The Parachute (Top View)
```
         ●  ← vent hole
       ╱│││││╲
      │││││││││  ← canopy panels
     │││││││││││
      ╲│││││││╱
       ╲╲│││╱╱
         │││    ← ropes
         │││
        [kiwi]
```

**Colors:**
- Canopy: `#FF6B6B` (coral red)
- Outline: `#CC5555` (darker red)
- Ropes: `#555` (dark gray)

**Animation:**
- Billowing: ±5px amplitude
- Speed: 0.003 per millisecond
- Sine wave pattern

**Dimensions:**
- Width: 80px
- Height: 50px
- Rope length: 40px

---

### Cloud Layers (5 clouds)
```
Cloud 1: ☁️  (speed: 15px/s, y: 100, scale: 0.8)
Cloud 2: ☁️  (speed: 25px/s, y: 150, scale: 1.2)
Cloud 3: ☁️  (speed: 20px/s, y: 200, scale: 0.9)
Cloud 4: ☁️  (speed: 30px/s, y: 120, scale: 1.0)
Cloud 5: ☁️  (speed: 18px/s, y: 180, scale: 1.1)
```

**Parallax Effect:**
- Faster clouds = closer to viewer
- Slower clouds = further away
- Creates depth perception

**Drawing:**
```
   ○○○     ← 3 overlapping circles
  ○○○○○    ← different radii
   ○○○
```

---

### The Ground
```
Hills → /╲    /╲    /╲
       /  ╲  /  ╲  /  ╲
Grass →═════════════════ ← ground line (y: 520)
Patches→ ● ● ● ● ● ●   ← decorative
       ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ← solid grass
```

**Colors:**
- Main grass: `#7CB342` (light green)
- Patches: `#689F38` (darker green)
- Hills: `#8BC34A` (yellow-green)
- Border: `#558B2F` (dark green)

---

## Color Palette Reference

### Sky Gradient (top to bottom)
```
Top:    #87CEEB (sky blue)
Mid:    #B0D4E8 (lighter blue)
Bottom: #E0F2F7 (very light blue)
```

### Character Colors
```
Kiwi:       #8B4513 (brown)
Beak/Feet:  #FF8C00 (orange)
Parachute:  #FF6B6B (coral)
```

### Background Colors
```
Ground:  #7CB342 (grass green)
Clouds:  rgba(255,255,255,0.8) (translucent white)
```

### UI Colors
```
Primary:    #667eea (purple)
Secondary:  #6c757d (gray)
Background: linear-gradient(135deg, #667eea, #764ba2)
```

---

## Animation Timeline Example (5 minute countdown)

```
00:00  ━━━━━━━━━━━━━━━━━━━━  Start
       Kiwi at top (Y: 80px)

01:15  ━━━━━━━━━━━━━━━━○━━  25% complete
       Kiwi at Y: ~190px

02:30  ━━━━━━━━━━○━━━━━━━━  50% complete
       Kiwi at Y: ~300px

03:45  ━━━━○━━━━━━━━━━━━━━  75% complete
       Kiwi at Y: ~410px

04:55  ○━━━━━━━━━━━━━━━━━━  95% complete
       Kiwi at Y: ~500px

05:00  ●━━━━━━━━━━━━━━━━━━  100% - LANDED!
       Kiwi at Y: 520px (ground)
```

---

## Responsive Layouts

### Desktop (> 768px)
```
┌─────────────────────────────────────┐
│  🥝 Kiwi Parachute Drop             │
│  Watch the kiwi descend...          │
├─────────────────────────────────────┤
│                                     │
│           [5m 30s]                  │
│                                     │
│         [Parachute]                 │
│            [Kiwi]                   │
│        ☁️        ☁️                  │
│                                     │
│    [ground]                         │
│                                     │
├─────────────────────────────────────┤
│ Target: [datetime picker]           │
│         [Start Countdown]           │
│                                     │
│ Presets: [5min][1hr][Tom][3d]      │
│                                     │
│ [Pause] [Reset]                     │
└─────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────┐
│ 🥝 Kiwi Parachute    │
├──────────────────────┤
│    [3m 15s]          │
│                      │
│   [Parachute]        │
│      [Kiwi]          │
│   ☁️     ☁️           │
│  [ground]            │
├──────────────────────┤
│ Target:              │
│ [datetime picker]    │
│ [Start Countdown]    │
│                      │
│ [5min] [1hr]         │
│ [Tom]  [3d]          │
│                      │
│ [Pause]              │
│ [Reset]              │
└──────────────────────┘
```

---

## State Visualization

### State 1: Initial (No Timer)
- Kiwi: Top position (static)
- Parachute: Deployed (static)
- Clouds: Drifting
- Display: "--"
- Buttons: Start enabled, Pause disabled

### State 2: Running
- Kiwi: Descending (animated)
- Parachute: Billowing (animated)
- Clouds: Drifting (animated)
- Display: Time updating
- Buttons: Start shows "Restart", Pause enabled

### State 3: Paused
- Kiwi: Frozen at current Y
- Parachute: Still billowing
- Clouds: Still drifting
- Display: Time frozen
- Buttons: Resume enabled

### State 4: Landed
- Kiwi: On ground (bounce complete)
- Parachute: Collapsed
- Clouds: Still drifting
- Display: "Time's up!"
- Message: Celebration overlay
- Buttons: Only Reset enabled

---

Enjoy the visual journey! 🥝🪂✨
