# AI Fact Checker Chrome Extension

An AI-powered Chrome extension that provides instant fact-checking for highlighted text on any webpage.

## Features

- 🔍 **Instant Fact Checking** - Highlight any text to get an AI-powered truth rating (1-10 scale)
- 🤖 **AI Analysis** - Advanced AI analyzes and verifies claims across any topic
- 💬 **Interactive Chat** - Ask follow-up questions for deeper context
- 🎨 **Clean UI** - Modern popup interface with enable/disable toggle
- 🌓 **Dark Mode Support** - Automatically adapts to system theme

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top-right corner
4. Click "Load unpacked"
5. Select the `extension/public` folder from this repository
6. The extension is now installed!

## Usage

1. Click the extension icon to enable/disable the fact checker
2. Highlight any text on a webpage (minimum 10 characters)
3. A popup will appear with:
   - Truth rating (1-10)
   - Confidence level (Likely True, Uncertain, Likely False)
   - AI-generated explanation
   - Option to get more context

## Project Structure

```
extension/
├── public/              # Chrome extension files
│   ├── extension/       # Content and background scripts
│   │   ├── background.js
│   │   ├── content.js
│   │   └── content.css
│   ├── manifest.json    # Extension manifest
│   ├── popup.html       # Extension popup UI
│   └── popup.js         # Popup functionality
└── app/                 # Next.js web app (optional)
```

## Development

The extension is built with vanilla JavaScript and does not require any build process. Simply edit the files in `extension/public` and reload the extension in Chrome.

## License

MIT
