# 🎨 QUICK CUSTOMIZATION GUIDE

## ⚡ 5-MINUTE TWEAKS (No Code Knowledge Needed)

### COLOR SCHEME
Find lines 9-19 in `index.html` and adjust these:

```css
:root {
    --venom-dark: #0a1628;           /* Main background dark */
    --venom-darker: #05091a;         /* Deeper background */
    --venom-blue: #1a2d4a;           /* Card backgrounds */
    --venom-cyan: #00d9ff;           /* Accent color 1 */
    --venom-green: #00ff87;          /* Accent color 2 (primary) */
    --venom-green-dark: #00bf63;     /* Darker green */
    --venom-purple: #6366f1;         /* Optional purple accent */
    --venom-red: #ef4444;            /* Error/urgency red */
    --venom-yellow: #fbbf24;         /* Warning yellow */
}
```

**Try these alternative palettes:**

**Option 1: Blue/Orange (Professional)**
```css
--venom-cyan: #0ea5e9;
--venom-green: #f97316;
--venom-green-dark: #ea580c;
```

**Option 2: Purple/Pink (Modern)**
```css
--venom-cyan: #a855f7;
--venom-green: #ec4899;
--venom-green-dark: #db2777;
```

**Option 3: Teal/Lime (Fresh)**
```css
--venom-cyan: #14b8a6;
--venom-green: #84cc16;
--venom-green-dark: #65a30d;
```

---

## 📠LOGO SIZE
Find line 44 and change height:

```css
.logo {
    height: 150px;  /* Change this: 100px = smaller, 200px = huge */
}
```

---

## ðŸ"± MOBILE LOGO SIZE
Find line 758 and change mobile height:

```css
@media (max-width: 768px) {
    .logo {
        height: 100px;  /* Mobile logo size */
    }
}
```

---

## 📦 UPLOAD SECTION SIZE
Find lines 56-63 to adjust upload zone:

```css
.upload-zone {
    padding: 30px;  /* Increase to 50px for bigger, 20px for smaller */
}
```

---

## 🎯 CARD SPACING
**Global card padding** (lines 255-260):
```css
.info-card {
    padding: 15px;  /* Increase to 25px for more space */
}
```

**Package cards** (lines 398-405):
```css
.package-card {
    padding: 20px;  /* Increase to 30px for more space */
}
```

---

## 📠FONT SIZES

### Headers
```css
/* Main sections - line 280 */
.satellite-section h2 {
    font-size: 18px;  /* Increase to 22px for bigger */
}

/* Package names - line 433 */
.package-name {
    font-size: 20px;  /* Increase to 24px for bigger */
}
```

### Body Text
```css
/* Info cards - line 261 */
.info-card p {
    font-size: 14px;  /* Standard body text */
}

/* Package features - line 458 */
.package-features li {
    font-size: 13px;  /* Smaller details text */
}
```

---

## ⚙ï¸ TERMINAL ANIMATION SPEED

### Typewriter Speed
Find line 886 in JavaScript:
```javascript
await typewriterEffect(phase.output, outputLine, 20);
```
- `20` = 20ms per character (current speed)
- `10` = Faster (10ms per character)
- `40` = Slower (40ms per character)

### Phase Delays
Find lines 883 and 892:
```javascript
await new Promise(resolve => setTimeout(resolve, 300));  // Before output
await new Promise(resolve => setTimeout(resolve, 400));  // After output
```
- Decrease for faster flow
- Increase for more dramatic effect

---

## 🛰 SATELLITE IMAGE SIZE
Find lines 311-314 in JavaScript:
```javascript
const zoom = 19;          // Max zoom (19), decrease for wider view (17-18)
const size = '800x600';   // Image dimensions
```

**Options:**
- `'640x480'` = Smaller, faster loading
- `'800x600'` = Current (balanced)
- `'1024x768'` = Larger, more detail

---

## ðŸ'° PRICING DISPLAY
Find lines 992-1000 in JavaScript (inside the systems array):
```javascript
{
    name: 'Recommended',
    size: '10kW',
    price: 6990,              // Before rebates
    afterRebates: 3990,       // After rebates (what customer pays)
    recommended: true,
    features: [....]
}
```

Just change `price` and `afterRebates` values!

---

## ðŸš¨ URGENCY BANNER TEXT
Find lines 1035-1038 in JavaScript:
```javascript
<div class="urgency-banner">
    <h3>⚠ï¸ Limited Time: Victorian Solar Rebates Available!</h3>
    <p>Solar Victoria rebates ending soon. Act now to save up to $3,500 on your system.</p>
</div>
```

Change text to match current urgency trigger (rebate deadline, seasonal promo, etc.)

---

## 🎯 CTA BUTTON TEXT
Find lines 1086-1087 in JavaScript:
```javascript
<button class="cta-button">Book Free Consultation</button>
<button class="cta-button secondary">Download Full Proposal</button>
```

