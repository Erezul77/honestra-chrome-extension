# 🛡️ Honestra Teleology Guard – Chrome Extension (v0.1)

**Honestra** is a bilingual (English + Hebrew) teleology-aware guard for language models and explanations. This Chrome extension lets you highlight any text in the browser and check whether it uses anthropomorphic or "cosmic purpose" language instead of neutral causal descriptions.

---

## Features

### 🔍 Popup Analysis
- Paste any text into the popup and click **"Analyze"**
- Get instant feedback on teleological patterns

### 🖱️ Context Menu
- Right-click selected text on any page → **"Analyze with Honestra Guard"**
- Quick analysis without opening the popup

### 🌍 Bilingual Support

**English patterns** like:
- "the model really wants to help…"
- "the system is trying to protect you…"
- "the universe is guiding its answers…"
- "it was meant to be…"

**Hebrew patterns** like:
- "אני רוצה לעזור לך" (I want to help you)
- "המערכת מענישה אותי" (The system is punishing me)
- "היקום מנחה" (The universe is guiding)

### 📊 Severity Levels
- ✅ **CLEAN** – No teleology detected
- 🔵 **INFO** – Mild self-anthropomorphism ("I want to help you")
- 🟠 **WARN** – Model/system teleology or "cosmic purpose"
- 🔴 **HIGH** – Stronger or combined patterns

### 💡 Suggested Neutral Alternatives
Shows how the sentence could be phrased in mechanistic/statistical language:
- "the model wants to" → "the model is configured to"
- "universe is guiding" → "events are unfolding according to"

---

## Requirements

This extension talks to a **Honestra API endpoint**.

### Default (Development)
```
http://localhost:3000/api/teleology
```

### Production
You can point it to a public HTTPS endpoint that implements the same JSON API.

**The API URL is defined in `config.js`:**
```javascript
const HONESTRA_API_URL = "http://localhost:3000/api/teleology";
```

Change this value if you host Honestra somewhere else, or use a public deployment.

---

## Installation (Developer Mode)

### Step 1: Set Up the Honestra Server

You need a server that exposes `POST /api/teleology` endpoint.

#### Option A: Run Locally
If you have the Honestra server code:
```bash
cd Honestra
npm run dev
```
Wait for: `✓ Ready on http://localhost:3000`

#### Option B: Use a Public Server
If someone is hosting Honestra publicly, update `config.js` with that URL.

### Step 2: Load the Extension

1. **Clone or download** this repository (or get the ZIP file)
2. **Open Chrome** and go to: `chrome://extensions/`
3. **Enable** "Developer mode" (toggle in top-right)
4. Click **"Load unpacked"**
5. **Select** the `HonestraChromeExtension` folder
6. The **Honestra icon** should now appear in your toolbar ✅

---

## Usage

### 📝 Popup Analysis

1. Click the **Honestra icon** in your toolbar
2. **Paste** some text into the textarea
3. Click **"Analyze Text"**
4. See:
   - Severity badge (CLEAN / INFO / WARN / HIGH)
   - Teleology score (0-100%)
   - Detected patterns
   - Suggested neutral alternatives

### 🖱️ Context Menu Analysis

1. **Select** any text on a web page
2. **Right-click** → "Analyze with Honestra Guard"
3. A **notification** will appear with the result
4. The **popup** opens with detailed analysis

### ⌨️ Keyboard Shortcut
In the popup, press `Ctrl+Enter` to analyze the current text.

---

## Test Cases

Try these examples:

### ✅ Clean Text (Should be CLEAN)
```
The neural network processes input data through multiple layers.
```

### 🟠 Anthropomorphic Model (Should be WARN/HIGH)
```
The model really wants to help me understand this concept.
```

### 🔴 Multiple Patterns (Should be HIGH)
```
The model really wants to help me and the universe is guiding its answers specifically for me.
```

**Expected:**
- 🔴 HIGH badge
- Score: ~80%
- Patterns: `anthropomorphic_model`, `cosmic_purpose`
- 2+ suggested alternatives

