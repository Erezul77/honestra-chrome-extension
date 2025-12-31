# Honestra – Firewall for Teleological & Narrative Fallacies

Honestra is a bilingual (English + Hebrew) *teleology-aware firewall* for AI outputs and system messages.  
It detects anthropomorphic, purpose-loaded language (teleological narratives), and **narrative fallacies** – surfacing clear, structured alerts.

This repo contains the **Chrome extension** for Honestra.  
The extension can analyze:
- Single responses (short text)
- Selected text on any webpage (via context menu)
- Longer documents (via *Document Mode* with density + infiltration analysis)

---

## ✨ Features

- **Bilingual detection (EN + HE)**  
  Detects teleological and narrative patterns in both English and Hebrew.

- **25 Detection Categories**  
  Uses a carefully engineered rule set (Honestra Guard) rather than a black-box LLM.

### 🎯 Core Teleology Categories (15)

| Category | Example | Icon |
|----------|---------|------|
| `anthropomorphic_self` | "I want to help you…" | 🤖 |
| `anthropomorphic_model` | "the model is trying to protect you…" | 🤖 |
| `cosmic_purpose` | "the universe is guiding this answer…" | 🌌 |
| `collective_reification` | "the people want", "society punishes" | 👥 |
| `institutional_reification` | "the market decides", "justice demands" | 🏛️ |
| `nature_reification` | "nature chose", "evolution designed" | 🧬 |
| `history_reification` | "history will judge", "progress demands" | 📜 |
| `just_world` | "he got what he deserved" | ⚖️ |
| `body_teleology` | "your body knows", "listen to your heart" | 🫀 |
| `tech_animism` | "my computer hates me", "the app refuses" | 💻 |
| `divine_teleology` | "God's plan", "everything happens for a reason" | ✨ |
| `pathetic_fallacy` | "the sky is crying", "angry clouds" | 🌧️ |
| `karma` | "what goes around comes around" | 🔄 |
| `conspiracy` | "they don't want you to know", "wake up" | 🕵️ |
| `agent_detection` | "there are no coincidences" | 👁️ |

### 📖 Narrative Fallacy Categories (10) – NEW!

| Category | Example | Icon |
|----------|---------|------|
| `narrative_fallacy` | "the story of my life", "new chapter" | 📖 |
| `essentialism` | "that's just who I am", "I was born this way" | 🔒 |
| `victim_narrative` | "they always do this to me", "everyone is against me" | 😢 |
| `hindsight_bias` | "I knew it would happen", "it was obvious" | 🔮 |
| `magical_thinking` | "law of attraction", "I'm manifesting" | ✨ |
| `signs_omens` | "it's a sign", "the universe is telling me" | 🪧 |
| `purpose_question` | "why did this happen to me?", "what's the lesson?" | ❓ |
| `emotion_personification` | "my fear tells me", "anxiety wants" | 💭 |
| `time_teleology` | "time will tell", "time heals all wounds" | ⏰ |
| `destiny_language` | "I was destined to", "it was meant to be" | ⭐ |

- **Severity & status badges**
  - `CLEAN` – no teleology found
  - `INFO` – mild / local teleology
  - `WARN` – meaningful teleological framing
  - `HIGH` – strongly teleological narrative

- **Document Mode (for long texts)**  
  For longer input the extension computes:
  - **Teleology Density** – fraction of sentences that are teleological  
  - **Infiltration Score** – how deeply teleology shapes the *overall narrative*  
    - `low` – local language tics, global meaning still mechanistic  
    - `medium` – teleology is active but not fully dominant  
    - `high` – teleology is central to the narrative  

- **Two ways to use it**
  - Popup: paste text and click **Analyze**
  - Context menu: select text on any page → *Analyze with Honestra Guard*

---

## 🧠 How It Works (High Level)

The Chrome extension sends the selected or pasted text to the Honestra API:

- API endpoint (production): `https://honestra.org/api/teleology`
- The API uses the **Honestra Guard** rule engine to:
  - Scan for teleological phrases and patterns
  - Classify the severity
  - Suggest neutral, mechanistic paraphrases
  - For long texts, compute density & infiltration

The extension then:
- Shows a clear status badge (`CLEAN` / `INFO` / `WARN` / `HIGH`)
- Lists the detected pattern types (e.g. `anthropomorphic_model`, `cosmic_purpose`)
- Optionally displays suggested neutral alternatives

---

## 🛠 Installation (Developer Mode)

1. Clone or download this repository.

