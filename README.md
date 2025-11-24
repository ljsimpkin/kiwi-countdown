# 🥝 Kiwi Parachute Drop - Dynamic Countdown Timer

A delightful countdown timer that visualizes time as a cute kiwi bird parachuting from the sky. Watch as the kiwi descends smoothly toward the ground as your deadline approaches!

## Features

### Core Functionality
- ⏰ **Dynamic target date/time countdown** - Works for any duration from seconds to days
- 🪂 **Smooth parachute animation** - Gentle descent with realistic swaying and billowing
- 🎨 **Beautiful sky background** - Gradient sky with parallax cloud layers
- 💾 **Persistent state** - Resume your countdown after closing the tab
- 📱 **Fully responsive** - Works on desktop and mobile devices
- 🎯 **Quick presets** - Fast setup with 5 min, 1 hour, tomorrow 9 AM, and 3-day buttons
- ⚡ **Performance optimized** - Adaptive frame rate based on countdown duration

### Visual Elements
- **Vertical scrolling animation** - Kiwi stays centered while the world scrolls past
- Animated kiwi bird with swaying motion (fixed at center)
- Billowing parachute canopy
- Multiple cloud layers with vertical parallax scrolling
- Ground that scrolls into view as time progresses
- Landing animation with bounce effect (in place)
- Celebration message when time's up

## How to Use

1. **Open** `index.html` in your web browser
2. **Set target date/time** using the datetime picker, or click a quick preset button
3. **Click "Start Countdown"** to begin
4. **Watch the kiwi descend** as time counts down
5. The countdown **persists** even if you close the tab - just reopen to continue!

### Quick Presets
- **5 minutes** - Perfect for tea breaks
- **1 hour** - Great for focus sessions
- **Tomorrow 9 AM** - Set up your morning reminder
- **In 3 days** - Track upcoming events

### URL Parameters (NEW!)
You can now set the target date directly in the URL - perfect for sharing countdowns!

**Example:**
```
index.html?date=6:30am 3rd december
```

**Supported formats:**
- Natural language: `6:30am 3rd december`, `december 3 2025 6:30am`
- ISO 8601: `2025-12-03T06:30:00`
- Alternative params: `?target=...` or `?time=...`

See [QUICKSTART.md](QUICKSTART.md) for full documentation on URL parameters.

## Project Structure

```
kiwi-time/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # All styling
├── js/
│   ├── main.js            # App initialization & orchestration
│   ├── timer.js           # Countdown timer logic
│   ├── timeFormatter.js   # Smart time display formatting
│   ├── storage.js         # localStorage persistence
│   ├── kiwi.js            # Kiwi bird entity & animation
│   ├── parachute.js       # Parachute rendering
│   ├── background.js      # Sky, clouds, and ground
│   ├── renderer.js        # Main canvas renderer
│   └── utils.js           # Helper functions
└── README.md
```

## Technical Details

### Architecture
- **Entity-Component pattern** - Separate classes for Kiwi, Parachute, Background
- **Canvas 2D rendering** - Pure HTML5 Canvas for maximum compatibility
- **Vanilla JavaScript** - No frameworks, fast and lightweight
- **Adaptive frame rate** - Automatically adjusts based on countdown duration:
  - < 1 minute: 60 FPS
  - < 1 hour: 10 FPS
  - < 1 day: 2 FPS
  - > 1 day: 1 FPS

### Key Classes

**CountdownTimer** - Manages target date, calculates time remaining and percentage complete

**Kiwi** - Handles position, swaying animation, and landing sequence

**Parachute** - Renders canopy with billowing effect, handles collapse on landing

**Background** - Draws sky gradient, manages cloud parallax, renders ground

**Renderer** - Orchestrates all drawing operations, manages animation loop

**TimeFormatter** - Smart formatting that shows appropriate units (days, hours, minutes, seconds)

**Storage** - localStorage wrapper for saving/loading countdown state

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- LocalStorage
- datetime-local input

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Smooth 60 FPS for short timers
- Optimized frame rates for long-running countdowns
- Efficient canvas rendering
- Minimal battery impact for multi-day timers
- Responsive at any viewport size

## Future Enhancements

Potential features for future versions:
- Sound effects (wind, landing)
- Weather transitions (sunny → cloudy)
- Multiple simultaneous countdowns
- Custom kiwi colors/accessories
- Shareable countdown URLs
- Notification when timer completes
- Export countdown as GIF

## License

Free to use and modify!

---

Made with ❤️ and lots of kiwis 🥝🪂