### 🌍 Hebrew Support
```
המערכת רוצה לעזור לך
```
**Expected:** Detection of `anthropomorphic_model` (Hebrew)

---

## Configuration

### Changing the API URL

Edit `config.js`:

```javascript
const HONESTRA_API_URL = "https://your-honestra-server.com/api/teleology";
```

After changing:
1. Go to `chrome://extensions/`
2. Click the **refresh icon** on the Honestra extension card
3. Test to confirm it's working

### Host Permissions

If you change to a different domain, update `manifest.json`:

```json
"host_permissions": [
  "https://your-honestra-server.com/*"
]
```

Then reload the extension.

---

## Privacy

- The extension **only sends** the selected/pasted text to your configured Honestra API endpoint
- **No extra tracking**, no analytics
- Logging (if any) is done only on the server side **that you control**
- Text is **not stored** permanently in the extension

---

## API Format

The extension expects this JSON response from `POST /api/teleology`:

```json
{
  "text": "...",
  "hasTeleology": true,
  "teleologyScore": 0.85,
  "severity": "high",
  "reasons": ["anthropomorphic_model", "cosmic_purpose"],
  "changes": [
    {
      "original": "model wants to",
      "rewritten": "model is configured to",
      "reason": "anthropomorphic_model"
    }
  ]
}
```

---

## Troubleshooting

### ❌ "Failed to analyze text"

**Cause:** Extension can't connect to the API server.

**Solutions:**
1. Make sure the Honestra server is running
2. Verify the URL in `config.js` matches your server
3. Check that `host_permissions` in `manifest.json` includes your domain
4. Look at Chrome's console for specific errors (right-click popup → Inspect)

### ❌ Extension won't load

1. Go to `chrome://extensions/`
2. Check for errors on the extension card
3. Make sure all files are present (manifest.json, popup.html, etc.)
4. Try removing and re-adding the extension

### ❌ Context menu not appearing

1. Verify `contextMenus` permission is in manifest.json
2. Reload the extension
3. Check the service worker for errors (click "service worker" link on extension card)

---

## Development

### File Structure

```
HonestraChromeExtension/
├── manifest.json              # Extension configuration
├── config.js                  # API URL configuration (EDIT HERE)
├── popup.html                 # Popup UI
├── popup.js                   # Popup logic
├── background.js              # Service worker (context menu, notifications)
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   └── logo-honestra.svg      # Branded logo
├── README.md                  # This file
├── QUICKSTART.md              # Quick setup guide
└── *.md                       # Additional documentation
```

### Making Changes

1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the **refresh icon** on the extension card
4. Test your changes

### Debugging

- **Popup**: Right-click popup → Inspect → Console tab
- **Background**: Click "service worker" on extension card → Console tab
- Both log extensively with `[Honestra Extension]` prefix

---

## Roadmap

Future enhancements:

- [ ] **Options page** to configure API URL without editing `config.js`
- [ ] **Offline mode** with fully embedded rule engine
- [ ] **History** of analyzed texts
- [ ] **Export** analysis results
- [ ] **Custom severity thresholds**
- [ ] **More languages** (Spanish, French, etc.)
- [ ] **Keyboard shortcuts** configuration
- [ ] **Chrome Web Store** publication

---

## Contributing

Contributions welcome! Areas where help is needed:

- Better icon designs
- UI/UX improvements
- Additional language support
- Bug fixes
- Documentation improvements

---

## License

This extension is part of the Honestra project. See the main Honestra repository for license details.

---

## Support

### For Issues or Questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify your API server is running and accessible
3. Check Chrome extension console for specific errors
4. Ensure `config.js` has the correct API URL

### Related Documentation:

- `QUICKSTART.md` - 3-minute setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical overview
- `V0.1_POLISH_SUMMARY.md` - Recent changes
- `VISUAL_TEST_GUIDE.md` - Testing checklist

---

**Made with care to promote clear, mechanistic explanations.** 🛡️✨
