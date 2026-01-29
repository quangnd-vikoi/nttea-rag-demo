# ChatBox Widget - Integration Guide

## Files Required
- `chatbox.js` - Main widget bundle
- `chatbox.css` - Styles (auto-loaded)

## Quick Start

### Method 1: Script Tag (Simplest)
```html
<script
  src="path/to/chatbox.js"
  data-concierge-id="YOUR_BOT_ID"
  data-theme="light">
</script>
```

### Method 2: JavaScript API
```html
<script src="path/to/chatbox.js"></script>
<script>
  ChatBox.init({
    conciergeId: 'YOUR_BOT_ID',
    theme: 'light',           // 'light' | 'dark'
    position: 'bottom-right'  // 'bottom-right' | 'bottom-left'
  });
</script>
```

## Authentication Modes

### 1. Standalone (MSAL)
Widget handles login via Microsoft Entra ID.
```javascript
ChatBox.init({
  conciergeId: 'YOUR_BOT_ID',
  authMode: 'standalone'
});
```

### 2. External (Token from Host)
Host app provides token to widget.
```javascript
ChatBox.init({
  conciergeId: 'YOUR_BOT_ID',
  authMode: 'external',
  externalAuth: {
    accessToken: 'YOUR_TOKEN',
    userEmail: 'user@example.com',
    userName: 'User Name'
  }
});
```

### 3. EasyAuth (Azure App Service)
Uses Azure App Service authentication.
```javascript
ChatBox.init({
  conciergeId: 'YOUR_BOT_ID',
  authMode: 'easyauth'
});
```

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `conciergeId` | string | required | Bot/Concierge ID |
| `authMode` | string | 'standalone' | 'standalone', 'easyauth', 'external' |
| `theme` | string | 'light' | 'light' or 'dark' |
| `position` | string | 'bottom-right' | 'bottom-right' or 'bottom-left' |
| `container` | string | - | CSS selector for custom container |
| `requireLoginEachTime` | boolean | false | Force login each session |

## API Methods

```javascript
// Initialize widget
ChatBox.init(config);

// Remove widget
ChatBox.destroy();
```

## Vue.js Integration

```vue
<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  mounted() {
    // Load chatbox script dynamically
    const script = document.createElement('script');
    script.src = '/path/to/chatbox.js';
    script.onload = () => {
      window.ChatBox.init({
        conciergeId: 'YOUR_BOT_ID',
        authMode: 'standalone',
        theme: 'dark'
      });
    };
    document.body.appendChild(script);
  },
  beforeDestroy() {
    if (window.ChatBox) {
      window.ChatBox.destroy();
    }
  }
}
</script>
```

## Notes
- Widget auto-creates a container `#chatbox-root` if not specified
- CSS is bundled in the JS file
- Works with any framework (Vue, React, Angular, plain HTML)
