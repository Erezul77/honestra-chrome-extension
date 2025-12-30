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
    : "https://honestra.org/api/teleology";

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Honestra Extension] onInstalled, creating context menu");
  chrome.contextMenus.create({
    id: "honestra-analyze-selection",
    title: "Analyze with Honestra Guard",
    contexts: ["selection"]
  });
});

function showNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title,
    message
  });
}

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

      // Show notification with click hint
      if (!hasTeleology || severity === "none") {
        showNotification(
          "Honestra Guard",
          `✅ CLEAN – score ${(score * 100).toFixed(0)}%\nClick extension icon for details.`
        );
      } else {
        showNotification(
          "Honestra Guard",
          `⚠️ Teleology detected (${severity}) – score ${(score * 100).toFixed(0)}%\nClick extension icon for details.`
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
