(function () {
  console.log("[Honestra Extension] popup.js loaded");

  const API_URL =
    typeof HONESTRA_API_URL === "string" && HONESTRA_API_URL.length > 0
      ? HONESTRA_API_URL
      : "https://honestra.org/api/teleology";

  document.addEventListener("DOMContentLoaded", () => {
    console.log("[Honestra Extension] DOMContentLoaded");

    const inputEl = document.getElementById("input");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const statusEl = document.getElementById("status");
    const detailsEl = document.getElementById("details");

    if (!inputEl || !analyzeBtn || !statusEl || !detailsEl) {
      console.error("[Honestra Extension] Missing popup elements");
      return;
    }

    function setStatus(html) {
      statusEl.innerHTML = html;
    }

    function setDetails(html) {
      detailsEl.innerHTML = html;
    }

    async function analyze() {
      const text = inputEl.value.trim();
      if (!text) {
        setStatus("⚠️ Please enter text to analyze.");
        setDetails("");
        return;
      }

      console.log("[Honestra Extension] Analyze button clicked");
      console.log("[Honestra Extension] Using API_URL:", API_URL);

      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "Analyzing...";
      setStatus("⏳ Analyzing…");
      setDetails("");

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text })
        });

        console.log("[Honestra Extension] Response status:", res.status);

        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }

        const data = await res.json();
        console.log("[Honestra Extension] Response JSON:", data);

        const hasTeleology = !!data.hasTeleology;
        const score =
          typeof data.teleologyScore === "number" ? data.teleologyScore : 0;
        const severity = data.severity || "none";
        const reasons = Array.isArray(data.reasons) ? data.reasons : [];
        const changes = Array.isArray(data.changes) ? data.changes : [];

        let badge = "";
        if (!hasTeleology || severity === "none") {
          badge = `✅ <strong>CLEAN</strong> – score ${(score * 100).toFixed(
            0
          )}%`;
        } else if (severity === "info") {
          badge = `🔵 <strong>INFO</strong> – score ${(score * 100).toFixed(
            0
          )}%`;
        } else if (severity === "warn" || severity === "medium") {
          badge = `🟠 <strong>WARN</strong> – score ${(score * 100).toFixed(
            0
          )}%`;
        } else {
          badge = `🔴 <strong>HIGH</strong> – score ${(score * 100).toFixed(
            0
          )}%`;
        }

        setStatus(badge);

        let html = "";

        if (hasTeleology && reasons.length > 0) {
          html += `<div><strong>Detected patterns:</strong><ul>`;
          for (const r of reasons) {
            html += `<li>${String(r)}</li>`;
          }
          html += `</ul></div>`;
        }

        if (changes.length > 0) {
          html += `<div style="margin-top:6px;"><strong>Suggested neutral alternatives:</strong><ul>`;
          for (const ch of changes) {
            html += `<li>${String(ch.rewritten)}</li>`;
          }
          html += `</ul></div>`;
        }

        if (!html) {
          html = "<em>No additional details.</em>";
        }

        setDetails(html);
      } catch (err) {
        console.error("[Honestra Extension] ERROR:", err);
        setStatus("❌ Analysis Failed");
        setDetails(
          `Could not connect to Honestra server at ${API_URL}.<br/>` +
            `Check that the site is reachable and try again.`
        );
      } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze Text";
      }
    }

    analyzeBtn.addEventListener("click", analyze);
    inputEl.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        analyze();
      }
    });
  });
})();
