# Simple Static File Server with Node.js

This project is a lightweight static file server built using Node.js core modules (`http`, `fs`, and `path`). It is designed to serve `.html`, `.css`, `.js`, and `.png` files without relying on any external dependencies or frameworks.

## 📌 Overview

The server handles incoming HTTP requests and responds with the appropriate file based on the requested URL. It defaults to serving `index.html` at the root path (`/`) and includes basic error handling for missing or unreadable files.

## ✅ Features

- Serves static files: `.html`, `.css`, `.js`, and `.png`
- Automatically resolves requests to `index.html` at root
- Simple MIME type mapping for supported file types
- Custom 404 response for files not found
- Lightweight and dependency-free
