const apiKeyInput = document.getElementById("apiKey");
const promptInput = document.getElementById("prompt");
const status = document.getElementById("status");

chrome.storage.sync.get(["openai_api_key", "prompt_template"], ({ openai_api_key, prompt_template }) => {
  if (openai_api_key) apiKeyInput.value = openai_api_key;
  if (prompt_template) promptInput.value = prompt_template;
});

document.getElementById("save").addEventListener("click", () => {
  chrome.storage.sync.set(
    { openai_api_key: apiKeyInput.value.trim(), prompt_template: promptInput.value.trim() },
    () => {
      status.textContent = "✅ Paramètres enregistrés";
      setTimeout(() => (status.textContent = ""), 2000);
    }
  );
});