Change button text to match your goal:
- "Get My Quote Now"
- "Speak to a Solar Expert"
- "Claim My Rebate"
- "Schedule Site Visit"

---

## 📊 METRICS SHOWN
Find lines 1051-1070 in JavaScript (metrics grid):
```javascript
<div class="metric-card">
    <div class="metric-value">$3,990</div>
    <div class="metric-label">Out of Pocket</div>
</div>
```

Add more metrics or change existing ones:
- ROI percentage
- Energy independence %
- Environmental impact (trees planted equivalent)
- System lifespan
- Feed-in tariff earnings

---

## 🎨 ANIMATION EFFECTS

### Hover Lift Amount
Find line 403:
```css
.package-card:hover {
    transform: translateY(-4px);  /* Change -4px to -8px for bigger lift */
}
```

### Button Scale Effect
Find line 483:
```css
.package-btn:hover {
    transform: scale(1.05);  /* Change 1.05 to 1.1 for bigger scale */
}
```

---

## ⚡ ADVANCED: GRADIENT CUSTOMIZATION

### Background Gradient
Find lines 14-16:
```css
body {
    background: linear-gradient(135deg, 
        var(--venom-darker) 0%, 
        var(--venom-dark) 50%, 
        var(--venom-blue) 100%);
}
```

Change `135deg` to:
- `90deg` = Left to right
- `180deg` = Top to bottom
- `45deg` = Diagonal

### Button Gradient
Find line 473:
```css
.package-btn {
    background: linear-gradient(135deg, 
        var(--venom-cyan), 
        var(--venom-green));
}
```

Reverse colors for different look:
```css
background: linear-gradient(135deg, 
    var(--venom-green), 
    var(--venom-cyan));
```

---

## 🔧 COMMON TWEAKS

### Make Everything Bigger (More Spacious)
1. Line 261: Change `padding: 15px;` to `padding: 25px;`
2. Line 403: Change `padding: 20px;` to `padding: 30px;`
3. Line 280: Change `font-size: 18px;` to `font-size: 22px;`
4. Line 433: Change `font-size: 20px;` to `font-size: 24px;`

### Make Everything Smaller (More Compact)
1. Line 261: Change `padding: 15px;` to `padding: 10px;`
2. Line 403: Change `padding: 20px;` to `padding: 15px;`
3. Line 280: Change `font-size: 18px;` to `font-size: 16px;`
4. Line 433: Change `font-size: 20px;` to `font-size: 18px;`

### More Dramatic Animations
1. Line 886: Change `20` to `10` (faster typewriter)
2. Line 403: Change `-4px` to `-8px` (bigger card lift)
3. Line 483: Change `1.05` to `1.1` (bigger button scale)

### Subtle/Professional (Less Flashy)
1. Line 886: Change `20` to `40` (slower typewriter)
2. Line 403: Change `-4px` to `-2px` (subtle card lift)
3. Line 483: Change `1.05` to `1.02` (subtle button scale)

---

## 📱 MOBILE RESPONSIVENESS

All breakpoints at `768px`. To adjust:

Find line 757:
```css
@media (max-width: 768px) {
    /* Mobile styles */
}
```

Change `768px` to:
- `640px` = Smaller phones only
- `1024px` = Include tablets

---

## 🎯 QUICK TEST CHANGES

Want to test a change quickly? Here's the flow:

1. **Edit `index.html`** (change one thing)
2. **Save file**
3. **Git push:**
   ```bash
   git add index.html
   git commit -m "Test: [what you changed]"
   git push origin main
   ```
4. **Wait 30 seconds** for GitHub Pages to deploy
5. **Hard refresh** your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
6. **See the change live!**

---

## ⚠ï¸ DON'T TOUCH THESE (Unless You Know JS)

- Lines 825-927: Terminal typewriter logic
- Lines 929-971: File upload handlers
- Lines 973-1090: Proposal rendering logic
- Google Maps API URL structure

---

## 🆘 UNDO A CHANGE

If something breaks:

```bash
# See recent changes
git log --oneline

# Undo last commit (keeps your changes)
git reset HEAD~1

# Undo last commit (deletes your changes)
git reset --hard HEAD~1

# Push to GitHub
git push origin main --force
```

---

## 💡 PRO TIPS

1. **Make one change at a time** â€" easier to debug
2. **Test on mobile** after any change
3. **Save original values** in a comment before changing
4. **Use browser DevTools** (F12) to test colors live before committing

Example:
```css
.logo {
    height: 150px;  /* Original: 150px, testing: 180px */
}
```

---

## 🎨 WANT A COMPLETE REDESIGN?

Let me know what vibe you're going for:
- **Corporate/Professional** â€" Blues, grays, subtle animations
- **Tech/Futuristic** â€" Purples, pinks, neon accents
- **Eco/Natural** â€" Greens, earth tones, organic shapes
- **Premium/Luxury** â€" Golds, blacks, elegant fonts

I'll create a full custom theme! ðŸš€