# Changelog

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
