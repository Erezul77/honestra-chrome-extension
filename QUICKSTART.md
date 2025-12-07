# 🚀 Quick Start Guide

Get the Honestra Teleology Guard extension running in 3 minutes!

## Step 1: Start the Server (1 min)

```bash
cd "C:\Projects\New integrated project\Honestra"
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

## Step 2: Load the Extension (1 min)

1. Open Chrome and go to: **chrome://extensions/**
2. Toggle **"Developer mode"** (top-right)
3. Click **"Load unpacked"**
4. Navigate to: `C:\Projects\New integrated project\HonestraExtension`
5. Click **"Select Folder"**

✅ You should see "Honestra Teleology Guard" in your extensions!

## Step 3: Test It (1 min)

### Test the Popup

1. Click the Honestra icon in your Chrome toolbar
2. Paste this test text:
   ```
   Your application crashed because the system wanted to protect itself. 
   The universe decided it was time to rest.
   ```
3. Click **"Analyze Text"**
4. See the 🚨 teleology detection!

### Test the Context Menu

1. Go to any website (e.g., news article)
2. Select some text
3. Right-click → **"Analyze with Honestra Guard"**
4. Get a notification + detailed results

## 🎉 Done!

You now have a working teleology detection extension!

## Troubleshooting

**Error: "Failed to analyze text"**
→ Make sure the Honestra server is running at http://localhost:3000

**Extension won't load**
→ Check that all files are in `C:\Projects\New integrated project\HonestraExtension`

**No context menu option**
→ Try reloading the extension (click the refresh icon)

## What Next?

- Read the full [README.md](README.md) for all features
- Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
- Customize the icons in the `icons/` folder
- Update API_URL in the code when deploying to production

---

**Need help?** See the full documentation in README.md

