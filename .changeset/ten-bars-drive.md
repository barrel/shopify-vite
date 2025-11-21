---
"vite-plugin-shopify": minor
---

This release addresses a critical compatibility issue with Vite 7 and enhances the development server experience.

**Vite 7 Tunnel Fix:** The plugin now automatically configures `server.allowedHosts` to work with the dynamic tunnel feature (`tunnel: true`), resolving the "Blocked request" error.

**Smart CORS Defaults:** To improve the out-of-the-box experience, the plugin now sets a default CORS policy that allows requests from `localhost` and `*.myshopify.com`, which is a common requirement for theme development. Your custom `server.cors` settings will always take precedence.
