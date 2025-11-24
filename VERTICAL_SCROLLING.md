# Vertical Scrolling Mode

## Overview

The Kiwi Parachute Drop timer now features **vertical scrolling** instead of the kiwi descending. The kiwi stays centered on screen while the world scrolls past, creating a dynamic camera effect!

## How It Works

### The Concept

Instead of the kiwi falling down the screen, imagine the kiwi is actually descending through the sky, and you're following along with a camera that keeps the kiwi centered in frame. As time counts down:

- **The kiwi stays centered** - Both horizontally and vertically in the middle of the canvas
- **The background scrolls up** - Clouds move upward past the kiwi, creating the illusion of descent
- **The ground approaches** - Gradually scrolls into view from the bottom
- **Parallax effect** - Different cloud layers scroll at different speeds for depth

### Visual Experience

**At Start (0% complete):**
```
┌─────────────────────┐
│      ☁️    ☁️         │ ← Clouds above
│   ☁️         ☁️       │
│                     │
│      [Parachute]    │
│         [Kiwi]      │ ← Kiwi centered
│                     │
│   ☁️         ☁️       │
│      ☁️    ☁️         │ ← More clouds below
└─────────────────────┘
```

**Midway (50% complete):**
```
┌─────────────────────┐
│                     │ ← Clouds have scrolled up
│   ☁️         ☁️       │
│                     │
│      [Parachute]    │
│         [Kiwi]      │ ← Still centered!
│                     │
│   ☁️         ☁️       │
│  ═════════════════  │ ← Ground visible
└─────────────────────┘
```

**Near End (90% complete):**
```
┌─────────────────────┐
│                     │
│   ☁️         ☁️       │
│                     │
│      [Parachute]    │
│         [Kiwi]      │ ← Still centered!
│─────────────────────│ ← Ground line
│█████████████████████│
│█████ GROUND █████████│ ← Ground fills screen
└─────────────────────┘
```

**Landing (100% complete):**
```
┌─────────────────────┐
│                     │
│   ☁️         ☁️       │
│      [Parachute]    │
│         [Kiwi]      │ ← Kiwi lands in place
│─────────────────────│ ← Ground at kiwi level
│█████████████████████│
│█████ GROUND █████████│
└─────────────────────┘
```

---

## Technical Details

### Kiwi Positioning

**Before (Descending):**
- Y position changed from top (80px) to bottom (height - 120px)
- Kiwi moved vertically through the screen

**After (Centered):**
- Y position fixed at `canvas.height / 2`
- Kiwi stays in the exact center of the viewport
- Only swaying animation moves the kiwi horizontally

### Background Scrolling

**Cloud Scrolling:**
- Each cloud has an initial Y position (starting below viewport)
- As `percentComplete` increases, clouds scroll upward (bottom to top)
- Simulates kiwi falling downward through the sky
- Parallax effect: Faster clouds = closer = scroll more
- Formula: `y = initialY - (scrollOffset * parallaxFactor)` (negative for upward)

**Ground Scrolling:**
- Starts off-screen at bottom
- Gradually scrolls up as timer progresses
- At 0%: `groundY = canvas.height` (hidden)
- At 100%: `groundY = canvas.height / 2 + 50` (just below kiwi)
- Creates effect of approaching ground

### Parallax Layers

Three cloud layers with different scroll speeds:

| Layer | Speed | Distance | Parallax Factor | Effect |
|-------|-------|----------|-----------------|--------|
| Far | 10-12 | Background | 0.4-0.48 | Scrolls slowly |
| Medium | 18-22 | Mid-ground | 0.72-0.88 | Moderate scroll |
| Near | 28-30 | Foreground | 1.12-1.20 | Scrolls quickly |

This creates a sense of depth and 3D space!

---

## Animation Characteristics

### Smooth Scrolling
- Background updates every frame based on `percentComplete`
- No sudden jumps or jarring movements
- Easing function controls acceleration

