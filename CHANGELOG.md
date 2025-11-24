# Changelog

## [1.2.0] - Vertical Scrolling Animation

### Changed
- **Complete animation overhaul** - Changed from descending kiwi to vertical scrolling
- **Kiwi now stays centered** - Fixed position in middle of screen (both horizontally and vertically)
- **Background scrolls vertically** - World moves past the kiwi instead of kiwi moving through world
- **Constant scroll speed** - Clouds scroll at steady rate regardless of timer duration (0.05px/ms)
- **Parallax cloud scrolling** - Different cloud layers scroll at different speeds for depth
- **Increased cloud count** - 36+ clouds (up from 11) distributed throughout descent
- **Faster cloud scrolling** - Parallax speed increased by 67% for more dramatic motion
- **Extended scroll distance** - MaxScroll increased from 10,000 to 20,000 for longer journeys
- **Ground scrolls into view** - Approaches from bottom as timer progresses
- **Landing animation updated** - Kiwi bounces in place at center instead of at bottom
- **Camera-following effect** - Creates more immersive descent experience

### Technical Details
- Modified [kiwi.js](js/kiwi.js) - Kiwi Y position fixed to `canvas.height / 2`
- Rewrote [background.js](js/background.js) - Added scroll offset and parallax system
- Updated [renderer.js](js/renderer.js) - Passes percentComplete for scrolling calculations
- Updated [main.js](js/main.js) - Passes additional parameters to renderer

### Documentation
- Added [VERTICAL_SCROLLING.md](VERTICAL_SCROLLING.md) - Complete guide to new animation system
- Updated [README.md](README.md) - Reflect vertical scrolling in visual elements

### Benefits
- Better visual continuity (kiwi always visible)
- More immersive camera-tracking effect
- Improved mobile experience (centered focus)
- Scalable for any countdown duration
- Enhanced parallax depth perception

---

## [1.1.0] - URL Parameters Feature

### Added
- **URL query parameter support** - Set target date directly in the URL
- Support for natural language date formats (`6:30am 3rd december`)
- Support for ISO 8601 format (`2025-12-03T06:30:00`)
- Multiple parameter names accepted (`date`, `target`, `time`)
- Automatic countdown start when valid URL parameter is provided
- Smart date parsing with flexible ordering
- Support for abbreviated month names (jan, feb, mar, etc.)
- Support for ordinal day numbers (1st, 2nd, 3rd, etc.)
- Support for both 12-hour (AM/PM) and 24-hour time formats
- Automatic year inference (assumes next occurrence if date has passed)

### Documentation
- Added [URL_PARAMETERS.md](URL_PARAMETERS.md) - Complete guide to URL parameters
- Added [URL_EXAMPLES.html](URL_EXAMPLES.html) - Interactive examples page
- Updated [QUICKSTART.md](QUICKSTART.md) - Added URL parameter section
- Updated [README.md](README.md) - Added URL parameter feature notice

### Technical Details
- Added `parseURLParameters()` method in `main.js`
- Added `parseCustomDateFormat()` method for natural language parsing
- URL parameters take priority over localStorage saved timers
- Console logging for invalid dates (user-friendly error handling)
- Supports URL encoding (spaces, special characters)

### Examples

**Basic usage:**
```
index.html?date=6:30am 3rd december
```

**ISO format:**
```
index.html?date=2025-12-03T06:30:00
```

**Alternative formats:**
```
index.html?date=december 3 2025 6:30am
index.html?target=6:30am 3rd dec
index.html?time=18:30 3 december
```

### Use Cases
- Share countdowns with friends/colleagues
- Bookmark specific event countdowns
- Embed in emails or websites
- Generate QR codes for events
- Social media sharing

---

## [1.0.0] - Initial Release

### Features
- Dynamic countdown timer with target date/time
- Animated kiwi bird with parachute
- Parallax cloud layers
- Sky gradient background
- Grass ground with decorative details
- Landing animation with bounce effect
- Smart time formatting
- LocalStorage persistence
- Responsive design (desktop & mobile)
- Adaptive frame rate for performance
- Quick preset buttons (5 min, 1 hour, tomorrow 9 AM, in 3 days)
- Pause/Resume functionality
- Reset functionality

### Documentation
- README.md
- QUICKSTART.md
- FEATURES.md
- VISUAL_GUIDE.md
- IMPLEMENTATION_CHECKLIST.md

### Technical
- Pure vanilla JavaScript (no dependencies)
- HTML5 Canvas 2D
- Entity-component architecture
- 12 JavaScript modules
- Fully commented code
- ~2000 lines of code
