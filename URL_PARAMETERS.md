# URL Parameters Guide

## Overview

You can now set the target date/time directly in the URL, making it easy to share specific countdowns with others. The app automatically starts the countdown when a valid date parameter is provided.

## Basic Usage

### Format
```
index.html?date=YOUR_DATE_HERE
```

### Your Example
```
index.html?date=6:30am 3rd december
```

This will automatically:
1. Parse the date string
2. Set the target date/time
3. Start the countdown immediately
4. Display the kiwi descending

---

## Supported Date Formats

### 1. Natural Language (Recommended)

**Format:** `TIME DAY MONTH [YEAR]`

**Examples:**
```
?date=6:30am 3rd december
?date=6:30am 3rd december 2025
?date=2:30pm 15th march
?date=9:00am 1st january 2026
```

**Flexible ordering:**
```
?date=december 3rd 6:30am
?date=march 15 2:30pm
?date=6:30am december 3
```

### 2. Abbreviated Month Names

**Examples:**
```
?date=6:30am 3rd dec
?date=2:30pm 15th mar
?date=9:00am 1st jan 2026
```

**All supported abbreviations:**
- jan, feb, mar, apr, may, jun, jul, aug, sep/sept, oct, nov, dec

### 3. ISO 8601 Format

**Format:** `YYYY-MM-DDTHH:MM:SS`

**Examples:**
```
?date=2025-12-03T06:30:00
?date=2025-03-15T14:30:00
?date=2026-01-01T09:00:00
```

**Simplified ISO:**
```
?date=2025-12-03 06:30
?date=2025-03-15 14:30
```

### 4. Time Formats

**AM/PM (12-hour):**
```
6:30am
6:30pm
12:00am (midnight)
12:00pm (noon)
```

**24-hour:**
```
06:30
18:30
00:00 (midnight)
12:00 (noon)
```

### 5. Ordinal Day Numbers

All standard ordinals are supported:
```
1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th
11th, 12th, 13th, 14th, 15th, 16th, 17th, 18th, 19th, 20th
21st, 22nd, 23rd, 24th, 25th, 26th, 27th, 28th, 29th, 30th, 31st
```

Or just use plain numbers:
```
?date=6:30am 3 december
```

---

## Alternative Parameter Names

Instead of `date`, you can use:

### `target`
```
?target=6:30am 3rd december
```

### `time`
```
?time=6:30am 3rd december
```

All three work identically!

---

## URL Encoding

### Spaces in URLs

Browsers automatically handle spaces, but for manual encoding:

**Unencoded (browser handles):**
```
?date=6:30am 3rd december
```

**URL encoded:**
```
?date=6:30am%203rd%20december
```

**Both work!** Use whichever is easier.

### Special Characters

Generally not needed, but if you encounter issues:
- Space: `%20`
- Colon: `%3A`
- Plus: `%2B`

---

## Real-World Examples

### Meeting Reminder
```
?date=2:30pm today
# Note: "today" won't work - use actual date
# Better:
?date=2:30pm 25th november 2025
```

### Birthday Countdown
```
?date=9:00am 15th march 2026
```

### Project Deadline
```
?date=5:00pm 31st december 2025
```

### Event Launch
```
?date=12:00pm 1st april 2026
```

### Coffee Break
```
# For short durations, use the preset buttons instead
# URL params work best for specific dates
```

---

## How It Works

### 1. URL Parsing
When the page loads, the app checks for URL parameters:
```javascript
?date=6:30am 3rd december
```

### 2. Date Extraction
The parser extracts:
- Time: `6:30am` → 06:30 hours
- Day: `3rd` → 3
- Month: `december` → 11 (December)
- Year: (current year if not specified)

### 3. Auto-Start
If the date is valid and in the future:
- Sets the datetime input
- Starts the countdown automatically
- Kiwi begins descending!

### 4. Priority
URL parameters take priority over saved timers in localStorage.

---

## Testing Examples

### Test URL 1: December Example
```
http://localhost:8000/index.html?date=6:30am 3rd december
```

### Test URL 2: ISO Format
```
http://localhost:8000/index.html?date=2025-12-03T06:30:00
```

### Test URL 3: Alternative Order
```
http://localhost:8000/index.html?date=december 3 2025 6:30am
```

### Test URL 4: Different Month
```
http://localhost:8000/index.html?date=9:00am 1st january 2026
```

---

## Error Handling

### Invalid Dates
If the date can't be parsed:
- Error logged to console
- App falls back to saved timer or default (5 minutes)
- No countdown auto-starts

### Past Dates
If the date is in the past:
- Error logged to console
- App falls back to saved timer or default
- For dates without year, app assumes next occurrence

### Example
```
?date=6:30am 3rd december
```

If December 3rd has passed this year:
- App assumes December 3rd of next year
- Countdown starts to that date

---

## Sharing Countdowns

### Step 1: Create Your URL
```
index.html?date=6:30am 3rd december 2025
```

### Step 2: Get Full URL
If hosted:
```
https://yoursite.com/kiwi-time/index.html?date=6:30am%203rd%20december%202025
```

If local:
```
http://localhost:8000/index.html?date=6:30am%203rd%20december%202025
```

### Step 3: Share!
- Copy the URL
- Send to friends/colleagues
- Post on social media
- Embed in emails

**Everyone who opens the link will see the same countdown!**

---

## Browser Compatibility

URL parameters work in all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers

No special setup required!

---

## Tips & Tricks

### 1. Bookmark Countdowns
Bookmark URLs for recurring events:
```
?date=9:00am 1st january 2026  (New Year)
?date=6:00pm 31st december 2025 (New Year's Eve)
```

### 2. QR Codes
Generate QR codes of countdown URLs for:
- Event posters
- Wedding invitations
- Product launches

### 3. Email Signatures
Add countdown links to email signatures:
```html
<a href="https://yoursite.com/kiwi-time/?date=launch-date">
  Countdown to Our Launch! 🥝🪂
</a>
```

### 4. Social Media
Share event countdowns on Twitter, Facebook, etc:
```
Can't wait! Watch the countdown: [URL]
```

---

## Examples You Can Try Right Now

Open [URL_EXAMPLES.html](URL_EXAMPLES.html) to see live, clickable examples of all date formats!

---

## Troubleshooting

### "Timer hasn't started"
- Check console for errors (F12)
- Verify date is in the future
- Try ISO format: `2025-12-03T06:30:00`

### "Date not parsing correctly"
- Use ISO format for guaranteed parsing
- Check month spelling
- Ensure time includes minutes: `6:30am` not `6am`

### "Works locally but not when shared"
- Make sure you're using the full URL including `http://` or `https://`
- URL encode special characters
- Test in incognito/private window

---

## Quick Reference

| Format | Example | Notes |
|--------|---------|-------|
| Natural | `6:30am 3rd december` | Most flexible |
| ISO 8601 | `2025-12-03T06:30:00` | Most reliable |
| Short month | `6:30am 3rd dec` | Quick typing |
| 24-hour | `18:30 3 december` | Unambiguous |
| With year | `6:30am 3rd december 2025` | Explicit |

---

**Enjoy sharing your kiwi countdowns! 🥝🪂**
