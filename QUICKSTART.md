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