### Performance Optimized
- Only visible clouds are drawn (viewport culling)
- Scroll offset calculated once per frame
- Efficient parallax calculations

### Landing Sequence
When timer completes:
1. Ground stops at kiwi level (centered)
2. Kiwi bounces in place (smaller bounce than before)
3. Parachute collapses
4. Celebration message appears
5. Scrolling stops

---

## Advantages of Vertical Scrolling

### Better Visual Continuity
- Kiwi always visible in center
- Easier to track the character
- Time display never obscured

### More Immersive
- Feels like you're following the kiwi's descent
- Camera-tracking effect is engaging
- Background movement creates dynamic feel

### Scalable for Long Timers
- Works great for both short (5 min) and long (10 days) countdowns
- Background can scroll indefinitely
- Ground approach is always visible

### Better Mobile Experience
- Centered kiwi works well on small screens
- No need to scroll canvas
- All action in viewport center

---

## Code Changes

### Modified Files

**1. [kiwi.js](js/kiwi.js)**
- Kiwi Y position fixed to center: `this.y = this.centerY`
- Removed descent logic
- Landing bounce reduced (10px instead of 20px)

**2. [background.js](js/background.js)**
- Added `scrollOffset` property
- Clouds track `initialY` + scroll offset
- Ground position based on `percentComplete`
- Parallax factors for different cloud speeds

**3. [renderer.js](js/renderer.js)**
- Pass `percentComplete` to background update
- Pass `percentComplete` and `isComplete` to draw
- No changes to kiwi/parachute rendering

**4. [main.js](js/main.js)**
- Pass additional parameters to renderer.draw()
- No logic changes needed

---

## Customization

### Adjust Scroll Speed

In [background.js](js/background.js), modify:
```javascript
this.maxScroll = 10000; // Increase for slower scroll
```

### Change Parallax Intensity

In [background.js](js/background.js), Cloud.update():
```javascript
const parallaxFactor = this.speed / 25; // Lower = less parallax
```

### Adjust Ground Approach

In [background.js](js/background.js), drawGround():
```javascript
const groundEndY = 0; // Change where ground stops at 100%
```

### Modify Kiwi Center Position

In [kiwi.js](js/kiwi.js), constructor:
```javascript
this.centerY = canvas.height / 2; // Change vertical position
```

---

## Comparison: Old vs New

| Aspect | Old (Descending) | New (Scrolling) |
|--------|------------------|-----------------|
| Kiwi movement | Vertical (top to bottom) | Fixed center |
| Background | Static | Scrolls upward |
| Clouds | Horizontal drift only | Vertical scroll + horizontal drift |
| Ground | Always visible | Scrolls into view |
| Visual metaphor | "Falling kiwi" | "Following kiwi's descent" |
| Screen usage | Changes focus point | Consistent focus point |
| Parallax | Horizontal only | Horizontal + vertical |

---

## Testing Tips

### Short Timer (5 minutes)
- Fast scroll speed
- Clouds move quickly
- Ground approaches rapidly
- Perfect for testing!

### Medium Timer (1 hour)
- Moderate scroll speed
- Smooth parallax visible
- Ground creeps into view

### Long Timer (3 days)
- Very slow scroll
- Imperceptible movement
- Check after minutes/hours

### Test Scrolling
1. Start 5-minute countdown
2. Watch clouds scroll upward
3. Notice parallax (fast vs slow clouds)
4. See ground appear from bottom
5. Observe landing at center

---

## Future Enhancements

Possible additions to vertical scrolling:

- **Birds flying by** at different altitudes
- **Distance markers** showing altitude remaining
- **Sky color transition** as you descend (light → darker)
- **Wind streaks** scrolling upward
- **Mountain peaks** appearing in distance
- **Speed lines** near ground for dramatic effect
- **Zoom effect** as ground approaches

---

**The kiwi now floats in the center while the world rushes by!** 🥝🪂🌍
