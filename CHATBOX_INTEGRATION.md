# ChatBox Widget - Integration Guide

## Simplest Embed (1 line)

```html
<script src="https://your-cdn.com/chatbox.js" data-concierge-id="YOUR_BOT_ID"></script>
```

That's it! Widget handles everything automatically.

---

## All Options

### Option 1: Script Tag (Simplest)
```html
<script
  src="chatbox.js"
  data-concierge-id="YOUR_BOT_ID"
  data-position="bottom-right">
</script>
```

### Option 2: JavaScript API
```html
<script src="chatbox.js"></script>
<script>
  ChatBox.init({
    conciergeId: 'YOUR_BOT_ID',
    position: 'bottom-right'
  });
</script>
```

### Option 3: SSO with Host App (Shared MSAL)
```html
<script>
  // Host app exposes MSAL instance globally
  window.msalInstance = new msal.PublicClientApplication(config);
  await window.msalInstance.initialize();
</script>

<!-- Same simple embed! Widget auto-detects window.msalInstance -->
<script src="chatbox.js" data-concierge-id="YOUR_BOT_ID"></script>
```

### Option 4: Azure App Service (Easy Auth)
```html
<script
  src="chatbox.js"
  data-concierge-id="YOUR_BOT_ID"
  data-auth-mode="easyauth">
</script>
```

---

## Shared MSAL Requirements (SSO)

To enable SSO between host app and widget, host app's MSAL must meet these requirements:

### Required Config

```javascript
const msalConfig = {
  auth: {
    clientId: "447ff8a0-01d3-4192-a18a-90259989f917",  // MUST match widget
    authority: "https://login.microsoftonline.com/f91d6d6a-1b50-467d-82d2-b94e92fba2d1",  // MUST match widget
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",  // MUST be localStorage (NOT sessionStorage)
  }
};
```

### Checklist

| Requirement | Value | Notes |
|-------------|-------|-------|
| `clientId` | Must match widget | Same Azure App Registration |
| `tenantId` | Must match widget | Same Azure AD tenant |
| `cacheLocation` | `"localStorage"` | Required for cross-script sharing |
| Global variable | `window.msalInstance` | Widget auto-detects this |
| Init order | Host first, widget second | MSAL must be ready before widget loads |

### Example Setup

```html
<!-- 1. Load MSAL library -->
<script src="https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js"></script>

<!-- 2. Initialize MSAL BEFORE widget -->
<script>
  (async function() {
    window.msalInstance = new msal.PublicClientApplication({
      auth: {
        clientId: "447ff8a0-01d3-4192-a18a-90259989f917",
        authority: "https://login.microsoftonline.com/f91d6d6a-1b50-467d-82d2-b94e92fba2d1",
        redirectUri: window.location.origin,
      },
      cache: { cacheLocation: "localStorage" }
    });
    await window.msalInstance.initialize();
  })();
</script>

<!-- 3. Load widget AFTER MSAL is ready -->
<script src="chatbox.js" data-concierge-id="YOUR_BOT_ID"></script>
```

### SSO Behavior

| Scenario | Result |
|----------|--------|
| User logged in via host app | Widget auto-uses same session |
| User logged in via widget | Host app can access same session |
| Host app logout | Widget also logged out (after refresh) |
| Widget logout | Host app also logged out |

### If SSO Not Working

1. Check `clientId` and `tenantId` match exactly
2. Verify `cacheLocation` is `"localStorage"`
3. Ensure MSAL is initialized before widget loads
4. Check browser console for errors

---

## Config Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `conciergeId` | string | required | Bot ID |
| `position` | string | 'bottom-right' | 'bottom-right' or 'bottom-left' |
| `authMode` | string | 'standalone' | 'standalone' or 'easyauth' |
| `msalInstance` | object | - | MSAL instance for SSO |
| `container` | string | - | CSS selector for custom container |

---

## API

```javascript
ChatBox.init(config);   // Initialize
ChatBox.destroy();      // Remove widget
```

---

## Framework Examples

### Vue.js
```vue
<script>
export default {
  mounted() {
    const script = document.createElement('script');
    script.src = '/chatbox.js';
    script.onload = () => {
      window.ChatBox.init({ conciergeId: 'YOUR_BOT_ID' });
    };
    document.body.appendChild(script);
  },
  beforeDestroy() {
    window.ChatBox?.destroy();
  }
}
</script>
```

### Vue.js with SSO
```vue
<script>
import * as msal from '@azure/msal-browser';

export default {
  async mounted() {
    // Initialize shared MSAL
    window.msalInstance = new msal.PublicClientApplication({
      auth: {
        clientId: "447ff8a0-01d3-4192-a18a-90259989f917",
        authority: "https://login.microsoftonline.com/f91d6d6a-1b50-467d-82d2-b94e92fba2d1",
      },
      cache: { cacheLocation: "localStorage" }
    });
    await window.msalInstance.initialize();

    // Load widget
    const script = document.createElement('script');
    script.src = '/chatbox.js';
    script.onload = () => {
      window.ChatBox.init({ conciergeId: 'YOUR_BOT_ID' });
    };
    document.body.appendChild(script);
  },
  beforeDestroy() {
    window.ChatBox?.destroy();
  }
}
</script>
```

### React
```jsx
useEffect(() => {
  const script = document.createElement('script');
  script.src = '/chatbox.js';
  script.onload = () => {
    window.ChatBox.init({ conciergeId: 'YOUR_BOT_ID' });
  };
  document.body.appendChild(script);

  return () => window.ChatBox?.destroy();
}, []);
```
