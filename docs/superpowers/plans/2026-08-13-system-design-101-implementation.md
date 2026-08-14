# system_design_101 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, fully static system design course website (38 topics, animated SVG diagrams, NeetCode-style sidebar) deployed to GitHub Pages at `wadekarg.github.io/system_design_101`.

**Architecture:** Astro static site generator with MDX content, Tailwind CSS for styling, vanilla JS for progress tracking via localStorage. Content lives in per-section Astro content collections; dynamic routing generates one page per topic. Diagrams are hand-crafted SVG Astro components with CSS keyframe animations.

**Tech Stack:** Astro 4.x, @astrojs/tailwind, @astrojs/mdx, Tailwind CSS 3.x, Node.js 20, GitHub Actions

## Global Constraints

- Background is always warm off-white `#FAFAF8` — never dark, never pure white
- Accent color: deep indigo `#4F46E5`
- Body font: Inter (Google Fonts); code font: JetBrains Mono
- Sidebar: 260px fixed, collapsible on mobile
- Content max-width: 720px centered
- All SVG animations must respect `prefers-reduced-motion`
- Site base path: `/system_design_101` (Astro `base` config)
- Deploy target: `https://wadekarg.github.io/system_design_101`
- No dark mode — warm light theme only
- No frameworks beyond Astro — vanilla JS only for interactivity

---

### Task 1: Initialize Astro project and install dependencies

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Scaffold Astro project inside existing repo directory**

```bash
cd /home/gaj/hdd/Projects/system_design_101
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

When prompted, choose: TypeScript strict, no git (already initialized).

- [ ] **Step 2: Add Tailwind and MDX integrations**

```bash
npx astro add tailwind mdx --yes
```

- [ ] **Step 3: Write astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://wadekarg.github.io',
  base: '/system_design_101',
  integrations: [tailwind(), mdx()],
});
```

