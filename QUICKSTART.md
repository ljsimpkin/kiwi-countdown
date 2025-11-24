# Quick Start Guide

## 🚀 Get Started in 30 Seconds

### Option 1: Just Open It
```bash
open index.html
```
That's it! The app works entirely in your browser.

### Option 2: Use a Local Server (Optional)
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have npx)
npx serve

# Then visit: http://localhost:8000
```

## 🎯 First Countdown

1. **Open** `index.html` in your browser
2. **Click** one of the quick preset buttons (e.g., "5 minutes")
3. **Click** "Start Countdown"
4. **Watch** the kiwi parachute down!

## 🔗 Share Countdowns with URL Parameters

You can set the target date directly in the URL! Perfect for sharing countdowns with others.

### Basic Format
```
index.html?date=YOUR_DATE_HERE
```

### Examples

**Natural language format** (your example):
```
index.html?date=6:30am 3rd december
```

**ISO format**:
```
index.html?date=2025-12-03T06:30:00
```

**More natural formats**:
```
index.html?date=december 3 2025 6:30am
index.html?date=3rd dec 6:30am
index.html?date=dec 3 6:30am
index.html?date=2025-12-03 06:30
```

**Alternative parameter names**:
```
index.html?target=6:30am 3rd december
index.html?time=6:30am 3rd december
```

### Supported Date Formats

✅ **Natural language**:
- `6:30am 3rd december`
- `december 3rd 6:30am`
- `3rd dec 2025 6:30am`

✅ **ISO 8601**:
- `2025-12-03T06:30:00`
- `2025-12-03 06:30`

✅ **Flexible time formats**:
- `6:30am` / `6:30pm`
- `06:30` (24-hour)
- `18:30` (24-hour)

✅ **Month names** (full or abbreviated):
- january/jan, february/feb, march/mar, etc.

✅ **Ordinal days**:
- 1st, 2nd, 3rd, 4th, 5th, etc.

### URL Encoding Tips

For special characters, URL-encode spaces:
```
index.html?date=6:30am%203rd%20december
```

Or your browser will do it automatically when you share the link!

### Share Your Countdown

1. Set your target date in the URL
2. Copy the full URL
3. Share with anyone!
4. They'll see the kiwi counting down to your event

**Example for a meeting**:
```
http://localhost:8000?date=2:30pm%20today
```

**Example for a birthday**:
```
http://localhost:8000?date=march%2015%202026%209:00am
```

## ⚡ Quick Tips

### Set a Custom Time
- Use the datetime picker to choose any future date/time
- Or click a preset button for common durations
- Click "Start Countdown" to begin

### Pause Anytime
- Click "Pause" to freeze the countdown
- Click "Resume" to continue
- The kiwi will stay frozen in mid-air!

### Reset Everything
- Click "Reset" to start over
- Kiwi returns to the top
- Timer clears

### Close & Resume
- Close the browser tab anytime
- Reopen `index.html` later
- Your countdown continues automatically!

## 📱 Mobile Use

Works perfectly on phones and tablets:
- Open in Safari (iOS) or Chrome (Android)
- All features work via touch
- Responsive design adapts
- Add to home screen for quick access

## 🎨 What Makes It Special

- **Cute Kiwi**: Adorable bird with gentle animations
- **Smooth Motion**: Realistic swaying and parachute billowing
- **Parallax Clouds**: Multiple layers create depth
- **Smart Display**: Shows appropriate time units automatically
- **Performance**: Adapts frame rate based on countdown length
- **Persistent**: Never lose your countdown progress

## 🛠️ Customization Ideas

Want to modify it? Check these files:

- **Colors**: `styles/main.css` (change gradient, buttons)
- **Kiwi size**: `js/kiwi.js` (adjust `bodyRadius`, `headRadius`)
- **Parachute**: `js/parachute.js` (modify colors, size)
- **Sky**: `js/background.js` (change gradient colors)
- **Speed**: `js/utils.js` (modify `getUpdateFrequency()`)

## 🐛 Troubleshooting

### Kiwi Not Moving?
- Check that you've clicked "Start Countdown"
- Make sure target time is in the future
- Try a shorter duration first (5 minutes)

### Time Display Shows "--"?
- Timer hasn't started yet
- Click a preset or enter a date, then start

### Browser Compatibility
- Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+)
- Enable JavaScript
- Canvas support required

## 🎓 Learning the Code

Great for learning:
- HTML5 Canvas animation
- JavaScript classes and OOP
- requestAnimationFrame loops
- localStorage persistence
- Adaptive performance
- Responsive design

Start with `js/main.js` to see how everything connects!

## 📚 More Info

- Full features: See `FEATURES.md`
- Architecture: See `README.md`
- Code structure: Check `js/` folder

---

Now go watch that kiwi fly! 🥝🪂✨
