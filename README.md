# System Design 101

A free, comprehensive system design course — from fundamentals to real-world case studies, with animated diagrams and progress tracking. Built for interview prep and self-study.

### 🔗 Live site: **https://wadekarg.github.io/system_design_101/**

## What's inside

**38 topics across 5 sections:**

- **Fundamentals** — computer architecture, networking, HTTP/HTTPS, APIs, latency vs throughput, availability
- **Core Building Blocks** — load balancing, caching, CDNs, SQL/NoSQL, replication, sharding, message queues, object storage, WebSockets
- **Design Patterns** — rate limiting, consistent hashing, bloom filters, leader election, circuit breaker, API gateway, event-driven architecture, distributed transactions
- **Case Studies** — TinyURL, Twitter, YouTube, Discord, Google Drive, Web Crawler, Notifications, Autocomplete, Uber, Ticketmaster
- **Interview Prep** — how to approach any question, capacity estimation, trade-offs, common mistakes

Each topic has a clear written explanation, a hand-crafted animated SVG diagram, key takeaways, and related links. Your progress is tracked locally in the browser.

## Tech stack

[Astro](https://astro.build) · Tailwind CSS · MDX · hand-crafted SVG/CSS animations · deployed to GitHub Pages via GitHub Actions.

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321/system_design_101/
npm run build    # production build → dist/
```

Requires **Node 22+** (Astro v7). Every push to `main` auto-builds and deploys to GitHub Pages.
