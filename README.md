# Accuprompt 

A Chrome extension that enhances your prompting capabilities by collecting text from web pages and improving it using the Groq API.

## Features

- Collects text from input fields, textareas, contenteditable elements, and selected text on any webpage
- Sends the collected text to Groq API for enhancement
- Displays improved prompts that are more specific, comprehensive, and effective
- Simple, clean interface with a modern design

## Installation

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The Accuprompt extension icon should now appear in your Chrome toolbar

## Usage

1. Navigate to any webpage where you want to enhance text
2. Enter your text in an input field, textarea, or select text on the page
3. Click the Accuprompt extension icon in your toolbar
4. On first use, enter your Groq API key and click "Save"
5. Click "Generate" to enhance your text
6. Once the enhanced prompt appears, click "Copy" to copy it to your clipboard

## API Integration

This extension uses the Groq API with the LLama3-70b model to enhance prompts. You'll need a valid Groq API key to use this extension. Visit [Groq's website](https://groq.com) to obtain an API key.

## Customization

The extension features a modern purple-blue gradient interface. If you want to customize the appearance, you can modify the `styles.css` file.

## Privacy

This extension only accesses text when you explicitly click the extension icon and the "Generate" button. Your Groq API key is stored locally in Chrome's synced storage and is only used for API calls.

