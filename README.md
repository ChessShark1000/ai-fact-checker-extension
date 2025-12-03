# AI Fact Checker Chrome Extension

An AI-powered Chrome extension that provides instant fact-checking for highlighted text on any webpage.

## Features

- 🔍 **Instant Fact Checking** - Highlight any text to get an AI-powered truth rating (1-10 scale)
- 🤖 **AI Analysis** - Advanced AI analyzes and verifies claims across any topic
- 💬 **Interactive Chat** - Ask follow-up questions for deeper context
- 🎨 **Clean UI** - Modern popup interface positioned next to selected text
- 🌓 **Dark Mode Support** - Automatically adapts to system theme
- 🔒 **Secure** - All AI processing happens on our secure backend

## Installation

Install from the [Chrome Web Store](#) (link coming soon)

## Usage

1. Highlight any text on a webpage (minimum 10 characters)
2. A popup will appear next to your selection with:
   - Truth rating (1-10 scale)
   - Visual rating indicator
   - AI-generated explanation
   - "More Context" button for detailed analysis
   - Interactive chat for follow-up questions

## Privacy

We take your privacy seriously. See our [Privacy Policy](https://github.com/ChessShark1000/ai-fact-checker-extension/blob/master/PRIVACY_POLICY.md) for details.

**Key points:**
- Only selected text is sent to our servers for analysis
- No browsing history or personal data is collected
- All data transmission is encrypted via HTTPS

## Project Structure

```
extension/public/
├── extension/           # Chrome extension scripts
│   ├── background.js   # Service worker
│   ├── config.js       # Backend configuration
│   ├── content.js      # Content script for UI injection
│   └── content.css     # Popup styles
├── manifest.json       # Extension manifest
└── icons/              # Extension icons (16x16, 48x48, 128x128)
```

## Development

For developer installation:
1. Clone this repository
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `extension/public` folder

## License

MIT

## License

MIT
