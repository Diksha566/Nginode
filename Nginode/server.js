const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const url = require("url");
const { createProxyServer } = require("http-proxy");

const port = 3000;
const proxy = createProxyServer({});
const RATE_LIMIT = {};

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const now = Date.now();

  RATE_LIMIT[ip] = RATE_LIMIT[ip]?.filter(ts => now - ts < 60000) || [];
  if (RATE_LIMIT[ip].length >= 100) {
    res.writeHead(429, { "Content-Type": "text/plain" });
    return res.end("Too Many Requests - Rate limit exceeded");
  }
  RATE_LIMIT[ip].push(now);

  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith("/api")) {
    proxy.web(req, res, { target: "http://localhost:5000" }, (err) => {
      res.writeHead(502, { "Content-Type": "text/plain" });
      res.end("Bad Gateway: Backend unavailable");
    });
    return;
  }

  const filePath = path.join(
    __dirname,
    pathname === "/" ? "index.html" : pathname
  );
  const ext = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/html" });  
        res.end("404: File not found, bro. Probably went out for coffee. ☕!!");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const acceptEncoding = req.headers["accept-encoding"] || "";
      if (acceptEncoding.includes("gzip")) {
        zlib.gzip(content, (err, zipped) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            return res.end("Compression Error");
          }
          res.writeHead(200, {
            "Content-Encoding": "gzip",
            "Content-Type": contentType,
          });
          res.end(zipped);
        });
      } else {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf8");
      }
    }
  });

  res.on("finish", () => {
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.url} ${res.statusCode}`
    );
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