2. Open Chrome and go to:

   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (top-right toggle).

4. Click **Load unpacked** and select the folder containing this extension.

You should now see **Honestra – Firewall for Teleological Narratives** in your extensions list.

---

## ⚙️ Configuration

The extension reads the API URL from `config.js`:

```javascript
// config.js
const HONESTRA_API_URL = "https://honestra.org/api/teleology";
```

If you want to point to a local dev server instead (for development):

```javascript
const HONESTRA_API_URL = "http://localhost:3000/api/teleology";
```

Make sure the backend Honestra server is running if you use a local URL.

---

## 🚀 Usage

### 1. Popup (manual text analysis)

- Click the Honestra icon in the browser toolbar.
- Paste or type any text (short or long).
- Click **Analyze**.

You will see:
- A status badge (`CLEAN` / `INFO` / `WARN` / `HIGH`)
- Teleology score (0–100%)
- Detected pattern types
- For long text: density & infiltration summary

### 2. Context Menu (right-click on any page)

- Select any text on a webpage.
- Right-click → choose **Analyze with Honestra Guard**.
- A notification will show a quick summary.

### 3. Document Mode (long text)

When the input text is longer than ~600 characters or more than 4 lines, the extension switches to **Document Mode**.

Document Mode returns extra fields from the API, including:
- `documentStatus` – "globally_clean" | "mixed" | "globally_teleological"
- `teleologyDensity` – number between 0 and 1
- `infiltrationScore` – number between 0 and 1
- `infiltrationLabel` – "low" | "medium" | "high"

The popup renders these as:
- **Teleology density** (% of sentences with teleology)
- **Infiltration** (how much teleology shapes the overall story)

This allows you to distinguish between:
- A mechanistic text with a few teleological metaphors
- A narrative that is fundamentally driven by teleological framing

---

## 📡 API Contract (Simplified)

**Request:**

```http
POST /api/teleology
Content-Type: application/json

{
  "text": "The model really wants to help me and the universe is guiding its answers."
}
```

**Response (core fields):**

```json
{
  "text": "…",
  "hasTeleology": true,
  "teleologyScore": 0.8,
  "severity": "warn",
  "reasons": [
    "anthropomorphic_model",
    "cosmic_purpose"
  ],
  "changes": [
    {
      "original": "The model really wants to help me…",
      "rewritten": "the model is configured to help me…",
      "reason": "anthropomorphic_model"
    }
  ],
  "summary": {
    "totalSentences": 4,
    "teleologicalSentences": 2,
    "teleologyDensity": 0.5,
    "documentStatus": "mixed",
    "infiltrationScore": 0.6,
    "infiltrationLabel": "high"
  }
}
```

The extension uses these fields to render both single-sentence and document-level insights.

---

## 🔒 Privacy

- The extension only sends the text you explicitly analyze to the configured Honestra API.
- No tracking, analytics, or third-party beacons are used by the extension itself.
- Logging, if any, happens on the server side and is under the control of the Honestra backend (for research/training).

---

## 🧪 Development

This repo is intentionally minimal:
- Pure JavaScript + HTML for the extension
- No bundler or build step required
- Designed to work directly as a Chrome Manifest V3 extension

Basic dev workflow:

```bash
# Edit the code
# Reload in chrome://extensions
# Test on any page or in the popup
```

For backend / API development, see the main Honestra / Anti-Teleology project (honestra.org server).

---

## 🗺 Roadmap

Planned improvements:
- Per-sentence visualization in Document Mode
- ~~More teleology pattern families (e.g. fate, destiny, karma)~~ ✅ **DONE** (25 categories)
- More fine-grained severity calibration
- Firefox and Edge extension ports
- Optional local-only mode for offline analysis

---

## 📊 Severity Classification

| Severity | Categories |
|----------|------------|
| **BLOCK** | `conspiracy`, `victim_narrative` |
| **WARN** | `anthropomorphic_model`, `cosmic_purpose`, `collective_reification`, `institutional_reification`, `nature_reification`, `history_reification`, `just_world`, `body_teleology`, `divine_teleology`, `karma`, `agent_detection`, `essentialism`, `magical_thinking`, `destiny_language`, `purpose_question`, `narrative_fallacy` |
| **INFO** | `anthropomorphic_self`, `pathetic_fallacy`, `tech_animism`, `hindsight_bias`, `signs_omens`, `emotion_personification`, `time_teleology` |

---

## 📄 License

TBD – suggested: MIT or Apache-2.0.