- [ ] **Step 4: Write tailwind.config.mjs**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAF8',
        'bg-card': '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B7280',
        accent: '#4F46E5',
        'accent-light': '#EEF2FF',
        'accent-hover': '#4338CA',
        success: '#16A34A',
        'success-light': '#DCFCE7',
        warning: '#D97706',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      maxWidth: {
        content: '720px',
      },
      width: {
        sidebar: '260px',
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Create global CSS with font imports**

Create `src/styles/global.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    background-color: #FAFAF8;
    color: #1A1A1A;
    font-family: 'Inter', system-ui, sans-serif;
  }
  code, pre, kbd {
    font-family: 'JetBrains Mono', monospace;
  }
}

@layer components {
  .sidebar-link {
    @apply flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-accent-light hover:text-accent transition-colors duration-150;
  }
  .sidebar-link.active {
    @apply bg-accent-light text-accent font-medium;
  }
  .sidebar-link.completed::after {
    content: '✓';
    @apply ml-auto text-success text-xs font-bold;
  }
  .topic-prose h2 {
    @apply text-xl font-semibold text-text-primary mt-10 mb-4 pb-2 border-b border-border;
  }
  .topic-prose h3 {
    @apply text-lg font-semibold text-text-primary mt-6 mb-3;
  }
  .topic-prose p {
    @apply text-text-primary leading-7 mb-4;
  }
  .topic-prose ul {
    @apply list-disc list-inside space-y-2 mb-4 text-text-primary;
  }
  .topic-prose ol {
    @apply list-decimal list-inside space-y-2 mb-4 text-text-primary;
  }
  .topic-prose code {
    @apply bg-gray-100 text-accent px-1.5 py-0.5 rounded text-sm font-mono;
  }
  .topic-prose pre {
    @apply bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto mb-6 text-sm;
  }
  .topic-prose blockquote {
    @apply border-l-4 border-accent pl-4 italic text-text-secondary mb-4;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:4321/system_design_101`. Browser shows Astro default page.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: initialize Astro + Tailwind + MDX project"
```

---

### Task 2: GitHub Actions deployment pipeline

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create workflow file**

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build site
        run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 2: Verify build succeeds locally**

```bash
npm run build
```

Expected: `dist/` directory created with no errors.

- [ ] **Step 3: Commit**

```bash
git add .github/
git commit -m "ci: add GitHub Actions deployment pipeline"
```

---

### Task 3: Content collections schema

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/fundamentals/.gitkeep`
- Create: `src/content/building-blocks/.gitkeep`
- Create: `src/content/patterns/.gitkeep`
- Create: `src/content/case-studies/.gitkeep`
- Create: `src/content/interview-prep/.gitkeep`

- [ ] **Step 1: Write content collection schema**

Create `src/content/config.ts`:

```typescript
import { z, defineCollection } from 'astro:content';

const topicSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  readTime: z.string(),
  diagram: z.string(),
  relatedTopics: z.array(z.string()).default([]),
  isCaseStudy: z.boolean().default(false),
});

export const collections = {
  fundamentals: defineCollection({ type: 'content', schema: topicSchema }),
  'building-blocks': defineCollection({ type: 'content', schema: topicSchema }),
  patterns: defineCollection({ type: 'content', schema: topicSchema }),
  'case-studies': defineCollection({ type: 'content', schema: topicSchema }),
  'interview-prep': defineCollection({ type: 'content', schema: topicSchema }),
};
```

- [ ] **Step 2: Create content directories**

```bash
mkdir -p src/content/fundamentals src/content/building-blocks src/content/patterns src/content/case-studies src/content/interview-prep
touch src/content/fundamentals/.gitkeep src/content/building-blocks/.gitkeep src/content/patterns/.gitkeep src/content/case-studies/.gitkeep src/content/interview-prep/.gitkeep
```

- [ ] **Step 3: Create curriculum data file**

Create `src/data/curriculum.ts`:

```typescript
export interface SectionMeta {
  id: string;
  label: string;
  icon: string;
  topicCount: number;
  description: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: 'fundamentals',
    label: 'Fundamentals',
    icon: '🧱',
    topicCount: 6,
    description: 'Core concepts every software engineer must know',
  },
  {
    id: 'building-blocks',
    label: 'Building Blocks',
    icon: '⚙️',
    topicCount: 10,
    description: 'The components that power real-world systems',
  },
  {
    id: 'patterns',
    label: 'Design Patterns',
    icon: '🔧',
    topicCount: 8,
    description: 'Advanced techniques for scalable architecture',
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    icon: '📐',
    topicCount: 10,
    description: 'Design real systems like a senior engineer',
  },
  {
    id: 'interview-prep',
    label: 'Interview Prep',
    icon: '🎯',
    topicCount: 4,
    description: 'Ace your system design interview',
  },
];

export const TOTAL_TOPICS = 38;
```

- [ ] **Step 4: Commit**

```bash
git add src/content/ src/data/
git commit -m "feat: add content collection schema and curriculum data"
```

---

### Task 4: Base layout, topic layout, and case study layout

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/TopicLayout.astro`
- Create: `src/layouts/CaseStudyLayout.astro`

- [ ] **Step 1: Write BaseLayout.astro**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import Sidebar from '../components/Sidebar.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'A free, comprehensive system design course for software engineers.' } = Astro.props;
const base = import.meta.env.BASE_URL;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | System Design 101</title>
    <link rel="icon" type="image/svg+xml" href={`${base}favicon.svg`} />
  </head>
  <body class="bg-bg min-h-screen">
    <div class="flex min-h-screen">
      <Sidebar />
      <main id="main-content" class="flex-1 min-w-0">
        <slot />
      </main>
    </div>
    <script>
      import '../scripts/progress.js';
    </script>
  </body>
</html>
```

- [ ] **Step 2: Write TopicLayout.astro**

Create `src/layouts/TopicLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import DifficultyBadge from '../components/DifficultyBadge.astro';
import KeyTakeaways from '../components/KeyTakeaways.astro';
import RelatedTopics from '../components/RelatedTopics.astro';
import TopicNav from '../components/TopicNav.astro';
import DiagramRenderer from '../components/DiagramRenderer.astro';

interface Props {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  diagram: string;
  relatedTopics: string[];
  takeaways: string[];
  prevTopic?: { title: string; href: string };
  nextTopic?: { title: string; href: string };
}

const {
  title,
  description,
  difficulty,
  readTime,
  diagram,
  relatedTopics,
  takeaways,
  prevTopic,
  nextTopic,
} = Astro.props;
---

<BaseLayout title={title} description={description}>
  <article class="max-w-content mx-auto px-6 py-10" data-topic-page>
    <!-- Header -->
    <header class="mb-8">
      <div class="flex items-center gap-3 mb-3">
        <DifficultyBadge difficulty={difficulty} />
        <span class="text-sm text-text-secondary">{readTime}</span>
      </div>
      <h1 class="text-3xl font-bold text-text-primary mb-3">{title}</h1>
      <p class="text-lg text-text-secondary">{description}</p>
    </header>

    <!-- Animated Diagram -->
    <div class="mb-10 rounded-2xl bg-white border border-border p-6 shadow-sm">
      <DiagramRenderer name={diagram} />
    </div>

    <!-- Content -->
    <div class="topic-prose">
      <slot />
    </div>

    <!-- Key Takeaways -->
    <KeyTakeaways items={takeaways} />

    <!-- Related Topics -->
    {relatedTopics.length > 0 && <RelatedTopics topics={relatedTopics} />}

    <!-- Prev / Next Navigation -->
    <TopicNav prev={prevTopic} next={nextTopic} />
  </article>
</BaseLayout>

<script>
  // Mark topic complete when user scrolls to bottom
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        const path = window.location.pathname;
        const key = `sd101_complete_${path}`;
        localStorage.setItem(key, '1');
        document.dispatchEvent(new CustomEvent('topic-complete', { detail: { path } }));
      }
    },
    { threshold: 0.9 }
  );

  const sentinel = document.querySelector('[data-topic-nav]');
  if (sentinel) observer.observe(sentinel);
</script>
```

- [ ] **Step 3: Write CaseStudyLayout.astro**

Create `src/layouts/CaseStudyLayout.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import DifficultyBadge from '../components/DifficultyBadge.astro';
import KeyTakeaways from '../components/KeyTakeaways.astro';
import RelatedTopics from '../components/RelatedTopics.astro';
import TopicNav from '../components/TopicNav.astro';
import DiagramRenderer from '../components/DiagramRenderer.astro';

interface Props {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  diagram: string;
  relatedTopics: string[];
  takeaways: string[];
  interviewTips: string[];
  problemStatement: string;
  prevTopic?: { title: string; href: string };
  nextTopic?: { title: string; href: string };
}

const {
  title, description, difficulty, readTime, diagram,
  relatedTopics, takeaways, interviewTips, problemStatement,
  prevTopic, nextTopic,
} = Astro.props;
---

<BaseLayout title={title} description={description}>
  <article class="max-w-content mx-auto px-6 py-10" data-topic-page>
    <header class="mb-8">
      <div class="flex items-center gap-3 mb-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2 py-1 rounded">Case Study</span>
        <DifficultyBadge difficulty={difficulty} />
        <span class="text-sm text-text-secondary">{readTime}</span>
      </div>
      <h1 class="text-3xl font-bold text-text-primary mb-3">{title}</h1>
      <p class="text-lg text-text-secondary">{description}</p>
    </header>

    <!-- Problem Statement -->
    <div class="mb-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-amber-700 mb-2">Interview Prompt</h2>
      <p class="text-text-primary italic">"{problemStatement}"</p>
    </div>

    <!-- Architecture Diagram -->
    <div class="mb-10 rounded-2xl bg-white border border-border p-6 shadow-sm">
      <DiagramRenderer name={diagram} />
    </div>

    <!-- Step-by-step content -->
    <div class="topic-prose">
      <slot />
    </div>

    <!-- Interview Tips callout -->
    <div class="mt-10 rounded-2xl bg-accent-light border border-accent/20 p-6">
      <h2 class="text-base font-semibold text-accent mb-3">Say This In Your Interview</h2>
      <ul class="space-y-2">
        {interviewTips.map((tip) => (
          <li class="flex items-start gap-2 text-sm text-text-primary">
            <span class="text-accent mt-0.5">→</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>

    <KeyTakeaways items={takeaways} />
    {relatedTopics.length > 0 && <RelatedTopics topics={relatedTopics} />}
    <TopicNav prev={prevTopic} next={nextTopic} />
  </article>
</BaseLayout>
```

- [ ] **Step 4: Commit**

```bash
git add src/layouts/
git commit -m "feat: add BaseLayout, TopicLayout, and CaseStudyLayout"
```

---

### Task 5: Shared UI components

**Files:**
- Create: `src/components/DifficultyBadge.astro`
- Create: `src/components/KeyTakeaways.astro`
- Create: `src/components/RelatedTopics.astro`
- Create: `src/components/TopicNav.astro`
- Create: `src/components/ProgressBar.astro`
- Create: `src/components/DiagramRenderer.astro`

- [ ] **Step 1: DifficultyBadge.astro**

```astro
---
interface Props {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
const { difficulty } = Astro.props;
const styles = {
  Beginner: 'bg-success-light text-green-700',
  Intermediate: 'bg-amber-50 text-amber-700',
  Advanced: 'bg-red-50 text-red-700',
};
---
<span class={`text-xs font-semibold px-2 py-1 rounded ${styles[difficulty]}`}>
  {difficulty}
</span>
```

- [ ] **Step 2: KeyTakeaways.astro**

```astro
---
interface Props {
  items: string[];
}
const { items } = Astro.props;
---
<div class="mt-10 rounded-2xl bg-success-light border border-green-200 p-6">
  <h2 class="text-base font-semibold text-green-800 mb-3">Key Takeaways</h2>
  <ul class="space-y-2">
    {items.map((item) => (
      <li class="flex items-start gap-2 text-sm text-text-primary">
        <span class="text-success mt-0.5 font-bold">✓</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
</div>
```

- [ ] **Step 3: RelatedTopics.astro**

```astro
---
interface Props {
  topics: string[];
}
const { topics } = Astro.props;
const base = import.meta.env.BASE_URL;
---
<div class="mt-8">
  <h2 class="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Related Topics</h2>
  <div class="flex flex-wrap gap-2">
    {topics.map((topic) => (
      <a
        href={`${base}${topic}`}
        class="text-sm px-3 py-1.5 rounded-lg bg-white border border-border text-accent hover:bg-accent-light transition-colors"
      >
        {topic.split('/').pop()?.replace(/-/g, ' ')}
      </a>
    ))}
  </div>
</div>
```

- [ ] **Step 4: TopicNav.astro**

```astro
---
interface Props {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}
const { prev, next } = Astro.props;
const base = import.meta.env.BASE_URL;
---
<nav class="mt-12 flex items-center justify-between border-t border-border pt-6" data-topic-nav>
  {prev ? (
    <a href={`${base}${prev.href}`} class="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors">
      <span>←</span>
      <span>{prev.title}</span>
    </a>
  ) : <span />}
  {next ? (
    <a href={`${base}${next.href}`} class="flex items-center gap-2 text-sm text-accent hover:text-accent-hover transition-colors font-medium">
      <span>{next.title}</span>
      <span>→</span>
    </a>
  ) : <span />}
</nav>
```

- [ ] **Step 5: ProgressBar.astro**

```astro
---
// Rendered client-side via JS; this just provides the shell
---
<div class="px-4 py-3 border-t border-border">
  <div class="flex items-center justify-between mb-1">
    <span class="text-xs text-text-secondary font-medium">Progress</span>
    <span id="progress-pct" class="text-xs font-bold text-accent">0%</span>
  </div>
  <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
    <div id="progress-bar" class="h-full bg-accent rounded-full transition-all duration-500" style="width: 0%"></div>
  </div>
</div>
```

- [ ] **Step 6: DiagramRenderer.astro**

Create `src/components/DiagramRenderer.astro` — this is the lookup map. Add every diagram name as it gets created. Start with a placeholder that gets replaced in later tasks:

```astro
---
import ComputerArchitectureDiagram from './diagrams/ComputerArchitectureDiagram.astro';
import NetworkingDiagram from './diagrams/NetworkingDiagram.astro';
import HttpDiagram from './diagrams/HttpDiagram.astro';
import ApisDiagram from './diagrams/ApisDiagram.astro';
import LatencyDiagram from './diagrams/LatencyDiagram.astro';
import AvailabilityDiagram from './diagrams/AvailabilityDiagram.astro';
import LoadBalancingDiagram from './diagrams/LoadBalancingDiagram.astro';
import CachingDiagram from './diagrams/CachingDiagram.astro';
import CdnDiagram from './diagrams/CdnDiagram.astro';
import SqlDiagram from './diagrams/SqlDiagram.astro';
import NoSqlDiagram from './diagrams/NoSqlDiagram.astro';
import ReplicationDiagram from './diagrams/ReplicationDiagram.astro';
import ShardingDiagram from './diagrams/ShardingDiagram.astro';
import MessageQueuesDiagram from './diagrams/MessageQueuesDiagram.astro';
import ObjectStorageDiagram from './diagrams/ObjectStorageDiagram.astro';
import WebsocketsDiagram from './diagrams/WebsocketsDiagram.astro';
import RateLimitingDiagram from './diagrams/RateLimitingDiagram.astro';
import ConsistentHashingDiagram from './diagrams/ConsistentHashingDiagram.astro';
import BloomFilterDiagram from './diagrams/BloomFilterDiagram.astro';
import LeaderElectionDiagram from './diagrams/LeaderElectionDiagram.astro';
import CircuitBreakerDiagram from './diagrams/CircuitBreakerDiagram.astro';
import ApiGatewayDiagram from './diagrams/ApiGatewayDiagram.astro';
import EventDrivenDiagram from './diagrams/EventDrivenDiagram.astro';
import DistributedTransactionsDiagram from './diagrams/DistributedTransactionsDiagram.astro';
import TinyUrlDiagram from './diagrams/TinyUrlDiagram.astro';
import TwitterDiagram from './diagrams/TwitterDiagram.astro';
import YoutubeDiagram from './diagrams/YoutubeDiagram.astro';
import DiscordDiagram from './diagrams/DiscordDiagram.astro';
import GoogleDriveDiagram from './diagrams/GoogleDriveDiagram.astro';
import WebCrawlerDiagram from './diagrams/WebCrawlerDiagram.astro';
import NotificationDiagram from './diagrams/NotificationDiagram.astro';
import AutocompleteDiagram from './diagrams/AutocompleteDiagram.astro';
import UberDiagram from './diagrams/UberDiagram.astro';
import TicketBookingDiagram from './diagrams/TicketBookingDiagram.astro';
import InterviewApproachDiagram from './diagrams/InterviewApproachDiagram.astro';
import CapacityDiagram from './diagrams/CapacityDiagram.astro';
import TradeOffsDiagram from './diagrams/TradeOffsDiagram.astro';
import MistakesDiagram from './diagrams/MistakesDiagram.astro';

interface Props {
  name: string;
}
const { name } = Astro.props;

const map: Record<string, any> = {
  ComputerArchitectureDiagram,
  NetworkingDiagram,
  HttpDiagram,
  ApisDiagram,
  LatencyDiagram,
  AvailabilityDiagram,
  LoadBalancingDiagram,
  CachingDiagram,
  CdnDiagram,
  SqlDiagram,
  NoSqlDiagram,
  ReplicationDiagram,
  ShardingDiagram,
  MessageQueuesDiagram,
  ObjectStorageDiagram,
  WebsocketsDiagram,
  RateLimitingDiagram,
  ConsistentHashingDiagram,
  BloomFilterDiagram,
  LeaderElectionDiagram,
  CircuitBreakerDiagram,
  ApiGatewayDiagram,
  EventDrivenDiagram,
  DistributedTransactionsDiagram,
  TinyUrlDiagram,
  TwitterDiagram,
  YoutubeDiagram,
  DiscordDiagram,
  GoogleDriveDiagram,
  WebCrawlerDiagram,
  NotificationDiagram,
  AutocompleteDiagram,
  UberDiagram,
  TicketBookingDiagram,
  InterviewApproachDiagram,
  CapacityDiagram,
  TradeOffsDiagram,
  MistakesDiagram,
};

const Component = map[name];
---

{Component ? <Component /> : <div class="text-text-secondary text-sm italic">Diagram: {name}</div>}
```

- [ ] **Step 7: Create diagrams directory (stubs — filled in Task 10)**

```bash
mkdir -p src/components/diagrams
```

Create a stub for all 38 diagrams so the build doesn't fail. Each stub is identical:

```bash
for name in ComputerArchitectureDiagram NetworkingDiagram HttpDiagram ApisDiagram LatencyDiagram AvailabilityDiagram LoadBalancingDiagram CachingDiagram CdnDiagram SqlDiagram NoSqlDiagram ReplicationDiagram ShardingDiagram MessageQueuesDiagram ObjectStorageDiagram WebsocketsDiagram RateLimitingDiagram ConsistentHashingDiagram BloomFilterDiagram LeaderElectionDiagram CircuitBreakerDiagram ApiGatewayDiagram EventDrivenDiagram DistributedTransactionsDiagram TinyUrlDiagram TwitterDiagram YoutubeDiagram DiscordDiagram GoogleDriveDiagram WebCrawlerDiagram NotificationDiagram AutocompleteDiagram UberDiagram TicketBookingDiagram InterviewApproachDiagram CapacityDiagram TradeOffsDiagram MistakesDiagram; do
  echo '<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="50%" text-anchor="middle" fill="#6B7280" font-size="14">Diagram coming soon</text></svg>' > "src/components/diagrams/${name}.astro"
done
```

- [ ] **Step 8: Commit**

```bash
git add src/components/
git commit -m "feat: add shared UI components and diagram renderer"
```

---

### Task 6: Sidebar component and progress tracking

**Files:**
- Create: `src/components/Sidebar.astro`
- Create: `src/scripts/progress.ts`

- [ ] **Step 1: Write Sidebar.astro**

Create `src/components/Sidebar.astro`:

```astro
---
import ProgressBar from './ProgressBar.astro';
import { SECTIONS } from '../data/curriculum';
import { getCollection } from 'astro:content';

const base = import.meta.env.BASE_URL;

// Build nav items for all sections
const navData: Array<{ section: string; label: string; icon: string; topics: Array<{ title: string; slug: string; order: number }> }> = [];

for (const sec of SECTIONS) {
  const entries = await getCollection(sec.id as any).catch(() => []);
  const sorted = entries.sort((a, b) => a.data.order - b.data.order);
  navData.push({
    section: sec.id,
    label: sec.label,
    icon: sec.icon,
    topics: sorted.map((e) => ({ title: e.data.title, slug: e.slug, order: e.data.order })),
  });
}
---

<!-- Mobile toggle button -->
<button
  id="sidebar-toggle"
  aria-label="Toggle sidebar"
  class="fixed top-4 left-4 z-50 lg:hidden bg-white border border-border rounded-lg p-2 shadow-sm"
>
  <svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>

<!-- Overlay for mobile -->
<div id="sidebar-overlay" class="fixed inset-0 bg-black/30 z-30 hidden lg:hidden"></div>

<!-- Sidebar -->
<aside
  id="sidebar"
  class="fixed top-0 left-0 h-screen w-sidebar bg-white border-r border-border flex flex-col z-40
         -translate-x-full lg:translate-x-0 transition-transform duration-200"
>
  <!-- Logo / Brand -->
  <a href={base} class="flex items-center gap-2 px-5 py-4 border-b border-border hover:bg-bg transition-colors">
    <span class="text-accent font-bold text-lg">SD</span>
    <span class="text-text-primary font-semibold text-sm">System Design 101</span>
  </a>

  <!-- Nav sections (scrollable) -->
  <nav class="flex-1 overflow-y-auto py-4 px-3">
    {navData.map(({ section, label, icon, topics }) => (
      <div class="mb-4" data-section={section}>
        <button
          class="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors"
          data-section-toggle={section}
          aria-expanded="true"
        >
          <span>{icon}</span>
          <span>{label}</span>
          <svg class="ml-auto w-3 h-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <ul class="mt-1 space-y-0.5" data-section-list={section}>
          {topics.map(({ title, slug }) => (
            <li>
              <a
                href={`${base}${section}/${slug}`}
                class="sidebar-link"
                data-topic-link={`${base}${section}/${slug}`}
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </nav>

  <!-- Progress and reset -->
  <div class="border-t border-border">
    <ProgressBar />
    <button
      id="reset-progress"
      class="w-full text-xs text-text-secondary hover:text-red-500 px-4 py-2 transition-colors text-left"
    >
      Reset progress
    </button>
  </div>
</aside>

<!-- Sidebar spacer so content doesn't go under sidebar on desktop -->
<div class="hidden lg:block w-sidebar shrink-0"></div>

<script>
  // Mobile sidebar toggle
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('-translate-x-full');
    overlay?.classList.toggle('hidden');
  });
  overlay?.addEventListener('click', () => {
    sidebar?.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
  });

  // Section collapse/expand
  document.querySelectorAll('[data-section-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section-toggle');
      const list = document.querySelector(`[data-section-list="${section}"]`);
      const arrow = btn.querySelector('svg');
      list?.classList.toggle('hidden');
      arrow?.classList.toggle('rotate-180');
      btn.setAttribute('aria-expanded', list?.classList.contains('hidden') ? 'false' : 'true');
    });
  });

  // Highlight active link
  const currentPath = window.location.pathname;
  document.querySelectorAll('[data-topic-link]').forEach((a) => {
    if (a.getAttribute('data-topic-link') === currentPath) {
      a.classList.add('active');
    }
  });

  // Mark completed links
  document.querySelectorAll('[data-topic-link]').forEach((a) => {
    const href = a.getAttribute('data-topic-link') ?? '';
    if (localStorage.getItem(`sd101_complete_${href}`) === '1') {
      a.classList.add('completed');
    }
  });

  // Update on topic-complete event
  document.addEventListener('topic-complete', (e: any) => {
    const { path } = e.detail;
    document.querySelectorAll(`[data-topic-link="${path}"]`).forEach((a) => {
      a.classList.add('completed');
    });
    updateProgress();
  });

  // Progress bar
  function updateProgress() {
    const links = document.querySelectorAll('[data-topic-link]');
    const total = links.length;
    if (total === 0) return;
    let done = 0;
    links.forEach((a) => {
      const href = a.getAttribute('data-topic-link') ?? '';
      if (localStorage.getItem(`sd101_complete_${href}`) === '1') done++;
    });
    const pct = Math.round((done / total) * 100);
    const bar = document.getElementById('progress-bar');
    const label = document.getElementById('progress-pct');
    if (bar) bar.style.width = `${pct}%`;
    if (label) label.textContent = `${pct}%`;
  }

  updateProgress();

  // Reset progress
  document.getElementById('reset-progress')?.addEventListener('click', () => {
    if (confirm('Reset all progress?')) {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('sd101_complete_'))
        .forEach((k) => localStorage.removeItem(k));
      document.querySelectorAll('[data-topic-link]').forEach((a) => a.classList.remove('completed'));
      updateProgress();
    }
  });
</script>
```

- [ ] **Step 2: Create an empty progress script (the sidebar inline script handles everything)**

Create `src/scripts/progress.ts` (empty — logic lives in Sidebar.astro):

```typescript
// Progress tracking is handled inline in Sidebar.astro
export {};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.astro src/scripts/
git commit -m "feat: add sidebar with navigation and progress tracking"
```

---

### Task 7: Dynamic routing and page generation

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/[section]/[slug].astro`

- [ ] **Step 1: Write dynamic route page**

Create `src/pages/[section]/[slug].astro`:

```astro
---
import { getCollection, type CollectionEntry } from 'astro:content';
import TopicLayout from '../../layouts/TopicLayout.astro';
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';

type Section = 'fundamentals' | 'building-blocks' | 'patterns' | 'case-studies' | 'interview-prep';

export async function getStaticPaths() {
  const sections: Section[] = ['fundamentals', 'building-blocks', 'patterns', 'case-studies', 'interview-prep'];
  const allPaths: any[] = [];

  for (const section of sections) {
    const entries = await getCollection(section as any);
    const sorted = entries.sort((a: any, b: any) => a.data.order - b.data.order);

    sorted.forEach((entry: any, idx: number) => {
      const prev = sorted[idx - 1];
      const next = sorted[idx + 1];
      allPaths.push({
        params: { section, slug: entry.slug },
        props: {
          entry,
          section,
          prevTopic: prev
            ? { title: prev.data.title, href: `${section}/${prev.slug}` }
            : undefined,
          nextTopic: next
            ? { title: next.data.title, href: `${section}/${next.slug}` }
            : undefined,
        },
      });
    });
  }

  return allPaths;
}

const { entry, section, prevTopic, nextTopic } = Astro.props;
const { Content, frontmatter } = await entry.render();
const data = entry.data;
---

{data.isCaseStudy ? (
  <CaseStudyLayout
    title={data.title}
    description={data.description}
    difficulty={data.difficulty}
    readTime={data.readTime}
    diagram={data.diagram}
    relatedTopics={data.relatedTopics}
    takeaways={frontmatter.takeaways ?? []}
    interviewTips={frontmatter.interviewTips ?? []}
    problemStatement={frontmatter.problemStatement ?? ''}
    prevTopic={prevTopic}
    nextTopic={nextTopic}
  >
    <Content />
  </CaseStudyLayout>
) : (
  <TopicLayout
    title={data.title}
    description={data.description}
    difficulty={data.difficulty}
    readTime={data.readTime}
    diagram={data.diagram}
    relatedTopics={data.relatedTopics}
    takeaways={frontmatter.takeaways ?? []}
    prevTopic={prevTopic}
    nextTopic={nextTopic}
  >
    <Content />
  </TopicLayout>
)}
```

- [ ] **Step 2: Write homepage**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { SECTIONS, TOTAL_TOPICS } from '../data/curriculum';
const base = import.meta.env.BASE_URL;

const sectionFirstSlugs: Record<string, string> = {
  fundamentals: 'computer-architecture',
  'building-blocks': 'load-balancing',
  patterns: 'rate-limiting',
  'case-studies': 'tinyurl',
  'interview-prep': 'how-to-approach',
};
---

<BaseLayout title="Home">
  <div class="max-w-content mx-auto px-6 py-16">
    <!-- Hero -->
    <header class="text-center mb-16">
      <span class="text-xs font-semibold uppercase tracking-widest text-accent bg-accent-light px-3 py-1 rounded-full">Free & Open Source</span>
      <h1 class="text-5xl font-bold text-text-primary mt-5 mb-4 leading-tight">
        System Design<br /><span class="text-accent">101</span>
      </h1>
      <p class="text-lg text-text-secondary max-w-xl mx-auto mb-8">
        Learn system design from zero to interview-ready. {TOTAL_TOPICS} topics with visual diagrams, real case studies, and interview tips. Completely free.
      </p>
      <div class="flex items-center justify-center gap-4">
        <a
          href={`${base}fundamentals/computer-architecture`}
          class="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Start Learning →
        </a>
        <a href="https://github.com/wadekarg/system_design_101" class="text-text-secondary hover:text-accent text-sm transition-colors">
          View on GitHub
        </a>
      </div>
    </header>

    <!-- Overall progress (client-rendered) -->
    <div class="mb-12 bg-white border border-border rounded-2xl p-5 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-text-primary">Overall Progress</span>
        <span id="home-progress-pct" class="text-sm font-bold text-accent">0 / {TOTAL_TOPICS} topics</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div id="home-progress-bar" class="h-full bg-accent rounded-full transition-all duration-500" style="width: 0%"></div>
      </div>
    </div>

    <!-- Section cards -->
    <div class="space-y-4">
      {SECTIONS.map((sec) => (
        <a
          href={`${base}${sec.id}/${sectionFirstSlugs[sec.id]}`}
          class="block bg-white border border-border rounded-2xl p-6 shadow-sm hover:border-accent hover:shadow-md transition-all group"
        >
          <div class="flex items-start gap-4">
            <span class="text-3xl">{sec.icon}</span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">{sec.label}</h2>
                <span class="text-xs text-text-secondary">{sec.topicCount} topics</span>
              </div>
              <p class="text-sm text-text-secondary mb-3">{sec.description}</p>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-accent rounded-full transition-all duration-500"
                  id={`progress-${sec.id}`}
                  style="width: 0%"
                ></div>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>
</BaseLayout>

<script>
  // Calculate per-section progress from localStorage
  // Topic paths follow pattern: /system_design_101/{section}/{slug}
  const base = document.querySelector('base')?.href ?? '/system_design_101/';

  function calcProgress() {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('sd101_complete_'));
    const done = keys.filter((k) => localStorage.getItem(k) === '1').length;
    const total = 38;

    const bar = document.getElementById('home-progress-bar');
    const pct = document.getElementById('home-progress-pct');
    if (bar) bar.style.width = `${Math.round((done / total) * 100)}%`;
    if (pct) pct.textContent = `${done} / ${total} topics`;

    const sectionCounts: Record<string, { done: number; total: number }> = {
      fundamentals: { done: 0, total: 6 },
      'building-blocks': { done: 0, total: 10 },
      patterns: { done: 0, total: 8 },
      'case-studies': { done: 0, total: 10 },
      'interview-prep': { done: 0, total: 4 },
    };

    keys.forEach((k) => {
      if (localStorage.getItem(k) !== '1') return;
      for (const sec of Object.keys(sectionCounts)) {
        if (k.includes(`/${sec}/`)) {
          sectionCounts[sec].done++;
        }
      }
    });

    for (const [sec, { done, total }] of Object.entries(sectionCounts)) {
      const el = document.getElementById(`progress-${sec}`);
      if (el) el.style.width = `${Math.round((done / total) * 100)}%`;
    }
  }

  calcProgress();
</script>
```

- [ ] **Step 3: Add a placeholder first topic so the build has content**

Create `src/content/fundamentals/computer-architecture.mdx`:

```mdx
---
title: Computer Architecture
description: Understand how computers work at the hardware level — the foundation of all system design.
order: 1
difficulty: Beginner
readTime: 8 min read
diagram: ComputerArchitectureDiagram
relatedTopics:
  - fundamentals/networking-basics
  - fundamentals/latency-vs-throughput
---

export const takeaways = [
  "CPUs execute instructions but are fast at computation, not storage",
  "RAM is fast but volatile; disk is slow but persistent",
  "Cache hierarchy (L1/L2/L3) bridges the gap between CPU speed and memory speed",
  "I/O operations (disk, network) are the slowest part of any system",
];

*Content coming soon...*
```

- [ ] **Step 4: Run build to verify routing works**

```bash
npm run build
```

Expected: Build succeeds. One page generated at `dist/system_design_101/fundamentals/computer-architecture/index.html`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ src/content/fundamentals/computer-architecture.mdx
git commit -m "feat: add dynamic routing, homepage, and first placeholder topic"
```

---

### Task 8: All 38 diagram components

**Files:** Create all 38 `.astro` diagram files under `src/components/diagrams/`

Each diagram is a self-contained animated SVG. Build each one to the spec below. All share these rules:
- `viewBox="0 0 600 280"`, `width="100%"`, `xmlns="http://www.w3.org/2000/svg"`
- Color palette: accent `#4F46E5`, slate boxes `#F8FAFC` with `#E2E8F0` border, text `#1E293B`
- Animations defined in `<style>` inside the SVG, looping gently (`animation-iteration-count: infinite`)
- `@media (prefers-reduced-motion: reduce)` block inside `<style>` pausing all animations

**Diagram specs:**

**ComputerArchitectureDiagram:** 4 boxes in a column: CPU → L1/L2/L3 Cache → RAM → Disk. Animated pulse traveling upward (Disk → CPU) to show data flow. Add labels for typical speeds (1ns, 10ns, 100ns, 10ms).

**NetworkingDiagram:** Client on left, DNS Server top-right, Server bottom-right. Show DNS lookup (client → DNS → returns IP) then HTTP request (client → server). Two-step animated arrow sequence.

**HttpDiagram:** Client and Server boxes. Show 3-way TCP handshake (SYN → SYN-ACK → ACK), then HTTP Request/Response arrows. Label HTTP/1.1 vs HTTP/2 multiplexing with a parallel arrows motif.

**ApisDiagram:** 4 mini diagrams side-by-side (REST, GraphQL, gRPC, WebSocket). Each shows client → server exchange with its characteristic pattern (REST: multiple round trips; GraphQL: one query; gRPC: binary; WS: bidirectional arrows).

**LatencyDiagram:** Horizontal bar chart comparing: In-memory (1μs), SSD read (100μs), Network (1ms), HDD (10ms), Internet (100ms). Bars animate growing left-to-right.

**AvailabilityDiagram:** Circle gauge showing 99.9% vs 99.99% uptime. Annotate: 99.9% = 8.7hr/year downtime; 99.99% = 52min/year. Animate the arc filling.

**LoadBalancingDiagram:** 1 Client → 1 Load Balancer → 3 Servers. Animated packet icon travels Client→LB, then round-robins to Server 1, 2, 3 in sequence.

**CachingDiagram:** Two flows side by side. Left (Cache HIT, green): Client → Cache → returns data. Right (Cache MISS, orange): Client → Cache → DB → Cache stores → Client. Animate both flows alternating.

**CdnDiagram:** World map outline (simple SVG paths), 1 Origin Server center, 3 CDN Edge nodes (US, EU, Asia). Users connect to nearest edge with short arrows; edges pull from origin with longer arrow. Edge → user arrows animate faster than edge → origin.

**SqlDiagram:** Table grid showing rows/columns. Show JOIN operation: two tables merge into one result. Animate rows being selected (highlight sweep).

**NoSqlDiagram:** 4 quadrants: Key-Value (Redis), Document (MongoDB), Column (Cassandra), Graph (Neo4j). Each shows its storage shape. Key-value: key→value pair. Document: JSON-like blob. Column: column family. Graph: nodes+edges.

**ReplicationDiagram:** Primary DB on left, two Replica DBs on right. Write arrow → Primary. Primary propagates to replicas (replication log arrow, dashed, animated flowing right). Read arrows from replicas.

**ShardingDiagram:** Hash function in center. Keys animate flowing in, get distributed to Shard A, B, C boxes. Each shard has a mini cylinder (DB icon).

**MessageQueuesDiagram:** Producer → Queue (mailbox icon with stacked messages) → Multiple Consumers. Messages animate: appear in queue, get pulled by each consumer in turn. Show queue as FIFO.

**ObjectStorageDiagram:** App → API call → Object Storage (bucket icon). Show flat namespace: bucket name + object key → blob. Compare to filesystem hierarchy (crossed out). Animate upload then download.

**WebsocketsDiagram:** Client and Server connected with a persistent double-headed arrow (the WS connection). Small message packets animate bidirectionally simultaneously, showing full-duplex. Label: vs HTTP (show single-direction per request).

**RateLimitingDiagram:** Token bucket visualization: bucket fills with tokens (drip from top), requests consume tokens. When bucket empty, requests are rejected (red X). Animate token drip and request consumption.

**ConsistentHashingDiagram:** Ring (circle) with Server A, B, C, D nodes placed around it. Keys shown mapping to their nearest clockwise node. Animate adding a new server: only a segment of keys remaps (highlighted arc).

**BloomFilterDiagram:** Bit array (row of 0s and 1s). Hash functions H1, H2, H3 point to specific bits. Show: element added → bits set to 1. Query: check those bits → "possibly in set" or "definitely not." Animate hash computation.

**LeaderElectionDiagram:** 5 nodes in a ring/cluster. Initially all equal. Election: one node becomes Leader (crown icon), others become Followers. Arrows show heartbeat from Leader to Followers. If leader fails (X), new election animates.

**CircuitBreakerDiagram:** State machine: Closed (green, requests flow) → Open (red, requests blocked) → Half-Open (yellow, probe request). Animate state transitions. Show error counter triggering open state.

**ApiGatewayDiagram:** Clients (mobile, web, IoT) → API Gateway → multiple microservices (Auth, Products, Orders, Payments). Gateway handles auth, rate limiting, routing shown as labels on the gateway box.

**EventDrivenDiagram:** Publishers → Event Bus (Kafka-style) → Multiple Subscribers. Events animate as envelopes flowing from publishers to bus, then fanning out to subscribers independently.

**DistributedTransactionsDiagram:** Two-Phase Commit: Coordinator → Phase 1 PREPARE to all participants → participants reply YES/NO → Phase 2 COMMIT/ABORT. Animate two-step flow with arrows.

**TinyUrlDiagram:** Full architecture: Client → Load Balancer → App Servers → Cache (Redis) → DB (PostgreSQL). Show URL shortening flow: long URL in → short code out. Base62 encoding shown as label.

**TwitterDiagram:** Fan-out on write: User posts tweet → Fanout Service → writes to all followers' feeds. Feed stored in Redis (timeline cache). Read: User reads feed from Redis. Show celebrity exception (fan-out on read for high-follower accounts).

**YoutubeDiagram:** Video upload flow (Client → Upload Service → Object Storage → Transcoding Service → CDN) separate from video stream flow (Client → CDN edge → Origin if miss). Two distinct animated paths.

**DiscordDiagram:** WebSocket server cluster. Client connects to gateway, messages route through message broker to correct server/channel. Show guild → channel → message routing. Presence service updates shown separately.

**GoogleDriveDiagram:** Client → Metadata Service (stores file info in DB) + Block Storage Service (stores file chunks). Show chunking: file split into 4MB blocks, each stored with hash. Sync client detects local changes and uploads delta.

**WebCrawlerDiagram:** Seed URLs → URL Frontier (priority queue) → Fetcher → Parser → (extract links back to frontier) + (content → Indexer). Show politeness delay. Animate crawl loop.

**NotificationDiagram:** Event source → Notification Service → Queue → Workers → Push (FCM/APNS), Email (SES), SMS (Twilio). Show fan-out to multiple channels. Rate limiting per user shown as gate.

**AutocompleteDiagram:** User typing → Request to Autocomplete Service → Trie lookup → Top-K results returned → displayed as dropdown. Trie tree shown with highlighted path for typed prefix.

**UberDiagram:** Driver location updates → Location Service (geospatial index) → Rider requests ride → Matching Service queries nearby drivers → assigns driver → trip tracking via WebSocket.

**TicketBookingDiagram:** User selects seat → Reservation Service → Optimistic lock on seat (Redis TTL 10min) → Payment Service → Confirm booking → Release lock. Show race condition prevention.

**InterviewApproachDiagram:** Flowchart: Clarify requirements → Estimate scale → High-level design → Deep dive on bottlenecks → Discuss trade-offs. Numbered steps, each with a checkbox that animates filling in sequence.

**CapacityDiagram:** Math on screen: QPS calculation (DAU × requests/day ÷ 86400). Storage calculation (requests/day × data/request × retention). Bandwidth calculation. Numbers animate counting up.

**TradeOffsDiagram:** Seesaw/balance beam showing: Consistency ↔ Availability (CAP), Latency ↔ Consistency, Cost ↔ Performance. Beam animates tipping based on which side is chosen.

**MistakesDiagram:** 4 warning signs (⚠️) with common mistakes: "Jumping to solution before requirements," "Not estimating scale," "Ignoring failure modes," "Not discussing trade-offs." Each blinks in sequence.

- [ ] **Step 1: Create all 38 diagram .astro files with their full SVG + CSS animation code** (implement each per the spec above)

- [ ] **Step 2: Verify build succeeds with all diagrams**

```bash
npm run build
```

Expected: No import errors, dist/ builds successfully.

- [ ] **Step 3: Spot-check 5 diagrams in dev server**

```bash
npm run dev
```

Open `http://localhost:4321/system_design_101`. Navigate to any page with a diagram. Verify animation runs, respects `prefers-reduced-motion`.

- [ ] **Step 4: Commit**

```bash
git add src/components/diagrams/
git commit -m "feat: add all 38 animated SVG diagram components"
```

---

### Task 9: Fundamentals section — 6 topic pages

**Files:** Create 6 MDX files in `src/content/fundamentals/`

Each file follows this frontmatter template:
```mdx
---
title: <title>
description: <one-line description>
order: <1-6>
difficulty: <Beginner|Intermediate|Advanced>
readTime: <X min read>
diagram: <DiagramComponentName>
relatedTopics:
  - <section/slug>
---

export const takeaways = [ ... ];

## <Section heading>
<Content>
```

**Topic 1: `computer-architecture.mdx`**
- difficulty: Beginner, order: 1, diagram: ComputerArchitectureDiagram, readTime: 8 min read
- Sections: What is Computer Architecture | CPU: The Brain | Memory Hierarchy | Storage | Why This Matters for System Design
- Key points: CPU cores/threads, clock speed; L1/L2/L3 cache (SRAM, nanoseconds); RAM (DRAM, volatile, gigabytes); SSD vs HDD (100μs vs 10ms); disk I/O as a bottleneck; vertical scaling means bigger CPU/more RAM
- takeaways: ["CPU is fast at compute but can't store data", "Cache hierarchy exists because RAM is too slow for CPUs", "I/O operations (disk, network) dominate latency", "Knowing hardware limits helps you design better software"]

**Topic 2: `networking-basics.mdx`**
- difficulty: Beginner, order: 2, diagram: NetworkingDiagram, readTime: 10 min read
- Sections: IP Addresses | DNS — The Internet's Phone Book | TCP vs UDP | Ports | How a Request Travels the Internet
- Key points: IPv4/IPv6, public vs private; DNS resolution steps (recursive resolver → root → TLD → authoritative); TCP (reliable, ordered, connection-oriented, 3-way handshake); UDP (fast, unreliable, no handshake — video streaming, gaming); ports 80/443/22; traceroute concept
- takeaways: ["DNS resolves human-readable names to IP addresses", "TCP guarantees delivery; UDP sacrifices reliability for speed", "Every internet request goes through multiple DNS lookups", "Understanding networking fundamentals prevents mysterious latency bugs"]

**Topic 3: `http-https.mdx`**
- difficulty: Beginner, order: 3, diagram: HttpDiagram, readTime: 9 min read
- Sections: What is HTTP | Request & Response Structure | HTTP Methods | Status Codes | HTTP/1.1 vs HTTP/2 vs HTTP/3 | HTTPS and TLS
- Key points: stateless protocol; request line, headers, body; GET/POST/PUT/DELETE/PATCH semantics; 200/201/301/302/400/401/403/404/500; HTTP/1.1 head-of-line blocking; HTTP/2 multiplexing, server push; HTTP/3 QUIC (UDP-based); TLS handshake, certificates, HTTPS everywhere
- takeaways: ["HTTP is stateless — servers don't remember previous requests", "HTTP/2 multiplexing solves HTTP/1.1's head-of-line blocking", "HTTPS encrypts traffic via TLS — always use it in production", "Status codes tell clients exactly what happened"]

**Topic 4: `apis.mdx`**
- difficulty: Beginner, order: 4, diagram: ApisDiagram, readTime: 12 min read
- Sections: What is an API | REST APIs | GraphQL | gRPC | WebSockets | Choosing the Right API Style
- Key points: API as a contract; REST — stateless, HTTP verbs, JSON, CRUD resources, pagination; GraphQL — single endpoint, query what you need, N+1 problem, great for mobile; gRPC — Protocol Buffers, binary, low latency, streaming, internal microservices; WebSockets — persistent connection, bidirectional, real-time apps; comparison table
- takeaways: ["REST is simple and universal — default choice for public APIs", "GraphQL shines when clients need different data shapes", "gRPC is ideal for high-performance internal service communication", "WebSockets enable real-time features HTTP cannot efficiently support"]

**Topic 5: `latency-vs-throughput.mdx`**
- difficulty: Beginner, order: 5, diagram: LatencyDiagram, readTime: 7 min read
- Sections: Latency Defined | Throughput Defined | The Relationship | Latency Numbers Every Engineer Should Know | Optimizing Each
- Key points: latency = time for one request; throughput = requests per second; they trade off (batching increases throughput, increases latency); L1 cache ref 1ns; RAM 100ns; SSD 100μs; HDD 10ms; network roundtrip (same datacenter) 0.5ms; cross-continent 100ms; percentiles (p50, p99, p999) vs averages; tail latency amplification in microservices
- takeaways: ["Latency is per-request time; throughput is requests per second", "Optimizing for one often hurts the other — understand your bottleneck", "p99 latency matters more than average for user experience", "Network and disk I/O dominate system latency"]

**Topic 6: `availability-reliability.mdx`**
- difficulty: Beginner, order: 6, diagram: AvailabilityDiagram, readTime: 10 min read
- Sections: Availability: The Nines | Reliability | Fault Tolerance | High Availability Patterns | SLAs, SLOs, SLIs
- Key points: 99% = 3.65 days/year downtime; 99.9% = 8.7hrs; 99.99% = 52min; 99.999% = 5min; reliability = probability of correct results; fault tolerance = system works despite component failures; active-passive vs active-active; eliminating single points of failure; SLA (contractual), SLO (target), SLI (measurement); error budget
- takeaways: ["Each '9' of availability reduces downtime by 10x", "High availability requires eliminating single points of failure", "Reliability means correct results, not just uptime", "SLOs define the target; SLIs measure it; SLAs contractualize it"]

- [ ] **Step 1: Create all 6 MDX files with full content per the specs above**
- [ ] **Step 2: Run dev server and visually verify all 6 pages load with content, diagram, sidebar highlights active topic, next/prev nav works**
- [ ] **Step 3: Commit**

```bash
git add src/content/fundamentals/
git commit -m "feat: add all 6 Fundamentals topic pages"
```

---

### Task 10: Building Blocks section — 10 topic pages

**Files:** Create 10 MDX files in `src/content/building-blocks/`

**Topic 1: `load-balancing.mdx`** — order:1, difficulty:Intermediate, readTime: 12 min, diagram: LoadBalancingDiagram
- Sections: What is Load Balancing | Algorithms (Round Robin, Least Connections, IP Hash, Weighted) | Layer 4 vs Layer 7 | Health Checks | Session Persistence | Common Load Balancers
- Key points: distribute traffic; horizontal scalability; L4 = TCP/UDP level (HAProxy), L7 = HTTP level (Nginx, AWS ALB) — can route by path/header; sticky sessions for stateful apps; health checks remove unhealthy nodes; active-active vs active-passive load balancers; load balancer itself as SPOF → DNS round-robin or anycast
- takeaways: ["Load balancers distribute traffic to prevent any single server being overwhelmed", "L7 load balancers can make routing decisions based on HTTP content", "Health checks automatically remove failed servers from the pool", "Always make your load balancer redundant — it can be a single point of failure"]
- relatedTopics: fundamentals/availability-reliability, patterns/consistent-hashing, building-blocks/caching

**Topic 2: `caching.mdx`** — order:2, difficulty:Intermediate, readTime: 14 min, diagram: CachingDiagram
- Sections: What is Caching | Cache Hit vs Miss | Cache Placement (Client, CDN, Server-side, DB) | Eviction Policies (LRU, LFU, FIFO) | Write Strategies (Write-through, Write-back, Write-around) | Cache Invalidation | Redis vs Memcached
- Key points: cache stores frequently accessed data in fast storage; hit ratio; client-side (browser), CDN (static assets), server-side (Redis/Memcached), DB query cache; LRU most common for general use; write-through: write to cache and DB simultaneously (consistent but higher write latency); write-back: write to cache only, async to DB (fast writes, risk of data loss); cache invalidation is the hard problem; Redis = single-threaded, data structures, persistence; Memcached = multi-threaded, simple key-value
- takeaways: ["Caching is the single most impactful optimization in most systems", "Cache invalidation is notoriously difficult — design for it early", "LRU eviction works well for most workloads", "Redis supports rich data structures; Memcached is simpler but faster for plain key-value"]
- relatedTopics: building-blocks/cdn, building-blocks/database-replication, patterns/consistent-hashing

**Topic 3: `cdn.mdx`** — order:3, difficulty:Beginner, readTime: 9 min, diagram: CdnDiagram
- Sections: What is a CDN | How It Works | Push vs Pull CDN | CDN Use Cases | Cache-Control Headers | Popular CDNs
- Key points: geographically distributed servers (points of presence); content served from nearest POP reduces latency; pull CDN caches on first request (lazy), push CDN pre-populated; static assets (images, JS, CSS, video) ideal for CDN; TTL and Cache-Control headers; CDN also provides DDoS protection, TLS termination; Cloudflare, Akamai, AWS CloudFront
- takeaways: ["CDNs reduce latency by serving content from servers close to users", "Pull CDNs cache on demand; push CDNs require explicit content upload", "CDNs also add DDoS protection and TLS termination as bonuses", "Cache-Control headers control how long CDNs cache your content"]
- relatedTopics: building-blocks/caching, building-blocks/object-storage

**Topic 4: `sql-databases.mdx`** — order:4, difficulty:Intermediate, readTime: 13 min, diagram: SqlDiagram
- Sections: Relational Databases | ACID Properties | Schema Design | Indexing | Joins | Transactions | When to Use SQL
- Key points: tables with rows/columns, schema-first; ACID (Atomicity: all-or-nothing, Consistency: constraints enforced, Isolation: concurrent transactions don't interfere, Durability: committed data survives crash); B-tree indexes; N+1 query problem; INNER/LEFT/RIGHT JOIN; normalization (1NF, 2NF, 3NF) vs denormalization; PostgreSQL, MySQL, SQLite; strong consistency; vertical scaling primary strategy; good for: transactions, complex queries, structured data
- takeaways: ["ACID guarantees make SQL databases ideal for financial and transactional workloads", "Indexes speed up reads but slow down writes — index thoughtfully", "JOINs are powerful but expensive at scale — consider denormalization for read-heavy systems", "SQL databases scale vertically easily but horizontal sharding is complex"]
- relatedTopics: building-blocks/nosql-databases, building-blocks/database-replication, building-blocks/database-sharding

**Topic 5: `nosql-databases.mdx`** — order:5, difficulty:Intermediate, readTime: 12 min, diagram: NoSqlDiagram
- Sections: Why NoSQL | Four Types of NoSQL | Key-Value Stores | Document Stores | Column-Family Stores | Graph Databases | CAP Theorem | When to Use NoSQL
- Key points: schema-less / flexible schema; horizontal scaling built-in; eventual consistency trade-off; key-value (Redis, DynamoDB) — blazing fast, simple; document (MongoDB, CouchDB) — JSON docs, flexible schema, nested data; column-family (Cassandra, HBase) — wide rows, write-heavy, time-series; graph (Neo4j) — relationships first-class; CAP theorem: can only pick 2 of 3 (Consistency, Availability, Partition tolerance); NoSQL often sacrifices C for A+P; good for: unstructured data, massive scale, simple access patterns
- takeaways: ["NoSQL trades consistency for horizontal scalability and flexibility", "Choose NoSQL type based on access pattern, not just data shape", "Cassandra excels at write-heavy, time-series workloads", "Graph databases are uniquely powerful when relationships between entities matter most"]
- relatedTopics: building-blocks/sql-databases, building-blocks/database-sharding, building-blocks/caching

**Topic 6: `database-replication.mdx`** — order:6, difficulty:Intermediate, readTime: 11 min, diagram: ReplicationDiagram
- Sections: What is Replication | Leader-Follower Replication | Multi-Leader Replication | Leaderless Replication | Replication Lag | Failover
- Key points: copy data to multiple nodes; leader-follower: writes → primary → replicated to replicas; reads from replicas (read scaling); replication lag = replicas are slightly behind → eventual consistency; synchronous (guaranteed consistency, higher latency) vs asynchronous (lower latency, risk of data loss); multi-leader for multi-datacenter; leaderless (Dynamo-style): write to quorum, read from quorum; failover: auto-promote replica to primary; split-brain problem
- takeaways: ["Replication improves read throughput by distributing reads across replicas", "Replication lag causes temporary inconsistency — design read paths to tolerate it", "Synchronous replication guarantees no data loss but adds latency", "Automatic failover requires careful quorum design to avoid split-brain"]
- relatedTopics: building-blocks/database-sharding, building-blocks/sql-databases, patterns/leader-election

**Topic 7: `database-sharding.mdx`** — order:7, difficulty:Advanced, readTime: 14 min, diagram: ShardingDiagram
- Sections: What is Sharding | Horizontal vs Vertical Partitioning | Sharding Strategies (Range, Hash, Directory) | Hotspot Problem | Resharding | Challenges
- Key points: split data across multiple DB instances; each shard owns a subset of data; range sharding (by ID range) — easy but hotspots; hash sharding (hash(key) % n) — even distribution, hard to reshard; directory-based (lookup table for shard location) — flexible, extra hop; hotspot: one shard gets disproportionate traffic (celebrity row); resharding painful: consistent hashing minimizes resharding; cross-shard joins impossible; distributed transactions complex; shard key choice is critical
- takeaways: ["Sharding is necessary when a single DB can't handle your data volume or write load", "Hash-based sharding distributes data evenly but makes range queries inefficient", "Your shard key choice determines whether you get hotspots", "Consistent hashing minimizes data movement when adding or removing shards"]
- relatedTopics: patterns/consistent-hashing, building-blocks/database-replication, building-blocks/nosql-databases

**Topic 8: `message-queues.mdx`** — order:8, difficulty:Intermediate, readTime: 13 min, diagram: MessageQueuesDiagram
- Sections: What is a Message Queue | Producers and Consumers | Benefits | Message Delivery Guarantees | Apache Kafka | RabbitMQ | Use Cases
- Key points: asynchronous communication between services; decoupling; producer puts message in queue, consumer pulls; at-most-once / at-least-once / exactly-once delivery; dead letter queues; Kafka: distributed log, ordered, replay, high throughput, pub/sub, event streaming; RabbitMQ: traditional queue, AMQP, routing, work queues; use cases: async job processing, event streaming, microservice decoupling, notification systems, order processing
- takeaways: ["Message queues decouple producers from consumers, enabling independent scaling", "Kafka is the choice for event streaming and high-throughput; RabbitMQ for complex routing", "At-least-once delivery is the practical default — design consumers to be idempotent", "Dead letter queues capture messages that failed processing for debugging"]
- relatedTopics: patterns/event-driven-architecture, building-blocks/websockets-and-long-polling

**Topic 9: `object-storage.mdx`** — order:9, difficulty:Beginner, readTime: 8 min, diagram: ObjectStorageDiagram
- Sections: What is Object Storage | Object Storage vs File Storage vs Block Storage | How It Works | Use Cases | Amazon S3 Concepts
- Key points: flat namespace: bucket + object key → blob; not hierarchical like filesystem; optimized for large unstructured files (images, videos, backups, logs); unlimited scale; S3: buckets, objects, keys, metadata, versioning, lifecycle policies, pre-signed URLs, access control; 99.999999999% (11 nines) durability via erasure coding; append-only (no partial updates); CDN in front for fast delivery
- takeaways: ["Object storage uses a flat key-value model — no folders, just bucket + key", "It's designed for large, unstructured files at virtually unlimited scale", "Pre-signed URLs allow secure, temporary access to private objects", "Always put a CDN in front of object storage for static asset delivery"]
- relatedTopics: building-blocks/cdn, building-blocks/sql-databases

**Topic 10: `websockets-and-long-polling.mdx`** — order:10, difficulty:Intermediate, readTime: 10 min, diagram: WebsocketsDiagram
- Sections: The Problem with HTTP for Real-Time | Short Polling | Long Polling | Server-Sent Events | WebSockets | When to Use Each
- Key points: HTTP is request-response (client always initiates); short polling: client repeatedly asks "any updates?" — inefficient; long polling: client holds request open until server has data (Comet technique); SSE: server pushes updates over HTTP, one-direction only; WebSockets: full-duplex, persistent TCP connection, low overhead after handshake, ideal for chat/gaming/live data; WS upgrade from HTTP; scale: WS connections are stateful → sticky sessions or pub/sub backend needed
- takeaways: ["WebSockets enable true bidirectional real-time communication over a single persistent connection", "Long polling is a good fallback when WebSockets aren't available", "Server-Sent Events are simpler than WebSockets for one-way server→client streams", "Stateful WebSocket connections require careful load balancer configuration"]
- relatedTopics: fundamentals/apis, building-blocks/message-queues

- [ ] **Step 1: Create all 10 MDX files with full content per the specs above**
- [ ] **Step 2: Run dev server, visually verify all 10 pages, check sidebar shows Building Blocks section**
- [ ] **Step 3: Commit**

```bash
git add src/content/building-blocks/
git commit -m "feat: add all 10 Building Blocks topic pages"
```

---

### Task 11: Design Patterns section — 8 topic pages

**Files:** Create 8 MDX files in `src/content/patterns/`

**Topic 1: `rate-limiting.mdx`** — order:1, difficulty:Intermediate, readTime: 11 min, diagram: RateLimitingDiagram
- Sections: Why Rate Limiting | Algorithms (Token Bucket, Leaking Bucket, Fixed Window, Sliding Window Log, Sliding Window Counter) | Where to Apply | Rate Limiting Headers | Distributed Rate Limiting
- Key points: protect from abuse, DoS, fair usage; Token Bucket: tokens refill at fixed rate, burst allowed; Leaking Bucket: process at fixed rate, queue requests; Fixed Window: count per time window (edge case: burst at window boundary); Sliding Window Log: exact, expensive; Sliding Window Counter: approximation, memory efficient; apply at API Gateway or load balancer; HTTP 429 Too Many Requests; X-RateLimit-Limit/Remaining/Reset headers; Redis for distributed counter across servers
- takeaways: ["Token bucket allows controlled bursting; leaky bucket enforces a strict output rate", "Fixed window has an edge case: 2x burst at window boundaries — sliding window fixes this", "Always apply rate limiting at the edge (API gateway) not in each microservice", "Distributed rate limiting requires a shared store like Redis"]
- relatedTopics: patterns/api-gateway, building-blocks/caching

**Topic 2: `consistent-hashing.mdx`** — order:2, difficulty:Advanced, readTime: 13 min, diagram: ConsistentHashingDiagram
- Sections: The Problem with Simple Hashing | Consistent Hashing Explained | Virtual Nodes | Benefits | Real-World Use
- Key points: simple hash(key)%n — adding/removing server remaps all keys; consistent hashing: arrange servers on a ring, key maps to nearest clockwise server; adding server: only keys on adjacent arc remapped; virtual nodes: each physical server has multiple positions on ring → even distribution; load balancing with vnodes; used by DynamoDB, Cassandra, Redis Cluster, CDNs; minimizes cache invalidation on scaling events
- takeaways: ["Consistent hashing minimizes cache invalidation when servers are added or removed", "Virtual nodes solve the uneven distribution problem of basic consistent hashing", "DynamoDB and Cassandra use consistent hashing for data partitioning", "The key insight: only ~K/n keys need remapping when a server joins/leaves"]
- relatedTopics: building-blocks/database-sharding, building-blocks/caching, building-blocks/load-balancing

**Topic 3: `bloom-filters.mdx`** — order:3, difficulty:Advanced, readTime: 10 min, diagram: BloomFilterDiagram
- Sections: The Problem | How Bloom Filters Work | False Positives | Space & Time Complexity | Use Cases
- Key points: probabilistic data structure to test set membership; bit array + k hash functions; add element: hash k times, set those bits to 1; query: if all k bits are 1 → "probably yes"; if any bit is 0 → "definitely no"; no false negatives; false positive rate tunable (more bits = fewer false positives); never delete elements (use counting bloom filter for that); use cases: URL shortener (has this URL been shortened?), cache layer (check before expensive DB lookup), spam filters, blockchain
- takeaways: ["Bloom filters say 'definitely no' or 'probably yes' — never false negatives", "Use them to avoid expensive lookups for data you know doesn't exist", "False positive rate is tunable by adjusting bit array size and hash count", "Bloom filters use dramatically less memory than a hash set for the same data"]
- relatedTopics: building-blocks/caching, patterns/rate-limiting

**Topic 4: `leader-election.mdx`** — order:4, difficulty:Advanced, readTime: 11 min, diagram: LeaderElectionDiagram
- Sections: Why Leader Election | Bully Algorithm | Ring Algorithm | Paxos & Raft | ZooKeeper & etcd | Heartbeats and Fencing
- Key points: in a cluster, one node acts as coordinator (leader) to avoid conflicts; leader handles writes, scheduling, coordination; Bully: highest-ID node wins, O(n²) messages; Ring: election token circulates ring; Raft: consensus algorithm — leader elected by majority vote, used in Kubernetes (etcd), CockroachDB; ZooKeeper: ephemeral znodes for leader election; heartbeat: leader sends periodic signal to prove it's alive; fencing token: monotonic token prevents old leader issuing commands after new leader elected (zombie problem)
- takeaways: ["Leader election ensures only one node acts as coordinator at a time", "Raft is the practical choice for modern systems — readable, correct, well-implemented", "Heartbeats detect leader failure; fencing tokens prevent split-brain", "etcd and ZooKeeper handle leader election so you don't have to implement it yourself"]
- relatedTopics: building-blocks/database-replication, patterns/distributed-transactions

**Topic 5: `circuit-breaker.mdx`** — order:5, difficulty:Intermediate, readTime: 9 min, diagram: CircuitBreakerDiagram
- Sections: Cascading Failures | The Circuit Breaker Pattern | States: Closed, Open, Half-Open | Thresholds | Libraries | Bulkhead Pattern
- Key points: dependency failure cascades through microservices; circuit breaker wraps calls to external service; Closed: requests pass through, count failures; Open: after threshold, reject all requests immediately (fail fast), start timer; Half-Open: allow one probe request — if success, go Closed; if fail, go Open again; failure threshold (e.g. 50% in 10s) + timeout; return cached/default response when open; Hystrix (Netflix), Resilience4j (Java), Polly (.NET); Bulkhead: isolate failure domains like ship bulkheads
- takeaways: ["Circuit breakers stop cascading failures by failing fast when a dependency is unhealthy", "The three states (Closed/Open/Half-Open) implement an automatic recovery protocol", "Always have a fallback strategy for what to return when the circuit is open", "Bulkhead pattern complements circuit breakers by isolating resource pools"]
- relatedTopics: patterns/api-gateway, patterns/rate-limiting

**Topic 6: `api-gateway.mdx`** — order:6, difficulty:Intermediate, readTime: 11 min, diagram: ApiGatewayDiagram
- Sections: What is an API Gateway | Core Functions | Auth & Authorization | Rate Limiting & Throttling | Request Routing | Service Discovery | BFF Pattern | Trade-offs
- Key points: single entry point for all clients; authentication (verify JWT/OAuth), authorization; rate limiting; request routing to microservices; protocol translation (REST↔gRPC); load balancing; SSL termination; logging and observability; response caching; BFF (Backend for Frontend) — separate gateway per client type (mobile, web); APIGW adds latency; single point of failure if not replicated; Kong, AWS API Gateway, nginx, Envoy
- takeaways: ["API Gateway centralizes cross-cutting concerns: auth, rate limiting, logging", "BFF pattern creates per-client gateways tailored to each client's needs", "The gateway itself must be highly available — it's on the critical path of every request", "Service mesh is an alternative for east-west (service-to-service) traffic"]
- relatedTopics: patterns/rate-limiting, patterns/circuit-breaker, building-blocks/load-balancing

**Topic 7: `event-driven-architecture.mdx`** — order:7, difficulty:Intermediate, readTime: 12 min, diagram: EventDrivenDiagram
- Sections: Event-Driven vs Request-Driven | Events, Commands, Queries | Event Sourcing | CQRS | Choreography vs Orchestration | Benefits and Trade-offs
- Key points: services communicate via events, not direct calls; loose coupling; publisher doesn't know who consumes; Event Sourcing: store events (not state) as source of truth → replay to reconstruct state; CQRS: Command Query Responsibility Segregation — separate read and write models; choreography: each service reacts to events independently; orchestration: central coordinator directs workflow (Saga pattern); benefits: scalability, audit log, temporal decoupling; challenges: eventual consistency, event schema evolution, debugging complexity
- takeaways: ["Event-driven architecture decouples services — producers don't know their consumers", "Event sourcing gives you an immutable audit log and the ability to replay history", "CQRS scales read and write sides independently by separating their models", "Choose orchestration for complex workflows needing visibility; choreography for simple reactive flows"]
- relatedTopics: building-blocks/message-queues, patterns/distributed-transactions

**Topic 8: `distributed-transactions.mdx`** — order:8, difficulty:Advanced, readTime: 13 min, diagram: DistributedTransactionsDiagram
- Sections: The Problem | Two-Phase Commit (2PC) | Three-Phase Commit | Saga Pattern | Idempotency | Choosing an Approach
- Key points: ACID transactions across multiple services/DBs; 2PC: Phase 1 PREPARE (all participants lock and vote YES/NO), Phase 2 COMMIT/ABORT; 2PC blocking: coordinator crash during phase 2 leaves participants locked; 3PC: adds pre-commit phase to reduce blocking; Saga: sequence of local transactions, each publishes event; compensating transactions for rollback; choreography-based Saga (events) vs orchestration-based Saga (Saga orchestrator); idempotency: same operation can be applied multiple times safely → use idempotency keys; in practice: prefer Saga + idempotency over 2PC for microservices
- takeaways: ["Two-phase commit provides strong consistency but blocks on coordinator failure", "The Saga pattern replaces distributed transactions with local transactions + compensating actions", "Idempotency keys make retries safe — essential for any distributed system", "In microservices, Saga + eventual consistency is almost always preferred over 2PC"]
- relatedTopics: patterns/event-driven-architecture, patterns/leader-election, building-blocks/message-queues

- [ ] **Step 1: Create all 8 MDX files with full content per the specs above**
- [ ] **Step 2: Run dev server, verify all 8 pattern pages render correctly**
- [ ] **Step 3: Commit**

```bash
git add src/content/patterns/
git commit -m "feat: add all 8 Design Patterns topic pages"
```

---

### Task 12: Case Studies — Part 1 (5 topics)

**Files:** Create 5 MDX files in `src/content/case-studies/`

All case study files include extra frontmatter: `isCaseStudy: true` plus export the following from MDX body: `problemStatement`, `interviewTips`, `takeaways`.

**Case Study 1: `tinyurl.mdx`** — order:1, difficulty:Intermediate, readTime:15 min, diagram:TinyUrlDiagram
- problemStatement: "Design a URL shortening service like TinyURL. It should accept a long URL and return a short URL. Users should be able to access the original URL via the short URL."
- Sections: ## Requirements Clarification | ## Scale Estimation | ## High-Level Design | ## Database Design | ## Encoding Algorithm | ## Caching Layer | ## Redirects
- Content: functional reqs (shorten URL → short code, redirect short → long); non-functional (100M URLs/day, low latency reads, high availability); scale: 100M writes/day = 1160/s, reads 10x = 11600/s; storage: 100M × 365 × 5yr × 500bytes = ~91TB; API: POST /shorten, GET /{code} → 301/302; DB: SQL table(id, short_code, long_url, created_at, expires_at); short code: Base62 encoding of auto-increment ID (a-z A-Z 0-9 = 62 chars); 7 chars = 62^7 = 3.5 trillion URLs; cache: Redis, cache top 20% most-accessed URLs (80/20 rule); 301 permanent redirect vs 302 temporary (analytics); bloom filter to check if code exists before DB lookup
- interviewTips: ["Start with functional vs non-functional requirements", "Calculate QPS and storage before designing", "Explain Base62 encoding and why you chose 7 characters", "Mention the 301 vs 302 trade-off for analytics", "Add Redis caching — reads are 10x writes in this system"]
- takeaways: ["Base62 encoding of auto-increment IDs is a simple, collision-free approach", "Cache the most-accessed short codes — reads heavily outnumber writes", "Use 302 redirects to preserve analytics data; 301 caches at browser level", "A Bloom filter at the cache layer prevents DB lookups for non-existent codes"]

**Case Study 2: `twitter.mdx`** — order:2, difficulty:Advanced, readTime:20 min, diagram:TwitterDiagram
- problemStatement: "Design Twitter's core news feed system. Users can post tweets, follow other users, and see a feed of tweets from people they follow."
- Sections: ## Requirements | ## Scale Estimation | ## Tweet Storage | ## News Feed Generation | ## Fan-out Strategies | ## Handling Celebrities | ## Timeline Cache
- Content: scale: 300M DAU, 500M tweets/day = 5787/s writes; timeline: each user opens app 5x/day = 1.5B timeline reads/day; tweet table: (tweet_id, user_id, content, created_at, media_url); user table: (user_id, username, follower_count); fan-out on write: when user tweets → write to all followers' cached timelines (Redis sorted set by timestamp); fan-out on read: compute timeline at read time; celebrity problem (1M+ followers): fan-out on write would take too long; hybrid: regular users → fan-out on write; celebrities → fan-out on read; Redis timeline cache: user_id → sorted set of tweet_ids with timestamp scores; tweet content stored in MySQL+Cassandra; media on S3+CDN
- interviewTips: ["Define what 'tweet feed' means — latest tweets from followed accounts", "Fan-out on write vs fan-out on read is the central design decision", "Celebrities break fan-out on write — propose the hybrid approach", "Always separate the tweet storage problem from the feed generation problem", "Use Redis sorted sets for O(log n) timeline operations"]
- takeaways: ["Fan-out on write pre-computes feeds for fast reads but is expensive for high-follower accounts", "The celebrity problem requires a hybrid strategy: fan-out on write for regular users, on read for celebrities", "Redis sorted sets are the ideal data structure for a real-time ranked timeline", "Separate tweet storage (Cassandra) from media storage (S3) — different access patterns"]

**Case Study 3: `youtube.mdx`** — order:3, difficulty:Advanced, readTime:22 min, diagram:YoutubeDiagram
- problemStatement: "Design YouTube. Users should be able to upload videos, and other users should be able to stream them with minimal buffering."
- Sections: ## Requirements | ## Scale Estimation | ## Video Upload Flow | ## Video Processing Pipeline | ## Video Streaming | ## Metadata & Search | ## CDN Strategy
- Content: scale: 500hrs video uploaded/minute; 1B+ hours watched/day; upload flow: client chunks video → upload service → object storage (S3); processing pipeline: raw video → transcoding workers (FFmpeg) → multiple resolutions (360p/720p/1080p/4K) + formats (H.264/VP9) → CDN; adaptive bitrate streaming (HLS/DASH): client requests manifest, downloads chunks at quality based on bandwidth; metadata: video_id, title, description, uploader_id, view_count in MySQL; thumbnails in CDN; search: Elasticsearch for full-text; recommendation: ML pipeline (separate concern); CDN: regional edge nodes cache popular videos; long-tail content stays on origin
- interviewTips: ["Separate upload from streaming — they have completely different requirements", "Explain adaptive bitrate streaming (HLS/DASH) — interviewers love this detail", "Transcoding is CPU-intensive — use a worker queue (message queue + workers)", "Mention that 20% of videos get 80% of views — CDN economics depend on this", "Video metadata and video bytes are stored differently"]
- takeaways: ["Video upload and video streaming are separate flows with different optimizations", "Transcoding happens asynchronously via a message queue after upload", "Adaptive bitrate streaming adjusts video quality based on network conditions in real-time", "CDNs make YouTube economically viable by caching popular videos near users"]

**Case Study 4: `discord.mdx`** — order:4, difficulty:Advanced, readTime:18 min, diagram:DiscordDiagram
- problemStatement: "Design Discord's messaging system. Users can join servers, create channels, and send messages in real-time."
- Sections: ## Requirements | ## Scale Estimation | ## Message Storage | ## Real-Time Messaging | ## Presence System | ## Read State | ## Server Architecture
- Content: scale: 19M+ active servers, 4B+ messages/day; message table: (message_id, channel_id, author_id, content, timestamp) in Cassandra (write-heavy, time-series); WebSocket gateway: client connects to gateway server; message → Pub/Sub (Redis/NATS) → all gateway servers holding connections to that channel → push to clients; Cassandra: append-only writes, read by channel+time range; snowflake ID for message_id (time-sortable, distributed); presence: user online/offline status, stored in Redis with TTL; read_state table tracks last-read message per user per channel; guild architecture: Discord shards guilds across servers
- interviewTips: ["WebSockets are required — HTTP polling won't scale for real-time messages", "Cassandra is the right DB — write-heavy, time-series, horizontal scale", "Explain the pub/sub layer that connects WebSocket gateway servers", "Presence is a separate problem from messaging — address it separately", "Snowflake IDs give you time-ordered IDs without a central sequence"]
- takeaways: ["WebSockets with a pub/sub backend enable real-time messaging at Discord's scale", "Cassandra's write optimization and time-series capabilities make it ideal for chat messages", "Snowflake IDs solve distributed ID generation while preserving time ordering", "Presence and read state are separate systems from message storage — model them differently"]

**Case Study 5: `google-drive.mdx`** — order:5, difficulty:Advanced, readTime:20 min, diagram:GoogleDriveDiagram
- problemStatement: "Design Google Drive. Users should be able to upload files, sync them across devices, and share them with others."
- Sections: ## Requirements | ## Scale Estimation | ## File Upload & Chunking | ## Metadata Service | ## Sync Protocol | ## Conflict Resolution | ## Sharing & Permissions
- Content: scale: 1B+ users, 15GB free per user; file chunking: split files into 4MB blocks, each identified by SHA-256 hash → deduplicate identical blocks across users; upload: client computes block hashes → sends only changed/new blocks → delta sync; metadata DB: (file_id, user_id, name, path, version, block_list[]) in MySQL/PostgreSQL; block storage: S3 with content-addressed keys (hash → bytes); sync client: watches filesystem, detects changes, uploads delta; conflict resolution: last-write-wins or create conflict copy; sharing: access control list (file_id, user_id, role); resumable uploads for large files (chunked, client tracks which blocks are done)
- interviewTips: ["Content-addressed storage (hash-based) enables automatic deduplication", "Delta sync is the key insight — only upload changed blocks", "Metadata and block storage are separate systems with different characteristics", "Conflict resolution is unavoidable — choose a strategy and explain trade-offs", "Resumable uploads are essential for large files on unreliable connections"]
- takeaways: ["Chunking files and identifying chunks by content hash enables deduplication and delta sync", "Separate metadata (SQL) from blob storage (object store) — very different access patterns", "Delta sync uploads only changed blocks — critical for large files and slow connections", "Content-addressed storage means storing the same file twice is free at the block level"]

- [ ] **Step 1: Create all 5 case study MDX files with full content**
- [ ] **Step 2: Verify pages use CaseStudyLayout (interview prompt box + interview tips callout render correctly)**
- [ ] **Step 3: Commit**

```bash
git add src/content/case-studies/
git commit -m "feat: add Case Studies Part 1 (TinyURL, Twitter, YouTube, Discord, Google Drive)"
```

---

### Task 13: Case Studies — Part 2 (5 topics)

**Files:** Create 5 more MDX files in `src/content/case-studies/`

**Case Study 6: `web-crawler.mdx`** — order:6, difficulty:Advanced, readTime:16 min, diagram:WebCrawlerDiagram
- problemStatement: "Design a web crawler that can index the entire internet. The system should be able to crawl billions of pages and store their content for search indexing."
- Sections: ## Requirements | ## Components | ## URL Frontier | ## Politeness & Crawl Delay | ## Duplicate Detection | ## Storage | ## Scaling
- Content: functional: crawl given seed URLs, store page content, discover new links, respect robots.txt; scale: 1B pages, 10MB avg = 10PB storage; QPS: 1B pages/month = 385 pages/sec; components: URL Frontier (priority queue of URLs to crawl), Fetcher (downloads HTML), Parser (extracts links + content), Dedup Filter, Content Store; URL Frontier: priority queue — priority by PageRank/freshness, political queue respects crawl-delay; politeness: max 1 req/domain/sec; robots.txt compliance; URL normalization; duplicate URL detection: Bloom filter or URL seen set; content dedup: SimHash of content; store HTML in S3; metadata + extracted links in Cassandra; scale: distributed fetcher workers, each owns domain subset
- interviewTips: ["Politeness is a first-class concern — interviewers check if you mention robots.txt", "URL deduplication and content deduplication are different problems", "Bloom filter for URL dedup saves enormous memory vs a hash set", "The URL Frontier design (priority queue) differentiates senior-level answers", "Mention how to handle JavaScript-heavy pages (headless browser)"]
- takeaways: ["The URL Frontier is the heart of a crawler — its design determines crawl quality", "Bloom filters efficiently detect already-visited URLs with minimal memory", "Politeness controls (crawl delay, robots.txt) are non-negotiable for production crawlers", "SimHash detects near-duplicate content even if pages differ slightly"]

**Case Study 7: `notification-system.mdx`** — order:7, difficulty:Intermediate, readTime:15 min, diagram:NotificationDiagram
- problemStatement: "Design a notification system that can send push notifications, emails, and SMS to millions of users with low latency."
- Sections: ## Requirements | ## Types of Notifications | ## High-Level Architecture | ## Message Queue Design | ## Third-Party Integrations | ## Rate Limiting | ## Reliability
- Content: types: push (iOS/APNs, Android/FCM), email (SendGrid/SES), SMS (Twilio); flow: event source → Notification Service → validates + enriches → per-type queues → workers → 3rd party APIs; scale: 10M push/day, 1M email/day, 100K SMS/day; notification table: (notif_id, user_id, type, title, body, status, created_at); user preference table: user's opt-in/out per channel; rate limiting: max 10 notifications/user/day; retry with exponential backoff for failed deliveries; idempotency: deduplicate if same event fires twice; notification log for audit; workers process from queue → call 3rd party SDK → update status in DB
- interviewTips: ["Separate the notification trigger from delivery — use a queue in between", "Each delivery channel (push/email/SMS) should have its own worker pool", "User preference management is often overlooked — mention opt-outs", "Retry logic with exponential backoff is essential for 3rd-party API failures", "Idempotency prevents sending duplicate notifications on retry"]
- takeaways: ["Decouple event triggers from notification delivery with a message queue", "Each channel (push/email/SMS) scales independently with dedicated workers", "Rate limiting protects users from notification spam", "Idempotency keys prevent duplicate notifications when retrying failed deliveries"]

**Case Study 8: `search-autocomplete.mdx`** — order:8, difficulty:Intermediate, readTime:14 min, diagram:AutocompleteDiagram
- problemStatement: "Design a search autocomplete system like Google's search bar. As users type, show the top 5 most popular completions for their prefix."
- Sections: ## Requirements | ## Data Gathering Phase | ## Serving Phase | ## Trie Data Structure | ## Optimizing the Trie | ## Caching | ## Scale
- Content: gather phase: log all searches, aggregate by frequency, update trie weekly (or real-time); serving phase: prefix → Trie lookup → top-K results; Trie: each node is a character, path root→node = prefix, each node stores top-K completions with counts (pre-computed during build); Trie query: traverse to prefix node → return stored top-K = O(p) where p = prefix length; Trie storage: 26-ary tree for English; serialize to DB for persistence; caching: top prefixes cached in Redis (80% of queries are common prefixes); browser-side caching of results; partitioned Trie for scale: shard by first character; update: rebuild Trie offline, swap atomically; real-time updates: stream recent searches → update in-memory Trie
- interviewTips: ["Explain the Trie data structure clearly — draw it for the interviewer", "Pre-store top-K at each Trie node to avoid expensive traversal on every query", "Separate the data pipeline (building the Trie) from serving (querying it)", "Caching common prefixes dramatically reduces Trie load", "Discuss how to handle real-time trends vs historical frequency"]
- takeaways: ["Tries naturally model prefix search — each path from root to node is a searchable prefix", "Pre-computing top-K at each node makes serving O(prefix length) — extremely fast", "Separate the offline Trie-building pipeline from the real-time serving layer", "Cache common prefixes in Redis — a small cache handles most traffic"]

**Case Study 9: `uber.mdx`** — order:9, difficulty:Advanced, readTime:18 min, diagram:UberDiagram
- problemStatement: "Design Uber's core ride-matching system. Riders should be able to request rides and be matched with nearby available drivers in real-time."
- Sections: ## Requirements | ## Location Service | ## Matching Service | ## Trip Management | ## Real-Time Communication | ## Surge Pricing | ## Scale
- Content: driver location: driver app sends GPS every 4 seconds → Location Service → stores in geospatial index (QuadTree or S2 cells or PostGIS); rider requests ride → Matching Service queries Location Service for drivers within 5km → ranks by ETA → sends offer to top driver → driver accepts/declines → assign; QuadTree: recursively divide map into quads until each quad has ≤ threshold drivers; S2 cells (Google's approach): hierarchical cell decomposition; trip table: (trip_id, rider_id, driver_id, status, pickup, dropoff, price); real-time: WebSockets for live location updates during trip; Kafka for location update stream; surge pricing: supply/demand ratio per geo-zone → 1.5x, 2x multiplier; scale: 100M rides/day = 1157/s, millions of active drivers sending location
- interviewTips: ["Geospatial indexing is the key technical challenge — explain QuadTree or S2 cells", "Location updates are high-frequency write stream — Kafka handles this well", "The matching algorithm (nearest driver by ETA, not just distance) differentiates answers", "WebSockets are required for real-time trip tracking", "Surge pricing is a business feature — mention it shows system design awareness"]
- takeaways: ["Geospatial indexes (QuadTree, S2 cells) are essential for efficient proximity queries", "Driver location is a high-frequency write stream — treat it differently from trip data", "Matching by ETA (routing + distance) produces better outcomes than simple proximity", "WebSockets enable real-time driver location updates during a trip"]

**Case Study 10: `ticket-booking.mdx`** — order:10, difficulty:Intermediate, readTime:15 min, diagram:TicketBookingDiagram
- problemStatement: "Design a ticket booking system like Ticketmaster. Users should be able to browse events, select seats, and purchase tickets — with no double-booking."
- Sections: ## Requirements | ## Scale Estimation | ## Seat Reservation | ## Race Condition Prevention | ## Payment Flow | ## Database Design | ## Handling High-Demand Events
- Content: functional: browse events, view seat map, reserve seat, pay, get confirmation; scale: 1M events, 100K seats/event, flash sales: 100K concurrent users for one event; seat reservation: temporary hold (10 min TTL) while user pays; race condition: two users pick same seat simultaneously; prevent with: DB row-level locking (SELECT FOR UPDATE) or Redis SETNX (atomic set-if-not-exists) as distributed lock; payment: integrate Stripe/payment gateway, idempotent; DB: events(id, name, venue, date), seats(id, event_id, row, number, status), bookings(id, seat_id, user_id, status, payment_id); queue: virtual waiting room for flash sales (Kafka queue → issue tickets sequentially); optimistic vs pessimistic locking trade-off
- interviewTips: ["Double-booking prevention is the central technical challenge — spend time here", "Redis SETNX (atomic) is better than DB locking for high concurrency", "A virtual waiting room prevents server overload during flash sales", "Payment must be idempotent — retrying a payment shouldn't double-charge", "TTL on seat holds prevents abandoned holds blocking inventory indefinitely"]
- takeaways: ["Atomic operations (Redis SETNX) prevent race conditions more efficiently than DB locks at scale", "Seat holds with TTL balance user experience (time to pay) with inventory availability", "A virtual waiting room serializes demand during flash sales without overloading the system", "Idempotent payment processing is non-negotiable — network failures happen"]

- [ ] **Step 1: Create all 5 case study MDX files with full content**
- [ ] **Step 2: Run dev server, verify all 5 pages**
- [ ] **Step 3: Commit**

```bash
git add src/content/case-studies/
git commit -m "feat: add Case Studies Part 2 (Web Crawler, Notification, Autocomplete, Uber, Ticket Booking)"
```

---

### Task 14: Interview Prep section — 4 topic pages

**Files:** Create 4 MDX files in `src/content/interview-prep/`

**Topic 1: `how-to-approach.mdx`** — order:1, difficulty:Beginner, readTime:10 min, diagram:InterviewApproachDiagram
- Sections: ## The Framework | ## Step 1: Clarify Requirements (5 min) | ## Step 2: Estimate Scale (5 min) | ## Step 3: High-Level Design (15 min) | ## Step 4: Deep Dive (15 min) | ## Step 5: Identify Bottlenecks & Trade-offs (5 min) | ## Common Mistakes
- Content: 45-60 min interview; 5-step framework; Step 1: ask functional reqs (what must it do?), non-functional reqs (scale, latency, consistency requirements?), constraints; Step 2: DAU, QPS, storage, bandwidth — rough order-of-magnitude is enough; Step 3: draw boxes and arrows, data flow, major components; Step 4: interviewer picks component to deep-dive — be ready on DB choice, caching strategy, API design; Step 5: identify single points of failure, bottlenecks, what happens at 10x scale; don't jump to solution; communicate constantly; ask before assuming; write on the whiteboard (or screen)
- takeaways: ["Never jump to the solution before clarifying requirements", "Back of envelope estimation shows you can reason about scale", "High-level first, details second — interviewers guide the deep-dive", "Communicate your thought process out loud — silence is your enemy"]

**Topic 2: `capacity-estimation.mdx`** — order:2, difficulty:Intermediate, readTime:8 min, diagram:CapacityDiagram
- Sections: ## Why Estimate | ## Powers of Two Cheat Sheet | ## Traffic Estimation | ## Storage Estimation | ## Bandwidth Estimation | ## Example: Design Twitter
- Content: rough estimates, not precision; powers of 2: 2^10=1K, 2^20=1M, 2^30=1B; memory units: 1 char=1 byte, 1 int=4 bytes, UUID=16 bytes, timestamp=8 bytes; QPS = DAU × actions/day ÷ 86400; peak QPS = 2x average; storage = QPS × request_size × seconds × retention; bandwidth = QPS × response_size; worked example: Twitter — 300M DAU, 1% post per day = 3M tweets/day = 34/s write QPS, 10:1 read ratio = 340/s read QPS; tweet storage: 34 × 300 bytes × 86400 × 365 = ~320GB/day; media: 10% tweets have media, 1MB avg = 3.4GB/day media storage
- takeaways: ["QPS = Daily Active Users × actions per day ÷ 86400 seconds", "Always calculate peak QPS (2x average) for capacity planning", "Work in powers of 10 — you don't need exact numbers, just the right order of magnitude", "Doing capacity estimation signals seniority — interviewers notice when you skip it"]

**Topic 3: `trade-offs.mdx`** — order:3, difficulty:Intermediate, readTime:9 min, diagram:TradeOffsDiagram
- Sections: ## Why Trade-offs Matter | ## Consistency vs Availability (CAP) | ## Latency vs Consistency | ## SQL vs NoSQL | ## Monolith vs Microservices | ## How to Frame Trade-offs in an Interview
- Content: every design decision is a trade-off; CAP theorem: distributed system can guarantee at most 2 of 3 — CA (traditional SQL), CP (HBase, ZooKeeper), AP (Cassandra, DynamoDB); latency vs consistency: synchronous replication = consistent + higher latency; async = low latency + eventual consistency; SQL vs NoSQL: SQL = ACID, schema, complex queries, vertical scale; NoSQL = scale, flexibility, simple access patterns, eventual consistency; monolith vs microservices: monolith = simple deploy, harder to scale; microservices = independent deploy/scale, operational complexity; frame trade-offs with "I would choose X because Y, with the trade-off that Z" — never just assert a choice without explaining the alternative
- takeaways: ["Every system design decision involves a trade-off — name it explicitly", "CAP theorem: you cannot have perfect Consistency, Availability, and Partition tolerance simultaneously", "Frame choices as 'I choose X for Y reasons, accepting the trade-off of Z'", "Interviewers value engineers who understand trade-offs over those who memorize 'right answers'"]

**Topic 4: `common-mistakes.mdx`** — order:4, difficulty:Beginner, readTime:7 min, diagram:MistakesDiagram
- Sections: ## Mistake 1: Jumping to Solution | ## Mistake 2: Skipping Scale Estimation | ## Mistake 3: Ignoring Failure Modes | ## Mistake 4: Not Discussing Trade-offs | ## Mistake 5: Silence | ## Mistake 6: Over-Engineering
- Content: Mistake 1: designing before understanding requirements — always clarify first; Mistake 2: no estimation means you might design for wrong scale; Mistake 3: every component can fail — what happens when the DB goes down? Cache is cold? Network partitions?; Mistake 4: asserting choices without acknowledging alternatives signals limited depth; Mistake 5: thinking silently is invisible to the interviewer — narrate your thoughts; Mistake 6: adding Kubernetes, ML, blockchain etc. when not needed — YAGNI applies to system design too; bonus tips: practice drawing quickly, have 3-5 systems deep in your head, study real engineering blogs (Uber, Discord, Netflix tech blogs)
- takeaways: ["Clarify requirements first — always. Design for what's asked, not what's interesting", "Silence in an interview is your biggest enemy — think out loud", "Every system fails — show you've thought about failure modes", "Over-engineering wastes time and signals inexperience with real-world constraints"]

- [ ] **Step 1: Create all 4 MDX files with full content**
- [ ] **Step 2: Run dev server, verify all 4 pages**
- [ ] **Step 3: Commit**

```bash
git add src/content/interview-prep/
git commit -m "feat: add all 4 Interview Prep pages"
```

---

### Task 15: Mobile responsiveness, accessibility, and polish

**Files:** Modify `src/layouts/BaseLayout.astro`, `src/components/Sidebar.astro`, `src/styles/global.css`

- [ ] **Step 1: Add skip-to-content link for keyboard accessibility**

In `BaseLayout.astro`, add before `<Sidebar />`:
```astro
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
  Skip to content
</a>
```

- [ ] **Step 2: Ensure all interactive elements have focus styles**

Add to `global.css`:
```css
@layer base {
  :focus-visible {
    outline: 2px solid #4F46E5;
    outline-offset: 2px;
  }
}
```

- [ ] **Step 3: Add ARIA labels to sidebar toggle and section buttons**

In `Sidebar.astro`, verify: sidebar toggle has `aria-label="Toggle sidebar"`, section toggles have `aria-expanded` set correctly (already included in Task 6 code — verify they're in place).

- [ ] **Step 4: Test mobile layout at 375px viewport**

In browser devtools, set width to 375px. Verify:
- Sidebar is hidden (off-screen)
- Hamburger button is visible top-left
- Tapping hamburger opens sidebar overlay
- Content is readable with no horizontal scroll
- Font sizes are comfortable

- [ ] **Step 5: Add Open Graph meta tags to BaseLayout.astro**

Inside `<head>`:
```astro
<meta property="og:title" content={`${title} | System Design 101`} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
```

- [ ] **Step 6: Create a favicon**

Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#4F46E5"/>
  <text x="50" y="68" text-anchor="middle" font-size="52" font-family="system-ui" font-weight="bold" fill="white">SD</text>
</svg>
```

- [ ] **Step 7: Run final build and check for errors**

```bash
npm run build
```

Expected: Zero errors. All 38 topics generate pages. `dist/` is populated.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: mobile responsiveness, accessibility, SEO meta tags, and favicon"
```

---

### Task 16: Push to GitHub and enable GitHub Pages

- [ ] **Step 1: Create GitHub repository**

```bash
gh repo create system_design_101 --public --description "A free, comprehensive system design course for software engineers"
```

- [ ] **Step 2: Push to GitHub**

```bash
git remote add origin https://github.com/wadekarg/system_design_101.git
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Enable GitHub Pages with GitHub Actions source**

```bash
gh api repos/wadekarg/system_design_101/pages \
  --method POST \
  -f build_type=workflow
```

Or: Go to GitHub repo → Settings → Pages → Source: GitHub Actions.

- [ ] **Step 4: Watch the Actions run**

```bash
gh run watch
```

Expected: Build job succeeds, Deploy job succeeds.

- [ ] **Step 5: Verify live site**

Open `https://wadekarg.github.io/system_design_101` in browser. Verify:
- Homepage loads with section cards
- Sidebar shows all 38 topics
- Navigate to a few topics — content renders, diagrams animate
- Progress tracking works (complete a topic, revisit — checkmark persists)
- Mobile layout works on phone

---

## Self-Review

**Spec coverage check:**
- ✅ 38 topics across 5 sections
- ✅ Animated SVG diagrams for every topic
- ✅ Case study pages with interview prompt + interview tips
- ✅ Progress tracking via localStorage
- ✅ Sidebar with section collapse and completion checkmarks
- ✅ Homepage with roadmap cards and overall progress bar
- ✅ Warm light theme (#FAFAF8 background, #4F46E5 accent)
- ✅ Inter + JetBrains Mono fonts
- ✅ GitHub Actions auto-deploy
- ✅ Mobile responsive (hamburger sidebar)
- ✅ Accessibility (skip link, focus styles, ARIA attributes)
- ✅ `prefers-reduced-motion` respected in all SVG animations
- ✅ Key Takeaways on every page
- ✅ Related Topics links
- ✅ Prev/Next navigation
- ✅ No dark mode (spec constraint met)

**Placeholder scan:** No TBDs or "implement later" — every task has actual content specs or code.

**Type consistency:** `takeaways: string[]`, `interviewTips: string[]`, `problemStatement: string` used consistently across CaseStudyLayout props and MDX exports.
