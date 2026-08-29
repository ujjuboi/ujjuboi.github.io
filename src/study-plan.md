# Study Plan: Networking, Browsers, HTML Servers & GitHub Pages

## Phase 1: Networking Fundamentals

### Week 1: Core Concepts
- [ ] OSI Model (7 layers) — focus on Layers 3, 4, 5, 7
- [ ] TCP/IP model and how it maps to OSI
- [ ] HTTP/1.1 vs HTTP/2 vs HTTP/3 — key differences
- [ ] DNS resolution process (recursive, root, TLD servers)
- [ ] How a request travels from browser to server and back
- [ ] TCP handshake (3-way handshake) and teardown
- [ ] UDP vs TCP — when to use each

### Week 2: HTTP Deep Dive
- [ ] Request methods: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- [ ] Status codes: 1xx, 2xx, 3xx, 4xx, 5xx — memorize key ones
- [ ] Headers: Common request headers (Authorization, Content-Type, Accept, Cache-Control, Cookie)
- [ ] Headers: Common response headers (Location, Set-Cookie, Cache-Control, ETag, Content-Encoding)
- [ ] Idempotency — which methods are idempotent
- [ ] Safe methods — which ones don't modify state
- [ ] HTTP Pipelining and Multiplexing
- [ ] URL encoding and query string format

### Week 3: Security
- [ ] HTTPS — TLS handshake process
- [ ] SSL/TLS certificates and CA chain
- [ ] Same-origin policy (SOP)
- [ ] CORS (Cross-Origin Resource Sharing) — preflight, credentials, headers
- [ ] CSRF vs XSS — differences and prevention
- [ ] Content Security Policy (CSP)
- [ ] HTTP Strict Transport Security (HSTS)

### Week 4: Network Protocols
- [ ] WebSocket protocol and connection lifecycle
- [ ] Server-Sent Events (SSE)
- [ ] gRPC overview
- [ ] CDN (Content Delivery Network) — how it works, why it matters
- [ ] Load balancing — round-robin, least-connection, IP hash
- [ ] Reverse proxy vs forward proxy

## Phase 2: HTML & Web Standards

### Week 5: HTML Semantic Deep Dive
- [ ] Semantic elements: article, section, nav, aside, header, footer, main
- [ ] Accessibility (a11y) — ARIA roles, labels, landmarks
- [ ] Forms — input types, validation attributes, constraint validation API
- [ ] Media elements: img, video, audio, picture, source
- [ ] Web standards bodies: W3C, WHATWG, IETF
- [ ] HTML5 features: LocalStorage, SessionStorage, IndexedDB, Web Workers

### Week 6: CSS & Rendering
- [ ] CSS specificity and cascade rules
- [ ] Box model — content, padding, border, margin, box-sizing
- [ ] Layout models: Flow, Flexbox, Grid, Tables
- [ ] Positioning: static, relative, absolute, fixed, sticky, inherit
- [ ] Responsive design: media queries, fluid grids, clamp(), container queries
- [ ] CSS custom properties (variables)
- [ ] CSS animations vs transitions

## Phase 3: Browser Architecture

### Week 7: How Browsers Work
- [ ] Browser architecture: UI, browser engine, rendering engine
- [ ] Rendering pipeline: DOM construction → CSSOM → Render Tree → Layout → Paint
- [ ] Critical rendering path optimization
- [ ] JavaScript engine (V8 overview: JIT compilation, garbage collection)
- [ ] Event loop: macrotasks, microtasks, requestAnimationFrame
- [ ] Hoisting, closures, and execution context
- [ ] Call stack and event queue

### Week 8: Browser APIs & Storage
- [ ] localStorage vs sessionStorage — differences, limits, security
- [ ] IndexedDB — when to use it, basic API
- [ ] Cache API and Service Workers (offline support)
- [ ] Web Storage event and storage events
- [ ] Geolocation API
- [ ] Fetch API vs XMLHttpRequest
- [ ] Async/Await patterns and Promise mechanics
- [ ] Performance APIs: Navigation Timing, Resource Timing, Performance Observer

### Week 9: Browser-Specific Coding
- [ ] Cross-browser compatibility: browsers to support, can I use
- [ ] Feature detection (modernizr) vs browser sniffing
- [ ] Polyfills and transpilers (Babel, core-js)
- [ ] Browser devtools: Network tab, Performance tab, Memory tab, Application tab
- [ ] Debugging techniques: breakpoints, conditional breakpoints, watch expressions
- [ ] Testing: Lighthouse, WebPageTest, browser compatibility testing tools

## Phase 4: Servers & Hosting

### Week 10: Server Fundamentals
- [ ] Client-server model overview
- [ ] Web servers: Nginx, Apache, Caddy — key differences
- [ ] Static vs dynamic content delivery
- [ ] Web server request lifecycle
- [ ] Reverse proxy configuration
- [ ] SSL/TLS termination at reverse proxy level
- [ ] Rate limiting and DDoS protection basics

### Week 11: Hosting Platforms
- [ ] GitHub Pages — what it is, limitations, features
- [ ] GitHub Pages: custom domains, SSL, redirects, pages.yaml
- [ ] GitHub Pages: Jekyll integration and build process
- [ ] Vercel, Netlify, Cloudflare Pages — comparison
- [ ] Serverless hosting concepts
- [ ] CI/CD pipelines for static sites (GitHub Actions)

### Week 12: Deployment & DevOps Basics
- [ ] Git workflows: trunk-based vs GitFlow
- [ ] Environment variables in deployment
- [ ] Build processes: bundling (Webpack, Vite), minification, tree-shaking
- [ ] Asset optimization: image compression, font optimization, code splitting
- [ ] Monitoring: uptime monitoring, error tracking (Sentry)
- [ ] Domain names and DNS records (A, CNAME, AAAA, MX, TXT, NS)

## Phase 5: Hands-On Projects

### Project 1: Static Site from Scratch
- Build a portfolio site with semantic HTML and CSS Grid
- Host on GitHub Pages
- Add custom domain with DNS configuration
- Set up HTTPS (automatic on GitHub Pages)

### Project 2: Dynamic Content with APIs
- Fetch data from GitHub API, external APIs
- Implement caching (localStorage, Service Worker)
- Add CORS handling and error boundaries
- Deploy to GitHub Pages

### Project 3: Progressive Web App
- Add Service Worker for offline support
- Implement app shell architecture
- Add manifest.json for installability
- Test with Lighthouse

### Project 4: Performance Optimization
- Audit existing site with Lighthouse and WebPageTest
- Optimize critical rendering path
- Implement lazy loading, code splitting
- Measure and document improvements

## Recommended Resources

### Books
- "HTTP: The Definitive Guide" by David Gourley
- "High Performance Browser Networking" by Google
- "You Don't Know JS" series by Kyle Simpson

### Websites
- MDN Web Docs (developer.mozilla.org)
- web.dev (performance, accessibility, best practices)
- HTTP Archive (web performance research)
- caniuse.com (browser compatibility)
- developer.chrome.com (browser internals)

### Interactive
- NetworkChuck's networking playlist (YouTube)
- Kevin Powell (CSS/Responsive Design)
- Web.dev learn module

## Weekly Schedule Suggestion
- 3 hours theory per week
- 2 hours hands-on coding per week
- 1 hour review/notes per week
- Weekend: 1 project milestone or challenge
