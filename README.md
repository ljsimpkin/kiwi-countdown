# 🪂 Kiwichute - The Most Delightful Countdown Timer

A delightful countdown timer that visualizes time as a cute kiwi bird parachuting from the sky. Watch as the kiwi descends smoothly toward the ground as your deadline approaches!

## ✨ Try It Now!

**[🚀 Launch Kiwichute →](https://liamsimpkin.com/kiwichute/)**

Experience the magic yourself! Watch a kiwi parachute through clouds, dodge mischievous keas, and land in New Zealand with fireworks. Whether you're counting down to your next coffee break or a major deadline, Kiwichute makes every second entertaining.

Try these quick links:
- [5-second demo](https://liamsimpkin.com/kiwichute/?time=5&tz=0) - See the landing celebration!
- [New Year countdown](https://liamsimpkin.com/kiwichute/?time=2026-01-01T00:00:00) - Ring in the new year with a kiwi!

## Features

### Core Functionality
- ⏰ **Dynamic target date/time countdown** - Works for any duration from seconds to days
- 🪂 **Smooth parachute animation** - Gentle descent with realistic swaying and billowing
- 🎨 **Beautiful sky background** - Dynamic day/night cycle with parallax cloud layers
- 💾 **Persistent state** - Resume your countdown after closing the tab
- 📱 **Fully responsive** - Works on desktop and mobile devices
- 🎯 **Quick presets** - Fast setup with 5 seconds, 5 min, 1 hour, tomorrow 9 AM, and 3-day buttons
- ⚡ **Performance optimized** - Adaptive frame rate based on countdown duration
- 🌍 **Timezone support** - Set countdowns in any timezone via URL parameters

### Visual Elements & Effects
- **Vertical scrolling animation** - Kiwi stays centered while the world scrolls past
- 🥝 **Animated kiwi bird** with swaying motion and adorable details
- 🪂 **Billowing parachute canopy** that collapses on landing
- ☁️ **Multiple cloud layers** with vertical parallax scrolling
- 🌅 **Day/night cycle** - Watch the sky transition from dawn to dusk to starry night
- 🌧️ **Dynamic weather** - Rain, snow, or clear skies (toggle to your preference)
- 🍎 **Collectible food items** - Catch berries, worms, and apples for points
- 🦜 **Mischievous keas** - Dodge these cheeky birds trying to steal your snacks!
- 🎆 **Explosive fireworks** - Spectacular confetti celebration when time's up
- 🥝 **Kiwi friends party** - Other kiwis join the celebration at landing
- 🔊 **Procedural sound effects** - Dynamic audio for food collection and landing
- 🏆 **High score tracking** - Beat your personal best!

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

### URL Parameters
Set the target date directly in the URL - perfect for sharing countdowns!

**Examples:**
```
?time=2025-12-04T06:30:00&tz=13          # New Zealand time (GMT+13)
?date=6:30am 3rd december                # Natural language
?time=2025-12-03T06:30:00+13:00          # ISO 8601 with timezone
```

**Supported formats:**
- Natural language: `6:30am 3rd december`, `december 3 2025 6:30am`
- ISO 8601: `2025-12-03T06:30:00`
- ISO with timezone: `2025-12-03T06:30:00+13:00`
- Alternative params: `?target=...` or `?time=...`

**Timezone parameter:**
- `&tz=13` or `&timezone=13` - Offset in hours from UTC
- `&tz=GMT+13` - GMT notation
- Without timezone, treated as local time

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
