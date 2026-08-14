# system_design_101 — Design Spec
**Date:** 2026-08-13
**Status:** Approved

---

## Overview

A public system design course website, built from scratch, hosted on GitHub Pages at `wadekarg.github.io/system_design_101`. Inspired by NeetCode's structure but with better visual polish, richer content drawn from the best available resources (System Design Primer, ByteByteGo, NeetCode), and animated SVG diagrams instead of video. All content and code is built by Claude — the owner (Gaj) does not write any code or content.

---

## Goals

- Teach system design from zero to interview-ready, completely free
- Look visually superior to NeetCode — warm light theme, polished typography, smooth animations
- Cover 38 topics across fundamentals, building blocks, design patterns, case studies, and interview prep
- Be fully static — no backend, no database, deployable to GitHub Pages
- Phase 2 (out of scope now): AI-powered practice scratchpad

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Astro | Static site generator, Markdown content, zero JS by default, GitHub Pages compatible |
| Styling | Tailwind CSS | Utility-first, fine-grained design control, warm light theme |
| Diagrams | Hand-crafted SVG + CSS animations | ByteByteGo-style animated data flows, no external libraries |
| Interactivity | Vanilla JS | Progress tracking via `localStorage`, sidebar toggle, smooth nav |
| Deployment | GitHub Actions | Auto-builds and deploys on every `git push` |
| Hosting | GitHub Pages | Free, custom subdirectory: `wadekarg.github.io/system_design_101` |

---

## Site Structure

```
system_design_101/
├── src/
│   ├── content/
│   │   ├── fundamentals/       ← 6 topics
│   │   ├── building-blocks/    ← 10 topics
│   │   ├── patterns/           ← 8 topics
│   │   ├── case-studies/       ← 10 topics
│   │   └── interview-prep/     ← 4 topics
│   ├── components/
│   │   ├── Sidebar.astro
│   │   ├── TopicNav.astro
│   │   ├── ProgressBar.astro
│   │   └── diagrams/           ← one SVG component per topic
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── TopicLayout.astro
│   │   └── CaseStudyLayout.astro
│   └── pages/
│       ├── index.astro          ← homepage / roadmap
│       └── [...slug].astro      ← dynamic topic routes
├── public/
│   └── fonts/
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## Pages

### Homepage
- Hero section: title, subtitle, "Start Learning" CTA
- Visual roadmap: 5 section cards (Fundamentals → Building Blocks → Patterns → Case Studies → Interview Prep), each showing topic count and progress %
- Overall progress bar across all topics

### Topic Pages (Fundamentals / Building Blocks / Patterns)
Each page has:
1. **Header** — topic title, estimated read time, difficulty badge (Beginner / Intermediate / Advanced)
2. **Animated SVG diagram** — shows the concept visually with CSS keyframe animation
3. **Written explanation** — clear sections with subheadings, drawn from System Design Primer + ByteByteGo content
4. **Key Takeaways** — highlighted summary box at end
5. **Related Topics** — links to 2-3 connected topics
6. **Prev / Next navigation** — bottom of page

### Case Study Pages
All of the above, plus:
- **Problem Statement** — framed as an interview prompt (e.g., "Design a system like YouTube. Start with requirements.")
- **Step-by-step solution** — requirements → capacity estimation → high-level design → deep dive
- **Final architecture diagram** — full annotated SVG
- **"Say this in your interview" callout box** — bullet points of what to mention

### Interview Prep Pages
- Structured written guides (no special template difference from topic pages)

---

## Full Curriculum (38 topics)

### Section 1: Fundamentals (6)
1. Computer Architecture
2. Networking Basics (IP, DNS, TCP/UDP)
3. HTTP & HTTPS
4. APIs — REST, GraphQL, gRPC, WebSockets
5. Latency vs Throughput
6. Availability & Reliability

### Section 2: Core Building Blocks (10)
7. Load Balancing
8. Caching
9. CDN (Content Delivery Network)
10. SQL Databases
11. NoSQL Databases
12. Database Replication
13. Database Sharding
14. Message Queues
15. Object Storage
16. WebSockets & Long Polling

### Section 3: Design Patterns (8)
17. Rate Limiting
18. Consistent Hashing
19. Bloom Filters
20. Leader Election
21. Circuit Breaker
22. API Gateway
23. Event-Driven Architecture
24. Distributed Transactions

### Section 4: Case Studies (10)
25. Design TinyURL
26. Design Twitter / News Feed
27. Design YouTube
28. Design Discord / Chat System
29. Design Google Drive
30. Design a Web Crawler
31. Design a Notification System
32. Design Search Autocomplete
33. Design Uber / Location Service
34. Design a Ticket Booking System

### Section 5: Interview Prep (4)
35. How to Approach Any System Design Question
36. Capacity Estimation
37. Making Trade-off Decisions
38. Common Mistakes to Avoid

---

## Visual Design

### Theme
- **Background:** Warm off-white (`#FAFAF8`) — never pure white, never dark
- **Text:** Near-black (`#1A1A1A`) for body, muted gray for secondary text
- **Accent:** Deep indigo (`#4F46E5`) for active states, links, progress indicators
- **Success:** Soft green for completed topic checkmarks
- **Cards/panels:** White with subtle warm shadow

### Typography
- **Body:** Inter (Google Fonts) — clean, highly readable
- **Headings:** Inter, heavier weight
- **Code/terms:** JetBrains Mono monospace

### Layout
- Fixed left sidebar: 260px wide, collapses to icon-only on tablet, hamburger on mobile
- Content area: centered, max-width 720px for readability
- Sidebar shows: section headers (collapsible), topic list with completion checkmarks, overall progress %

### Animations
- All diagrams are hand-crafted SVGs with CSS `@keyframes` animations
- Examples: traffic arrows bouncing between load balancer and servers; cache hit/miss flow; replication log propagating; pub/sub message routing
- Animations loop gently — informative, not distracting
- Reduced motion respected via `prefers-reduced-motion` media query

---

## Progress Tracking

- Uses browser `localStorage` — no backend, no login
- A topic is marked complete when the user reaches the bottom of the page (scroll threshold)
- Checkmarks appear in sidebar, overall % updates on homepage
- Progress persists across browser sessions
- "Reset Progress" button in sidebar footer

---

## Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    - checkout
    - setup Node.js
    - npm install
    - npm run build        # astro build
    - deploy to gh-pages   # GitHub Pages action
```

Site goes live at: `https://wadekarg.github.io/system_design_101`

---

## Out of Scope (Phase 2)
- AI-powered practice scratchpad — requires backend + API integration, separate project
- User accounts / cloud progress sync
- Video content
- Quizzes / assessments

---

## Success Criteria
- All 42 topics have a complete page with explanation + animated diagram
- Site loads in under 2 seconds on a standard connection
- Fully responsive: desktop, tablet, mobile
- Passes WCAG AA accessibility basics (contrast, keyboard nav)
- Auto-deploys successfully to GitHub Pages
