(function () {
  console.log("[Honestra Extension] popup.js loaded");

  const API_URL =
    typeof HONESTRA_API_URL === "string" && HONESTRA_API_URL.length > 0
      ? HONESTRA_API_URL
      : "https://www.honestra.org/api/teleology";

  // Pattern categories for highlighting
  const PATTERN_CATEGORIES = {
    anthropomorphic: [
      "anthropomorphic_model", "anthropomorphic", "anthropomorphic_self",
      "model_wants", "model_tries", "ai_intention", "model_intention", "system_wants"
    ],
    cosmic: [
      "cosmic_purpose", "cosmic", "universe_purpose", "fate", "destiny",
      "meant_to_be", "cosmic_intention"
    ],
    design: [
      "design_language", "nature_design", "natural_purpose", "evolved_to",
      "designed_for", "purpose_driven", "nature_reification"
    ],
    collective: [
      "collective_reification", "institutional_reification", "history_reification"
    ],
    justworld: [
      "just_world"
    ],
    body: [
      "body_teleology"
    ],
    tech: [
      "tech_animism"
    ],
    divine: [
      "divine_teleology"
    ],
    pathetic: [
      "pathetic_fallacy"
    ],
    karma: [
      "karma"
    ],
    conspiracy: [
      "conspiracy"
    ],
    agent: [
      "agent_detection"
    ]
  };

  function getPatternCategory(reason) {
    const reasonLower = (reason || "").toLowerCase();
    for (const [category, patterns] of Object.entries(PATTERN_CATEGORIES)) {
      if (patterns.some(p => reasonLower.includes(p))) {
        return category;
      }
    }
    // Default to anthropomorphic for unknown patterns
    return "anthropomorphic";
  }

  function getCategoryIcon(category) {
    const icons = {
      anthropomorphic: "🤖",
      cosmic: "🌌",
      design: "🧬",
      collective: "👥",
      justworld: "⚖️",
      body: "🫀",
      tech: "💻",
      divine: "✨",
      pathetic: "🌧️",
      karma: "🔄",
      conspiracy: "🕵️",
      agent: "👁️"
    };
    return icons[category] || "⚠️";
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function highlightText(originalText, changes, reasons) {
    if (!changes || changes.length === 0) {
      return escapeHtml(originalText);
    }

    let result = originalText;
    const highlights = [];

    // Collect all phrases to highlight
    changes.forEach((change, index) => {
      if (change && change.original) {
        const category = getPatternCategory(change.reason || (reasons && reasons[index]));
        highlights.push({
          text: change.original,
          category: category
        });
      }
    });

    // Sort by length (longest first) to avoid partial replacements
    highlights.sort((a, b) => b.text.length - a.text.length);

    // Replace each phrase with highlighted version
    highlights.forEach(({ text, category }) => {
      const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedText, 'gi');
      result = result.replace(regex, match => 
        `<span class="highlight-${category}">${escapeHtml(match)}</span>`
      );
    });

    // Escape any remaining text that wasn't highlighted
    // This is tricky - we need to preserve our highlight tags
    // So we'll do a different approach - escape first, then add highlights
    
    // Actually let's redo this more carefully
    return highlightTextSafe(originalText, highlights);
  }

  function highlightTextSafe(originalText, highlights) {
    if (!highlights || highlights.length === 0) {
      return escapeHtml(originalText);
    }

    // Find all matches with their positions
    const matches = [];
    highlights.forEach(({ text, category }) => {
      let searchText = originalText.toLowerCase();
      let searchTerm = text.toLowerCase();
      let pos = 0;
      while ((pos = searchText.indexOf(searchTerm, pos)) !== -1) {
        matches.push({
          start: pos,
          end: pos + text.length,
          category: category,
          text: originalText.substring(pos, pos + text.length)
        });
        pos += 1;
      }
    });

    if (matches.length === 0) {
      return escapeHtml(originalText);
    }

    // Sort by start position
    matches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches (keep first/longer)
    const filtered = [];
    let lastEnd = -1;
    matches.forEach(match => {
      if (match.start >= lastEnd) {
        filtered.push(match);
        lastEnd = match.end;
      }
    });

    // Build highlighted string
    let result = "";
    let currentPos = 0;
    filtered.forEach(match => {
      // Add unhighlighted text before this match
      if (match.start > currentPos) {
        result += escapeHtml(originalText.substring(currentPos, match.start));
      }
      // Add highlighted match
      result += `<span class="highlight-${match.category}">${escapeHtml(match.text)}</span>`;
      currentPos = match.end;
    });
    // Add remaining text
    if (currentPos < originalText.length) {
      result += escapeHtml(originalText.substring(currentPos));
    }

    return result;
  }

  function getReasonExplanation(reason) {
    const explanations = {
      "anthropomorphic_model": "The AI/model is described as having human-like intentions or desires",
      "anthropomorphic_self": "The AI speaks of itself as having feelings, desires, or preferences",
      "anthropomorphic": "Non-human entities described with human characteristics or intentions",
      "cosmic_purpose": "Suggests the universe or cosmos has intentional goals or plans",
      "design_language": "Uses language implying intentional design by nature or evolution",
      "model_wants": "Attributes 'wanting' or 'wishing' to an AI system",
      "model_tries": "Attributes 'trying' or 'attempting' to an AI system",
      "purpose_driven": "Describes processes as having inherent purposes or goals",
      "fate": "Suggests events are predetermined or meant to happen",
      "natural_purpose": "Attributes purposeful design to natural processes",
      // Reification categories
      "collective_reification": "Attributes intentions, emotions, or agency to collectives (people, society, the public)",
      "institutional_reification": "Attributes intentions or emotions to institutions (market, government, law)",
      "nature_reification": "Attributes intentional design or choice to nature or evolution",
      "history_reification": "Attributes agency or judgment to history or progress",
      // New categories
      "just_world": "Assumes the world inherently rewards good and punishes bad (Just World Fallacy)",
      "body_teleology": "Attributes knowledge, wisdom, or intention to the body",
      "tech_animism": "Attributes intention, emotion, or refusal to technology/devices",
      "divine_teleology": "References divine plans, God's will, or spiritual purpose",
      "pathetic_fallacy": "Attributes human emotions to nature or weather",
      "karma": "Assumes cosmic justice or automatic moral consequences",
      "conspiracy": "Suggests coordinated hidden intent by vague 'they' or elites",
      "agent_detection": "Sees intentional agency in random events (everything happens for a reason)"
    };
    
    const reasonLower = (reason || "").toLowerCase();
    for (const [key, explanation] of Object.entries(explanations)) {
      if (reasonLower.includes(key)) {
        return explanation;
      }
    }
    return "This phrase contains teleological language that implies purpose or intention";
  }

  function getSeverityInfo(severity) {
    const info = {
      none: { 
        icon: "✅", 
        title: "Clean", 
        subtitle: "No teleological language detected",
        class: "clean"
      },
      info: { 
        icon: "🔵", 
        title: "Info", 
        subtitle: "Minor teleological patterns (common figures of speech)",
        class: "info"
      },
      warn: { 
        icon: "🟠", 
        title: "Warning", 
        subtitle: "Notable teleological language detected",
        class: "warn"
      },
      medium: { 
        icon: "🟠", 
        title: "Warning", 
        subtitle: "Notable teleological language detected",
        class: "warn"
      },
      high: { 
        icon: "🔴", 
        title: "High Alert", 
        subtitle: "Strong teleological framing present",
        class: "high"
      },
      block: { 
        icon: "🚨", 
        title: "Critical", 
        subtitle: "Potentially harmful conspiracy/misinformation patterns",
        class: "high"
      },
      critical: { 
        icon: "🔴", 
        title: "Critical", 
        subtitle: "Pervasive teleological framing",
        class: "high"
      }
    };
    return info[severity] || info.none;
  }

  document.addEventListener("DOMContentLoaded", () => {
    console.log("[Honestra Extension] DOMContentLoaded");

    const inputEl = document.getElementById("input");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const btnText = document.getElementById("btnText");
    const resultsContainer = document.getElementById("results-container");
    const statusBanner = document.getElementById("status-banner");
    const highlightedText = document.getElementById("highlighted-text");
    const highlightedSection = document.getElementById("highlighted-section");
    const detailsSection = document.getElementById("details-section");
    const suggestionsSection = document.getElementById("suggestions-section");
    const suggestionsList = document.getElementById("suggestions-list");

    if (!inputEl || !analyzeBtn) {
      console.error("[Honestra Extension] Missing popup elements");
      return;
    }

    function showResults(data, originalText) {
      const hasTeleology = !!data.hasTeleology;
      const score = typeof data.teleologyScore === "number" ? data.teleologyScore : 0;
      const severity = data.severity || "none";
      const reasons = Array.isArray(data.reasons) ? data.reasons : [];
      const changes = Array.isArray(data.changes) ? data.changes : [];

      const sevInfo = hasTeleology ? getSeverityInfo(severity) : getSeverityInfo("none");

      // Status Banner
      statusBanner.className = `status-banner ${sevInfo.class}`;
      statusBanner.innerHTML = `
        <span class="status-icon">${sevInfo.icon}</span>
        <div class="status-text">
          <div class="title">${sevInfo.title}</div>
          <div class="subtitle">${sevInfo.subtitle}</div>
        </div>
        <span class="score-badge">${Math.round(score * 100)}%</span>
      `;

      // Highlighted Text
      if (originalText && originalText.length < 1000) {
        highlightedSection.style.display = "block";
        const highlighted = highlightTextSafe(originalText, 
          changes.map(c => ({
            text: c.original,
            category: getPatternCategory(c.reason)
          }))
        );
        highlightedText.innerHTML = highlighted || escapeHtml(originalText);
      } else {
        highlightedSection.style.display = "none";
      }

      // Details Section
      let detailsHtml = "";
      
      if (hasTeleology && reasons.length > 0) {
        detailsHtml += `<div class="section-title">🎯 Detected Patterns</div>`;
        reasons.forEach(reason => {
          const category = getPatternCategory(reason);
          const icon = getCategoryIcon(category);
          detailsHtml += `
            <div class="detail-item">
              <span class="detail-icon">${icon}</span>
              <div class="detail-content">
                <div class="detail-label">${formatReasonLabel(reason)}</div>
                <div class="detail-explanation">${getReasonExplanation(reason)}</div>
              </div>
            </div>
          `;
        });
      } else if (!hasTeleology) {
        detailsHtml += `
          <div class="detail-item">
            <span class="detail-icon">👍</span>
            <div class="detail-content">
              <div class="detail-label">Text appears neutral</div>
              <div class="detail-explanation">No anthropomorphic, cosmic-purpose, or design-intent language was detected.</div>
            </div>
          </div>
        `;
      }

      detailsSection.innerHTML = detailsHtml;

      // Suggestions Section
      if (changes.length > 0) {
        suggestionsSection.style.display = "block";
        let suggestionsHtml = "";
        changes.forEach(change => {
          if (change && change.original && change.rewritten) {
            suggestionsHtml += `
              <div class="suggestion-item">
                <span class="original">"${escapeHtml(change.original)}"</span>
                <span class="arrow">→</span>
                <span class="rewritten">"${escapeHtml(change.rewritten)}"</span>
              </div>
            `;
          }
        });
        suggestionsList.innerHTML = suggestionsHtml;
      } else {
        suggestionsSection.style.display = "none";
      }

      resultsContainer.classList.add("show");
    }

    function formatReasonLabel(reason) {
      return reason
        .replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    async function analyze() {
      const text = inputEl.value.trim();
      if (!text) {
        alert("Please enter text to analyze.");
        return;
      }

      console.log("[Honestra Extension] Analyzing...");
      analyzeBtn.disabled = true;
      btnText.innerHTML = '<span class="loading-spinner"></span> Analyzing...';
      resultsContainer.classList.remove("show");

      try {
        const isLongText = text.length > 600 || text.split(/\r?\n/).length > 4;
        const payload = isLongText ? { text, mode: "document" } : { text };

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error("HTTP " + res.status);
        }

        const data = await res.json();
        console.log("[Honestra Extension] Response:", data);

        if (data.mode === "document" && data.summary) {
          showDocumentResults(data, text);
        } else {
          showResults(data, text);
        }

      } catch (err) {
        console.error("[Honestra Extension] Error:", err);
        alert(`Could not connect to Honestra server.\n\nMake sure ${API_URL} is reachable.`);
      } finally {
        analyzeBtn.disabled = false;
        btnText.textContent = "🔍 Analyze Text";
      }
    }

    function showDocumentResults(data, originalText) {
      const s = data.summary;
      
      // Determine severity from document status
      let sevInfo;
      if (s.documentStatus === "globally_clean") {
        sevInfo = getSeverityInfo("none");
      } else if (s.documentStatus === "mixed" || s.teleologyDensity < 0.5) {
        sevInfo = getSeverityInfo("warn");
      } else {
        sevInfo = getSeverityInfo("high");
      }

      // Status Banner
      statusBanner.className = `status-banner ${sevInfo.class}`;
      statusBanner.innerHTML = `
        <span class="status-icon">${sevInfo.icon}</span>
        <div class="status-text">
          <div class="title">Document: ${s.documentStatus.replace(/_/g, " ").toUpperCase()}</div>
          <div class="subtitle">${s.teleologicalSentences} of ${s.totalSentences} sentences contain teleology</div>
        </div>
        <span class="score-badge">${Math.round(s.teleologyDensity * 100)}%</span>
      `;

      // Hide highlighted section for documents (too long)
      highlightedSection.style.display = "none";

      // Details Section
      let detailsHtml = `<div class="section-title">📊 Document Metrics</div>`;
      
      detailsHtml += `
        <div class="detail-item">
          <span class="detail-icon">📈</span>
          <div class="detail-content">
            <div class="detail-label">Teleology Density: ${(s.teleologyDensity * 100).toFixed(1)}%</div>
            <div class="detail-explanation">Percentage of sentences containing teleological language</div>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🎯</span>
          <div class="detail-content">
            <div class="detail-label">Infiltration: ${s.infiltrationLabel.toUpperCase()} (${(s.infiltrationScore * 100).toFixed(1)}%)</div>
            <div class="detail-explanation">How deeply teleological framing affects the overall meaning</div>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">🌌</span>
          <div class="detail-content">
            <div class="detail-label">Cosmic Ratio: ${(s.cosmicRatio * 100).toFixed(1)}%</div>
            <div class="detail-explanation">Proportion of cosmic/universal purpose language vs. other types</div>
          </div>
        </div>
        <div class="detail-item">
          <span class="detail-icon">⚠️</span>
          <div class="detail-content">
            <div class="detail-label">Max Severity: ${s.maxSeverity.toUpperCase()}</div>
            <div class="detail-explanation">The highest severity level found in any sentence</div>
          </div>
        </div>
      `;

      detailsSection.innerHTML = detailsHtml;
      suggestionsSection.style.display = "none";
      resultsContainer.classList.add("show");
    }

    analyzeBtn.addEventListener("click", analyze);
    inputEl.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        analyze();
      }
    });

    // Check for last analysis from context menu
    chrome.storage.local.get(["lastAnalysis"], (result) => {
      if (result.lastAnalysis) {
        const { text, result: data, timestamp } = result.lastAnalysis;
        const ageMs = Date.now() - timestamp;
        
        if (ageMs < 5 * 60 * 1000) {
          console.log("[Honestra Extension] Loading last analysis");
          inputEl.value = text;
          
          if (data.mode === "document" && data.summary) {
            showDocumentResults(data, text);
          } else {
            showResults(data, text);
          }
        }
        
        chrome.storage.local.remove(["lastAnalysis"]);
      }
    });
  });
})();
