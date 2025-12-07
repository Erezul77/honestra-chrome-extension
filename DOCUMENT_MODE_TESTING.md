# 🧪 Extension Testing Guide – Document Mode

## 📋 **Quick Test Checklist**

### **Prerequisites:**
- ✅ Dev server running: `http://localhost:3000` (check terminal 7.txt)
- ✅ Extension folder: `C:\Projects\HonestraChromeExtension\`

---

## 🔧 **Load Extension in Chrome**

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select: `C:\Projects\HonestraChromeExtension\`
6. Extension should appear with Honestra logo

---

## 🧪 **Test 1: Single-Text Mode (Short)**

### **Input:**
```
The model really wants to help me.
```

### **Expected Result:**
```
🟠 WARN – score 80%

Detected patterns:
• anthropomorphic_model

Suggested neutral alternatives:
• [neutral rewrite]
```

### **Verify:**
- ✅ Badge shows WARN
- ✅ Single sentence analysis
- ✅ Reasons shown
- ✅ Alternatives shown

---

## 🧪 **Test 2: Document Mode (Long)**

### **Input:**
```
The model really wants to help me and the universe is guiding its answers specifically for me.
But in fact it is just a statistical system trained on data.
The training process optimizes parameters.
Sometimes the model produces outputs that seem meaningful.
This is due to pattern matching in the training corpus.
```

### **Expected Result:**
```
🟡 MIXED – density XX.X%

Document Analysis:
📊 Density: 20.0% (1/5 sentences)
🎯 Infiltration: MEDIUM (XX.X%)
🌌 Cosmic ratio: XX.X%
⚠️ Max severity: warn
📈 Avg score: XX.X%
```

### **Verify:**
- ✅ Badge shows MIXED or GLOBALLY TELEOLOGICAL
- ✅ Document-level metrics shown
- ✅ Density, infiltration, cosmic ratio visible
- ✅ No per-sentence details (summary only)

---

## 🧪 **Test 3: Context Menu (any page)**

1. Go to any webpage (e.g., wikipedia.org)
2. Select text: "The universe decided it was time."
3. Right-click → **Analyze with Honestra Guard**
4. Chrome notification should appear

### **Expected Result:**
```
Notification title: "Honestra Guard"
Notification body: "⚠️ Teleology detected (warn) – score XX%"
```

---

## 🧪 **Test 4: Hebrew Text (Document Mode)**

### **Input:**
```
המערכת מענישה אותי על מה שעשיתי.
היקום מעניש אותי.
זה באמת רק מערכת סטטיסטית.
המודל לא באמת רוצה כלום.
```

### **Expected Result:**
```
🔴 GLOBALLY TELEOLOGICAL – density XX.X%

Document Analysis:
[Hebrew teleology detected]
```

---

## 📊 **Console Logging**

Open popup → Right-click → Inspect → Console

### **Expected Logs:**
```
[Honestra Extension] popup.js loaded
[Honestra Extension] DOMContentLoaded
[Honestra Extension] Analyze button clicked
[Honestra Extension] Text length: XXX isLongText: true/false
[Honestra Extension] Request payload: {...}
[Honestra Extension] Response status: 200
[Honestra Extension] Response JSON: {...}
[Honestra Extension] Rendering DOCUMENT mode result
```

---

## ⚠️ **Troubleshooting**

### **Issue: Extension not loading**
- Check: `manifest.json` has no errors
- Check: All files present (config.js, popup.js, background.js, icons/)
- Reload: Click reload icon in `chrome://extensions/`

### **Issue: API connection failed**
- Check: Dev server running on `http://localhost:3000`
- Check: Terminal 7.txt shows "Ready in X.Xs"
- Check: `config.js` has correct URL

### **Issue: Document mode not triggering**
- Check: Text is >600 chars OR >4 lines
- Check: Console shows `isLongText: true`
- Check: Request payload has `mode: "document"`

### **Issue: No output in popup**
- Check: Console for errors
- Check: `#status` and `#details` divs exist in popup.html
- Check: API returns valid JSON

---

## ✅ **Success Criteria**

All tests pass:
- [x] Single-text mode works for short text
- [x] Document mode activates for long text
- [x] Context menu shows notifications
- [x] Hebrew text is detected correctly
- [x] Console logs are clear and helpful
- [x] No errors in console or terminal

---

**If all tests pass, Document Mode is production-ready!** 🎉

