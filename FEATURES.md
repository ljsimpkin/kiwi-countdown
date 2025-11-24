# Feature Showcase

## What You'll See

### Initial State
When you first open the application:
- A beautiful gradient purple background
- A canvas showing a sky with clouds
- The kiwi bird at the TOP of the screen with parachute deployed
- Time display showing "--"
- Datetime picker pre-filled with "5 minutes from now"
- Quick preset buttons ready to use

### During Countdown

#### Short Timer (< 1 minute)
- Kiwi descends quickly and visibly
- Clouds move at normal speed
- Time display shows: "45s" → "30s" → "15s"
- Smooth 60 FPS animation

#### Medium Timer (5 minutes to 1 hour)
- Steady descent
- Time display shows: "23m 45s" → "15m 30s" → "5m 12s"
- 10 FPS (still smooth, saves resources)

#### Long Timer (hours to days)
- Very slow descent (almost imperceptible)
- Clouds drift very slowly
- Time display shows: "2d 5h" → "1d 18h" → "14h 23m"
- Adaptive frame rate (1-2 FPS)

### Animation Details

#### Kiwi Features
- Round brown body
- Small head with orange beak
- White eye with black pupil
- Gentle left-right swaying motion (sine wave)
- Slight rotation following sway direction
- Feet appear only when landed

#### Parachute Features
- Red/pink dome canopy
- 4 attachment ropes connecting to kiwi
- Billowing animation (canopy expands/contracts)
- Decorative panel lines
- Center vent hole
- Collapses on landing

#### Background Features
- Sky: Light blue gradient (lighter at bottom)
- 5 cloud layers at different depths
- Clouds move at different speeds (parallax effect)
- Green grass ground at bottom
- Decorative grass patches
- Hills silhouette

### Landing Sequence (Timer Complete)

1. **Kiwi lands** - Smooth bounce on ground
2. **Parachute collapses** - Folds behind kiwi
3. **Feet appear** - Orange feet touch ground
4. **Message displays** - White box with "Time's Up! 🎉 The kiwi has landed! 🎉"
5. **Countdown stops** - Time display shows "Time's up!"

### Interactive Controls

#### Start Countdown
- Sets up new timer
- Resets kiwi to top
- Begins descent animation
- Saves to localStorage
- Button changes to "Restart"

#### Pause/Resume
- Freezes kiwi in mid-air
- Stops time countdown
- Clouds keep moving (atmospheric)
- Button toggles between "Pause" and "Resume"
- Adjusts target time to account for pause

#### Reset
- Clears everything
- Resets kiwi to top (static)
- Clears localStorage
- Sets default time (5 minutes from now)
- Re-enables all controls

#### Quick Presets
- **5 minutes**: Click and instant countdown setup
- **1 hour**: Perfect for focus sessions
- **Tomorrow 9 AM**: Morning reminder
- **In 3 days**: Event countdown

### Responsive Behavior

#### Desktop (> 768px)
- Full-size canvas (600px height)
- Large time display
- Controls side-by-side
- All features visible

#### Mobile (< 768px)
- Smaller canvas (500px height)
- Compact time display
- Stacked buttons
- Touch-friendly controls
- Maintains all functionality

### Performance Characteristics

#### Frame Rate Adaptation
```
< 60 seconds    → 60 FPS (smooth)
< 1 hour        → 10 FPS (efficient)
< 1 day         → 2 FPS (battery friendly)
> 1 day         → 1 FPS (ultra efficient)
```

#### Battery Impact
- Short timers: Normal CPU usage
- Long timers: Minimal CPU usage
- Tab backgrounded: Continues running
- Automatic optimization

### Persistence

#### Saved State
When you close the tab:
- Target date/time is saved
- Start date is saved
- Current progress is saved

When you reopen:
- Automatically resumes countdown
- Kiwi appears at correct position
- Time remaining is accurate
- No progress lost

#### Cleared When
- Timer completes (kiwi lands)
- User clicks "Reset"
- Target date is in the past

## Use Cases

### Quick Timers
- ☕ Tea brewing (3 minutes)
- 🍳 Cooking pasta (10 minutes)
- 🚿 Shower timer (15 minutes)
- 🏃 Exercise sets (30 seconds)

### Medium Timers
- 🍕 Pizza delivery (30 minutes)
- 📚 Study session (1 hour)
- 🎮 Gaming session (2 hours)
- 🎬 Movie night (6 hours until show)

### Long Timers
- 🎂 Birthday countdown (10 days)
- 🚀 Product launch (2 weeks)
- ✈️ Vacation countdown (1 month)
- 🎓 Graduation (3 months)

## Easter Eggs & Fun Details

### Hidden Touches
- Kiwi eye occasionally looks around (future feature)
- Parachute panels create realistic segments
- Cloud patterns never repeat exactly
- Grass has subtle depth layers
- Landing bounce feels satisfying

### New Zealand Theme
- Kiwi bird (national symbol)
- Natural environment
- Green & blue color palette
- Playful, friendly aesthetic

## Accessibility

- Large, readable time display
- High contrast text
- Touch-friendly buttons (44px minimum)
- Keyboard accessible form controls
- Semantic HTML structure
- Works without JavaScript fallback notice

Enjoy watching your kiwi friend parachute down! 🥝🪂
