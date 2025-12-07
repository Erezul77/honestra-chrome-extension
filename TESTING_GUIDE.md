# Testing Guide - Honestra Extension Integration Fix

## What Was Fixed

### Server-Side Changes (`Honestra/app/api/teleology/route.ts`)

1. **Added support for both `text` and `message` fields** in the request body
2. **Transformed API response** to match the format expected by the extension:
   - Added `hasTeleology` boolean (true if score > 0.2)
   - Mapped `manipulationRisk` to `severity` (none/low/medium/high/critical)
   - Built `reasons` array from detected phrases, type, and purpose claim
   - Built `changes` array with neutral paraphrase suggestions
3. **Enhanced logging** to track request/response flow
4. **Kept original analysis** in `rawAnalysis` field for debugging

### Extension-Side Changes

**popup.js:**
- Added comprehensive console logging
- Added validation for response format
- Added better error messages
- Made displayResult more robust with fallback values

**background.js:**
- Added console logging for background analysis
- Made data extraction more robust
- Better error handling

## Testing Steps

### 1. Start the Honestra Server

```bash
cd "C:\Projects\New integrated project\Honestra"
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

### 2. Reload the Extension

1. Open Chrome: `chrome://extensions/`
2. Find "Honestra Teleology Guard"
3. Click the refresh icon (🔄)

### 3. Open Developer Tools

**For Popup:**
1. Click the extension icon to open popup
2. Right-click anywhere in the popup
3. Select "Inspect"
4. Go to "Console" tab

**For Background Worker:**
1. Go to `chrome://extensions/`
2. Find "Honestra Teleology Guard"
3. Click "service worker" link
4. Console will open automatically

### 4. Test Cases

#### Test 1: Clearly Teleological (English)

**Text:**
```
The model really wants to help me and the universe is guiding its answers specifically for me.
```

**Expected Result:**
- Console logs should show:
  - `[Honestra Extension] sending text: ...`
  - `[Honestra Extension] response data: {hasTeleology: true, ...}`
  - `[Honestra Extension] hasTeleology: true`
  - `[Honestra Extension] severity: high` (or critical/medium)
- UI should show:
  - 🚨 or ⚠️ icon
  - "Teleology Detected - HIGH/MEDIUM Severity"
  - Score > 30%
  - Reasons listed (detected phrases, type, etc.)

**Server logs should show:**
```
[Honestra API] text received: "The model really wants..."
[Honestra API] guard result: {teleologyScore: 0.4, ...}
[Honestra API] Returning response: {hasTeleology: true, severity: "medium", ...}
```

#### Test 2: Clean/Mechanistic (English)

**Text:**
```
The model is a statistical system trained on large text corpora and generates the most likely continuation of a sequence.
```

**Expected Result:**
- `hasTeleology: false`
- Severity: "none"
- ✅ "Clean - No Teleology Detected"
- Score close to 0%

#### Test 3: Teleological (Hebrew)

**Text:**
```
המערכת מענישה אותי על מה שעשיתי.
```

**Translation:** "The system is punishing me for what I did."

**Expected Result:**
- `hasTeleology: true`
- Should detect "punishment" concept
- Score > 30%
- Severity: high or critical
- 🚨 warning

#### Test 4: Moderate Teleology

**Text:**
```
The system is trying to teach you a lesson about proper coding practices.
```

**Expected Result:**
- `hasTeleology: true`
- Should detect "trying to" phrase
- Score: 30-60%
- Severity: low or medium
- ⚠️ warning

### 5. Context Menu Test

1. Go to any webpage (e.g., news article)
2. Select teleological text (use Test 1 or Test 3)
3. Right-click → "Analyze with Honestra Guard"
4. Check:
   - Browser notification appears with correct severity
   - Background worker console shows logs
   - Popup opens with analysis (if text was stored)

## Verification Checklist

- [ ] Server starts without errors
- [ ] Extension loads without errors
- [ ] Test 1 (clear teleology) shows **NOT clean** (hasTeleology=true)
- [ ] Test 2 (mechanistic) shows clean (hasTeleology=false)
- [ ] Test 3 (Hebrew) detects teleology
- [ ] Test 4 (moderate) shows appropriate severity
- [ ] Console logs show request/response flow
- [ ] Server logs show analysis details
- [ ] Context menu analysis works
- [ ] Notifications show correct severity

## Troubleshooting

### Still Shows "Clean" for Teleological Text

**Check Server Logs:**
1. Does it show the text was received?
2. Does it show a non-zero `teleologyScore`?
3. Does it return `hasTeleology: true`?

**Check Extension Console:**
1. Does it show the response data?
2. What is the value of `data.hasTeleology`?
3. Are there any JavaScript errors?

### "Failed to analyze text" Error

1. Verify server is running at http://localhost:3000
2. Check server console for errors
3. Try accessing http://localhost:3000/api/teleology directly
4. Check CORS settings (shouldn't be an issue for localhost)

### No Reasons Shown

This is expected if:
- Score is very low (< 0.2)
- No phrases were detected
- LLM didn't generate purposeClaim

The detection will still work, just with fewer details.

## Expected Console Output Example

### Extension Console (Popup)
```
[Honestra Extension] sending text: The model really wants to help me...
[Honestra Extension] POST to: http://localhost:3000/api/teleology
[Honestra Extension] payload: {text: "The model really wants to help me..."}
[Honestra Extension] response status: 200
[Honestra Extension] response data: {text: "...", hasTeleology: true, teleologyScore: 0.4, ...}
[Honestra Extension] hasTeleology: true
[Honestra Extension] severity: medium
[Honestra Extension] teleologyScore: 0.4
[Honestra Extension] displayResult called with: {hasTeleology: true, ...}
```

### Server Console
```
[Honestra][teleology-api] POST handler called
[Honestra API] text received: "The model really wants to help me..."
[Honestra][teleology-api] Calling analyzeTeleology with text: The model really wants...
[Honestra API] guard result: {
  "teleologyScore": 0.4,
  "teleologyType": "personal",
  "manipulationRisk": "low",
  "detectedPhrases": ["trying to", "wants to"],
  ...
}
[Honestra API] Returning response: {
  "text": "...",
  "hasTeleology": true,
  "teleologyScore": 0.4,
  "severity": "medium",
  "reasons": ["Detected phrases: trying to, wants to", "Type: personal"],
  ...
}
```

## Success Criteria

✅ The extension correctly identifies teleological language
✅ Severity levels are appropriate (not always "none")
✅ Console logs show the full request/response chain
✅ Server logs confirm detection is working
✅ All three test languages work (English, Hebrew, moderate)

## Next Steps After Verification

Once confirmed working:
1. Test with real-world examples
2. Adjust threshold if needed (currently 0.2 for `hasTeleology`)
3. Fine-tune severity mapping
4. Consider caching or rate limiting for production
5. Update documentation with actual behavior

