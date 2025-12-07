# 🔧 Honestra Chrome Extension - API Integration Fix

## Summary of Changes

Fixed the standalone Honestra Chrome Extension to properly:
1. ✅ Load configuration from `config.js`
2. ✅ Send text to the correct API_URL
3. ✅ Parse API responses correctly
4. ✅ Show detailed console logs for debugging

---

## Files Modified

### 1. **popup.js**

#### Changes:
- **Updated API_URL declaration** with better fallback logic and immediate logging
- **Enhanced `analyzeText()` function** with detailed step-by-step logging:
  - Logs when function is called
  - Logs API_URL being used
  - Logs text being analyzed
  - Logs payload before sending
  - Logs HTTP response status
  - Logs full JSON response
  - Logs parsed values (hasTeleology, severity, score, reasons)
- **Enhanced `displayResult()` function**:
  - Logs when called with full data object
  - Logs extracted values
  - Logs status badge info

#### Key logging points:
```javascript
console.log("[Honestra Extension][popup] API_URL in this context:", API_URL);
console.log("[Honestra Extension][popup] analyzeText() called");
console.log("[Honestra Extension][popup] Using API_URL:", API_URL);
console.log("[Honestra Extension][popup] Text to analyze:", ...);
console.log("[Honestra Extension][popup] Response JSON:", data);
console.log("[Honestra Extension][popup] Parsed:", { hasTeleology, severity, score, reasons });
console.log("[Honestra Extension][popup] displayResult called with:", data);
console.log("[Honestra Extension][popup] Status badge:", badge);
```

---

### 2. **background.js**

#### Changes:
- **Wrapped `importScripts()`** in try-catch with logging
- **Updated API_URL declaration** with better fallback logic and immediate logging
- **Enhanced `analyzeAndNotify()` function** with detailed logging:
  - Logs when function is called
  - Logs API_URL being used
  - Logs selected text
  - Logs payload before sending
  - Logs HTTP response status
  - Logs full JSON response
  - Logs parsed values (hasTeleology, severity, score, reasons)
  - Logs notification details
  - Logs when injecting warning overlay

#### Key logging points:
```javascript
console.log("[Honestra Extension][background] config.js loaded in background.");
console.log("[Honestra Extension][background] API_URL in this context:", API_URL);
console.log("[Honestra Extension][background] analyzeAndNotify() called");
console.log("[Honestra Extension][background] Using API_URL:", API_URL);
console.log("[Honestra Extension][background] Response JSON:", data);
console.log("[Honestra Extension][background] Parsed:", { ... });
console.log("[Honestra Extension][background] Showing notification:", notificationOptions);
```

---

### 3. **popup.html** (Already Correct)

✅ **No changes needed** - already loads scripts in correct order:
```html
<script src="config.js"></script>
<script src="popup.js"></script>
```

---

### 4. **config.js** (Already Correct)

✅ **No changes needed** - already properly defines:
```javascript
const HONESTRA_API_URL = "http://localhost:3000/api/teleology";
```

---

## Expected Console Output

### When loading popup:
```
[Honestra Extension][popup] API_URL in this context: http://localhost:3000/api/teleology
```

### When clicking "Analyze" with teleological text:
```
[Honestra Extension][popup] analyzeText() called
[Honestra Extension][popup] Using API_URL: http://localhost:3000/api/teleology
[Honestra Extension][popup] Text to analyze: The model really wants to help me and the universe is guiding its answers specifically for me.
[Honestra Extension][popup] Sending payload: {text: "The model really wants to help me and the universe is guiding its answers specifically for me."}
[Honestra Extension][popup] Response status: 200
[Honestra Extension][popup] Response JSON: {
  text: "The model really wants to help me and the universe is guiding its answers specifically for me.",
  hasTeleology: true,
  teleologyScore: 0.8,
  severity: "high",
  reasons: ["anthropomorphic_model", "cosmic_purpose"],
  changes: [...]
}
[Honestra Extension][popup] Parsed: {hasTeleology: true, severity: "high", score: 0.8, reasons: Array(2)}
[Honestra Extension][popup] displayResult called with: {text: "...", hasTeleology: true, ...}
[Honestra Extension][popup] displayResult extracted: {hasTeleology: true, teleologyScore: 0.8, severity: "high", reasons: Array(2), changesCount: 2}
[Honestra Extension][popup] Status badge: {label: "HIGH", icon: "🔴", className: "status-high"}
```

