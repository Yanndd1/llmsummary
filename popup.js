document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("summarizeBtn");
  const status = document.getElementById("status");
  const summaryEl = document.getElementById("summary");

  btn.addEventListener("click", async () => {
    try {
      status.textContent = "⏳ Extraction du contenu…";
      summaryEl.innerHTML = "";

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("Aucun onglet actif");

      // 1. ----- Extraction -----
      const pageText = await new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tab.id, { type: "extract" }, (resp) => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          if (!resp?.text) return reject(new Error("Pas de contenu extrait"));
          resolve(resp.text);
        });
      });

      // 2. ----- Appel ChatGPT -----
      status.textContent = "💬 Envoi à ChatGPT…";

      const resp = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "summarize", text: pageText }, (r) => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          resolve(r);
        });
      });

      // 3. ----- Affichage -----
      if (resp?.ok) {
        status.textContent = "✅ Résumé obtenu :";
        renderBulletList(resp.summary);
      } else {
        throw new Error(resp?.error || "Réponse vide");
      }
    } catch (err) {
      console.error(err);
      status.textContent = "❌ Erreur : " + (err.message || err);
    }
  });

  function renderBulletList(text) {
    // Coupe par ligne et retire les puces existantes
    const items = text
      .split(/\n+/)
      .map((l) => l.replace(/^[-•\s]+/, "").trim())
      .filter(Boolean);

    const ul = document.createElement("ul");
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    summaryEl.innerHTML = "";
    summaryEl.appendChild(ul);
  }
});
