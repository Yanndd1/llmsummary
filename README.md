# llmsummary

# Chrome extension to summarize web pages with chatgpt

**Version 1.1 – Manifest V3**

A lightweight Chrome extension that sends the visible text of the active web‑page to OpenAI’s Chat Completions API and returns a concise, bullet‑point summary right in the popup.

---

##  Features

| Feature | Details |
|---------|---------|
| **One‑click summarization** | Click the toolbar icon and get a GPT‑generated overview of the current page. |
| **Custom prompt** | Define your own prompt template (language, tone, length, etc.) from the Options page. |
| **Bullet‑point output** | Summaries are rendered as an easy‑to‑scan list with larger font size. |
| **Manifest V3 / Service‑Worker** | Modern architecture, no persistent background page. |
| **Privacy‑aware** | Only page text is sent to the OpenAI endpoint; no cookies, no browsing history, no analytics. |
| **Open‑source** | MIT‑licensed. Fork it, tweak it, make it your own. |

---

##  Installation

1. **Download or clone** this repository.  
2. Open **`chrome://extensions/`** and enable **Developer mode** (top‑right).  
3. Click **“Load unpacked”** and select the project folder.  
4. You should now see the *ChatGPT Page Summarizer* icon in your toolbar.

> Edge / Brave / Opera users: the same steps apply, just open your browser’s extensions page.

---

##  First‑time setup

1. Right‑click the extension icon → **Options**  
   *(or find the “Options” link under the extension card in `chrome://extensions/`).*  
2. Paste your **OpenAI API key** (starts with `sk-…`).  
3. Optionally adjust the **Prompt template** – defaults to:  
   ```
   Summarize the following web page in French as concise bullet points:
   ```  
4. Click **Save**. A check badge confirms that the settings are stored.

> Your key & prompt are saved in `chrome.storage.sync`, which means they sync across Chrome profiles using the same Google account (if sync is enabled).

---

##  Usage

1. Navigate to any article, blog post, PDF rendered in the browser, etc.  
2. Click **📄 “Summarize this page”** in the popup.  
3. Wait a few seconds – the status label shows extraction / API call progress.  
4. Read the summary bullets; copy or tweak as needed.

---

##  Customization

| What | How |
|------|-----|
| **Prompt** | Edit in the Options page. Use placeholders like `{title}` or `{url}` (future road‑map). |
| **Max tokens / temperature** | Hard‑coded in `background.js` – tweak `max_tokens` & `temperature`. |
| **Extraction logic** | Replace the naive `extractVisibleText()` with [Readability.js](https://github.com/mozilla/readability) or your own scraper. |
| **List styling** | Modify `popup.css` (`.summary-list` and `.summary-list li`) to change font, spacing or use check‑marks instead of bullets. |

---

##  Permissions explained

| Permission | Why it’s needed |
|------------|-----------------|
| `activeTab` | Allows reading the DOM of the active tab on user action. |
| `storage`   | Stores API key & prompt template. |
| `scripting` | (Future) dynamic injection if you remove static content‑script. |
| `https://api.openai.com/*` | Fetch summaries from OpenAI. |

The content‑script is only used to gather visible text. **No cookies, credentials or form data** are accessed.

---

##  Security tips

* Use a **restricted OpenAI key** with rate‑limits and *only* the `chat` scope.  
* If you don’t trust Chrome sync, comment out the `sync` storage area and use `local`.  
* Review the code – it’s ~200 lines total.

See `SECURITY.md` for a deeper threat‑model analysis.

---

##  Road‑map

* Optional auto‑injection *only* on click (remove `<all_urls>`).  
* Multi‑language support with prompt variables.  
* Context‑menu action (“Summarize selection”).  
* Dark‑mode popup.  
* Firefox WebExtension build.

---

##  Contributing

PRs and issues are welcome!  
1. Fork → feature branch (`feat/my-cool-thing`)  
2. `npm install` (if you add build tooling)  
3. Commit with conventional messages.  
4. Submit a Pull Request.

---

##  License

[MIT](LICENSE) – do whatever you want, just keep the copyright & licence file.

---


Happy summarizing! 
