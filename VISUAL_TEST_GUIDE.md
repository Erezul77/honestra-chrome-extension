# 🧪 Quick Visual Test Guide

After reloading the extension, verify these UI improvements:

## 1. Extension Icon
- [ ] Toolbar shows the Honestra icon (should be the PNG versions)

## 2. Popup Header
- [ ] Opens popup → **Logo visible** (32×32 H-shaped shield)
- [ ] **Title**: "Honestra Guard"
- [ ] **Subtitle**: "Teleology-aware explanation overlay"
- [ ] Clean horizontal separator line below header

## 3. Status Badges

### Test: Clean Text
**Input**: "The neural network processes input data through multiple layers."

**Expected**:
```
✅ CLEAN
```
- Green badge
- No score shown
- No detailed patterns

### Test: Info Level
**Input**: "I want to help you understand this concept."

**Expected**:
```
🔵 INFO          Score: ~30-40%
```
- Blue badge
- Severity: info
- Pattern: anthropomorphic_self

### Test: Warn/High Level
**Input**: "The model really wants to help me."

**Expected**:
```
🟠 WARN          Score: ~60-70%
```
or
```
🔴 HIGH          Score: ~70-80%
```
- Orange or red badge
- Severity: warn → high, or high → critical (depending on mapping)
- Pattern: anthropomorphic_model

### Test: Critical Level
**Input**: "The model really wants to help me and the universe is guiding its answers specifically for me."

**Expected**:
```
🔴 HIGH          Score: ~80%+
```
- Red badge
- Severity: critical or high
- Patterns: anthropomorphic_model, cosmic_purpose
- Multiple neutral alternatives shown

## 4. Reasons Display

Should show:
```
Detected Patterns:
• anthropomorphic_model
• cosmic_purpose
```

**NOT** (old format):
```
Reasons:
• Detected patterns: anthropomorphic_model, cosmic_purpose
```

## 5. Changes Display

Should show:
```
Suggested Neutral Alternatives:
• "model wants to" → "model is configured to"
• "universe is guiding" → "events are unfolding"
```

## 6. Context Menu

- [ ] Select text on any page
- [ ] Right-click → "Analyze with Honestra Guard"
- [ ] Notification appears
- [ ] Popup opens with result

## 7. Hebrew Support

**Input**: "המערכת רוצה לעזור לך"

**Expected**:
- Should detect teleology
- Pattern: anthropomorphic_model (Hebrew)

---

## 🐛 Common Issues

### Logo not showing
→ Clear browser cache, reload extension

### Badge colors wrong
→ Check popup.html CSS loaded correctly

### Still showing "medium" severity
→ Check API route was updated, restart dev server

### Reasons still wrapped
→ Clear browser cache, reload extension

---

**All tests pass?** ✅ Extension is polished and ready for v0.1!

