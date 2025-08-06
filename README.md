# Nginode

A lightweight, no-framework reverse proxy and static file server built with **pure Node.js** — inspired by Nginx.

`Nginode` serves as a simplified version of what a real-world HTTP server and reverse proxy like Nginx does: it handles static files, forwards API traffic to backend servers, applies gzip compression, and implements basic rate limiting and request logging — all from scratch.

---

## 🚀 Features

- ⚡ **Static File Serving**
  - Serve `.html`, `.css`, `.js`, images, fonts, and more
- 🔁 **Reverse Proxy**
  - Automatically proxies all `/api/*` routes to a backend server (`http://localhost:5000`)
- 🛡️ **Rate Limiting**
  - 100 requests per minute per IP address
- 🗜️ **Gzip Compression**
  - Automatically compresses supported responses
- 📊 **Request Logging**
  - Logs timestamp, HTTP method, path, and status code to console
- 🧠 **No Dependencies (except `http-proxy`)**
  - Built entirely with native Node.js modules
