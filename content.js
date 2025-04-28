// content.js – extrait le texte visible de la page (inchangé)
function extractVisibleText(maxLength = 12000) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const chunks = [];
  while (walker.nextNode()) {
    const txt = walker.currentNode.textContent.trim();
    if (txt.length) chunks.push(txt);
    if (chunks.join(" ").length > maxLength) break;
  }
  return chunks.join(" ");
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "extract") {
    sendResponse({ text: extractVisibleText() });
  }
});