### When using context menu (background service worker console):
```
[Honestra Extension][background] config.js loaded in background.
[Honestra Extension][background] API_URL in this context: http://localhost:3000/api/teleology
[Honestra Extension][background] analyzeAndNotify() called
[Honestra Extension][background] Using API_URL: http://localhost:3000/api/teleology
[Honestra Extension][background] Selected text: The universe decided it was time.
[Honestra Extension][background] Sending payload: {text: "The universe decided it was time."}
[Honestra Extension][background] Response status: 200
[Honestra Extension][background] Response JSON: {text: "...", hasTeleology: true, ...}
[Honestra Extension][background] Parsed: {hasTeleology: true, severity: "warn", score: 0.6, reasons: Array(1)}
[Honestra Extension][background] Showing notification: {type: "basic", iconUrl: "icons/icon128.png", title: "⚠️ Teleology Detected - WARN", ...}
```

---

## Testing Instructions

### 1. Reload Extension
1. Go to `chrome://extensions/`
2. Find "Honestra Teleology Guard"
3. Click the **refresh icon** 🔄

### 2. Test Popup Analysis

1. **Click the Honestra icon** in toolbar
2. **Right-click inside the popup** → **Inspect**
3. Go to **Console tab**
4. **Paste this text** in the textarea:
   ```
   The model really wants to help me and the universe is guiding its answers specifically for me.
   ```
5. **Click "Analyze Text"**

**Expected Results:**
- Console shows all the detailed logs listed above
- UI shows **🔴 HIGH** badge
- Severity: high
- Patterns: anthropomorphic_model, cosmic_purpose
- Score: ~80%
- Suggested alternatives shown

### 3. Test Context Menu

1. Go to **any webpage**
2. **Select this text:** "The universe decided it was time for this to happen."
3. **Right-click** → **"Analyze with Honestra Guard"**
4. **Check service worker console:**
   - In `chrome://extensions/`, click **"service worker"** link under Honestra extension
   - See detailed logs

**Expected Results:**
- Notification appears with teleology detected
- Service worker console shows all detailed logs
- Popup opens with analysis

### 4. Test Clean Text

1. **Paste this** in popup:
   ```
   The neural network processes input data through multiple layers of transformations.
   ```
2. **Click "Analyze"**

**Expected Results:**
- Console shows logs
- UI shows **✅ CLEAN** badge
- No patterns detected

---

## Debugging Guide

### If popup doesn't work:

1. **Open popup console:**
   - Right-click popup → Inspect → Console
2. **Look for:**
   - `API_URL in this context:` - Should show correct URL
   - `analyzeText() called` - Should appear when clicking button
   - Any error messages in red

### If context menu doesn't work:

1. **Open service worker console:**
   - `chrome://extensions/` → Click "service worker" link
2. **Look for:**
   - `config.js loaded in background.` - Should appear on load
   - `API_URL in this context:` - Should show correct URL
   - `analyzeAndNotify() called` - Should appear when using context menu
   - Any error messages in red

### Common Issues:

**Issue:** `API_URL shows undefined`
- **Fix:** Make sure `config.js` exists and loads before other scripts

**Issue:** `Response status: 404 or 500`
- **Fix:** Make sure Honestra server is running at `http://localhost:3000`

**Issue:** `hasTeleology: false` for teleological text
- **Fix:** Check server-side guard logic (not extension issue)

**Issue:** Console shows nothing
- **Fix:** Make sure you're looking at the right console (popup vs service worker)

---

## What Was NOT Changed

✅ **manifest.json** - No changes needed
✅ **config.js** - No changes needed (already correct)
✅ **popup.html** - No changes needed (already loads config.js correctly)
✅ **icons/** - No changes to icons
✅ **API server** - No server-side changes

---

## Next Steps

After verifying everything works:

1. ✅ Test with multiple teleological phrases
2. ✅ Test with clean mechanistic text
3. ✅ Test with Hebrew text
4. ✅ Verify both popup and context menu work
5. ✅ Check all console logs are clear and helpful

If everything passes, the extension is ready for distribution!

---

**All changes focused on wiring and logging - no refactoring, just correctness!** 🎯

