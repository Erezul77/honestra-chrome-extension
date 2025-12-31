// background.js - Honestra Guard context menu + notifications

console.log("[Honestra Extension] background.js loaded");

// Load config.js in MV3 service worker environment
try {
  importScripts("config.js");
} catch (e) {
  console.error("[Honestra Extension] Failed to import config.js:", e);
}

const API_URL =
  typeof HONESTRA_API_URL === "string" && HONESTRA_API_URL.length > 0
    ? HONESTRA_API_URL
    : "https://www.honestra.org/api/teleology";

// Create context menu - runs on install AND when service worker wakes up
function createContextMenu() {
  // Remove existing to avoid duplicates
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "honestra-analyze-selection",
      title: "🔍 Analyze with Honestra Guard",
      contexts: ["selection"]
    });
    console.log("[Honestra Extension] Context menu created");
  });
}

// Create on install
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Honestra Extension] onInstalled");
  createContextMenu();
});

// Also create on startup (when browser starts or extension is reloaded)
chrome.runtime.onStartup.addListener(() => {
  console.log("[Honestra Extension] onStartup");
  createContextMenu();
});

// Ensure menu exists when service worker wakes
createContextMenu();

function showNotification(title, message, notificationId = null) {
  const id = notificationId || "honestra-" + Date.now();
  chrome.notifications.create(id, {
    type: "basic",
    iconUrl: "icons/icon48.png",
    title,
    message
  });
  return id;
}

// Open popup window when notification is clicked
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith("honestra-")) {
    // Open the popup as a new window
    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: 450,
      height: 550
    });
    chrome.notifications.clear(notificationId);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "honestra-analyze-selection") return;
  const text = info.selectionText || "";
  if (!text.trim()) {
    showNotification("Honestra Guard", "No text selected.");
    return;
  }

  console.log("[Honestra Extension] Context menu clicked, sending to:", API_URL);

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  })
    .then((res) => {
      console.log("[Honestra Extension] BG response status:", res.status);
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }
      return res.json();
    })
    .then((data) => {
      console.log("[Honestra Extension] BG response JSON:", data);

      const hasTeleology = !!data.hasTeleology;
      const score =
        typeof data.teleologyScore === "number" ? data.teleologyScore : 0;
      const severity = data.severity || "none";

      // Save full result to storage so popup can display it
      chrome.storage.local.set({
        lastAnalysis: {
          text,
          result: data,
          timestamp: Date.now()
        }
      });

      // Show notification - click to see full details
      const notifId = "honestra-result-" + Date.now();
      const reasonsList = data.reasons && data.reasons.length > 0 
        ? data.reasons.slice(0, 3).join(", ") 
        : "";
      
      if (!hasTeleology || severity === "none") {
        showNotification(
          "✅ CLEAN",
          `No teleology detected (${(score * 100).toFixed(0)}%)\n\n👆 Click for details`,
          notifId
        );
      } else {
        showNotification(
          `⚠️ ${severity.toUpperCase()}: Teleology Detected`,
          `${reasonsList}\nScore: ${(score * 100).toFixed(0)}%\n\n👆 Click for details`,
          notifId
        );
      }
    })
    .catch((err) => {
      console.error("[Honestra Extension] BG ERROR:", err);
      showNotification(
        "Analysis Failed",
        `Could not connect to Honestra server at ${API_URL}. Make sure it's reachable.`
      );
    });
});
