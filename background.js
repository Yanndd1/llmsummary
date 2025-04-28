// background.js – service_worker (v1.1)

async function getApiKey() {
  const { openai_api_key } = await chrome.storage.sync.get("openai_api_key");
  if (!openai_api_key) throw new Error("API key not set");
  return openai_api_key;
}

async function getPromptTemplate() {
  const { prompt_template } = await chrome.storage.sync.get("prompt_template");
  return (
    prompt_template ||
    "Résume la page suivante en français sous forme de points clés (•), le plus concis possible :"
  );
}

async function callChatGPT(apiKey, promptTemplate, pageText) {
  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes web pages in French. Always answer with concise bullet points."
      },
      { role: "user", content: `${promptTemplate}\n\n${pageText}` }
    ],
    max_tokens: 256,
    temperature: 0.4
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || res.statusText);
  return data.choices[0].message.content.trim();
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "summarize") {
    Promise.all([getApiKey(), getPromptTemplate()])
      .then(([apiKey, prompt]) => callChatGPT(apiKey, prompt, msg.text))
      .then((summary) => sendResponse({ ok: true, summary }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true; // keep port open for async
  }
});
