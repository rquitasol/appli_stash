# AppliStash Simple Chrome Extension

A simplified Chrome extension for job application tracking.

## Features

- Basic login functionality
- Minimal, lightweight approach
- Direct integration with Chrome APIs

## Development

### Prerequisites

- Node.js (v14 or higher)
- pnpm

### Setup and Running

```bash
# Navigate to the extension directory
cd apps/simple-extension

# Install dependencies
pnpm install

# Start development (watch mode)
pnpm dev
```

This will compile the extension to the `dist` folder.

### Loading in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked" and select the `apps/simple-extension/dist` directory
4. The extension should now appear in your browser toolbar

## Structure

- Simple React-based popup
- Minimal background script for storage handling
- No complex build configuration

## Notes

This is a simplified version that prioritizes simplicity and ease of maintenance over advanced features.
