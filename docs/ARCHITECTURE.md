# Good Vibes Gallery - Architecture Documentation

## System Overview

Good Vibes Gallery is a statically generated website that showcases community-submitted websites. The system uses Bun as the runtime and build tool, SQLite for data storage, and GitHub Actions for automation.

```
┌─────────────────┐
│  GitHub Issues  │ (User Submission)
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  GitHub Actions         │
│  - Validate Submission  │
│  - Capture Screenshot   │
│  - Update Database      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│  SQLite DB      │ (Content Store)
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Bun Build Process      │
│  - Read from DB         │
│  - Generate HTML        │
│  - Bundle Assets        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Pages   │ (Static Hosting)
└─────────────────┘
```

## Core Components

### 1. Database Layer (`src/db/`)

**Technology**: Bun SQLite (bun:sqlite)

**Schema**:

```typescript
// src/db/schema.ts
export interface Website {
  id: number;
  url: string;
  title: string;
  description: string;
  screenshot_url: string;
  submitter_github: string;
  submission_date: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface WebsiteTag {
  website_id: number;
  tag_id: number;
}
```

**Key Functions**:

```typescript
// src/db/queries.ts
export async function getAllWebsites(options?: {
  status?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}): Promise<Website[]>

export async function addWebsite(data: Omit<Website, 'id'>): Promise<number>

export async function updateWebsite(id: number, data: Partial<Website>): Promise<void>

export async function searchWebsites(query: string): Promise<Website[]>

export async function getWebsitesByTag(tagName: string): Promise<Website[]>

export async function addTag(name: string): Promise<number>

export async function linkWebsiteTag(websiteId: number, tagId: number): Promise<void>
```

**Database Initialization**:

```typescript
import { Database } from "bun:sqlite";

const db = new Database("data/gallery.db", { create: true });

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    screenshot_url TEXT,
    submitter_github TEXT NOT NULL,
    submission_date TEXT NOT NULL,
    status TEXT DEFAULT 'approved',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_status ON websites(status);
  CREATE INDEX IF NOT EXISTS idx_submission_date ON websites(submission_date DESC);

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS website_tags (
    website_id INTEGER,
    tag_id INTEGER,
    FOREIGN KEY (website_id) REFERENCES websites(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (website_id, tag_id)
  );

  CREATE INDEX IF NOT EXISTS idx_website_tags_website ON website_tags(website_id);
  CREATE INDEX IF NOT EXISTS idx_website_tags_tag ON website_tags(tag_id);
`);
```

### 2. Build System (`src/build/`)

**Static Site Generator**:

```typescript
// src/build/generate.ts
import { Database } from "bun:sqlite";
import { getAllWebsites } from "../db/queries";
import { renderGalleryPage } from "./templates/gallery";
import { renderIndexPage } from "./templates/index";

export async function buildSite() {
  console.log("🏗️  Building site...");
  
  // 1. Fetch all approved websites
  const websites = await getAllWebsites({ status: 'approved' });
  
  // 2. Generate index page
  const indexHtml = renderIndexPage(websites);
  await Bun.write("dist/index.html", indexHtml);
  
  // 3. Generate gallery page (if separate)
  const galleryHtml = renderGalleryPage(websites);
  await Bun.write("dist/gallery.html", galleryHtml);
  
  // 4. Copy static assets
  await copyAssets();
  
  // 5. Generate sitemap
  await generateSitemap(websites);
  
  console.log("✅ Build complete!");
}

async function copyAssets() {
  // Copy CSS
  await Bun.write("dist/css/styles.css", await Bun.file("public/css/styles.css").text());
  
  // Copy JS
  await Bun.write("dist/js/main.js", await Bun.file("public/js/main.js").text());
  
  // Copy images
  // Implementation for recursive copy
}

async function generateSitemap(websites: Website[]) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.github.io/good-vibes-gallery/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  ${websites.map(w => `
  <url>
    <loc>https://yourdomain.github.io/good-vibes-gallery/#${w.id}</loc>
    <lastmod>${w.updated_at}</lastmod>
  </url>
  `).join('')}
</urlset>`;
  
  await Bun.write("dist/sitemap.xml", sitemap);
}
```

**Template System**:

```typescript
// src/build/templates/gallery.ts
import type { Website } from '../../db/schema';

export function renderGalleryPage(websites: Website[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Good Vibes Gallery</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <header>
    <h1>Good Vibes Gallery</h1>
    <nav>
      <input type="search" id="search" placeholder="Search websites...">
      <div id="filter-tags"></div>
    </nav>
  </header>
  
  <main>
    <div class="gallery-grid">
      ${websites.map(renderWebsiteCard).join('')}
    </div>
  </main>
  
  <footer>
    <p>Submit your website via <a href="https://github.com/yourusername/good-vibes-gallery/issues/new?template=submit-website.yml">GitHub Issue</a></p>
  </footer>
  
  <script src="/js/main.js" type="module"></script>
</body>
</html>`;
}

function renderWebsiteCard(website: Website): string {
  return `
  <article class="website-card" data-id="${website.id}">
    <div class="card-image">
      <img src="${website.screenshot_url}" alt="${website.title}" loading="lazy">
    </div>
    <div class="card-content">
      <h2>${website.title}</h2>
      <p>${website.description}</p>
      <div class="card-meta">
        <span class="submitter">by @${website.submitter_github}</span>
        <time datetime="${website.submission_date}">${formatDate(website.submission_date)}</time>
      </div>
      <a href="${website.url}" target="_blank" rel="noopener noreferrer" class="visit-link">
        Visit Website →
      </a>
    </div>
  </article>`;
}
```

### 3. Submission Processing (`scripts/`)

**Issue Parser**:

```typescript
// scripts/process-submission.ts
import { Database } from "bun:sqlite";
import { addWebsite, getAllWebsites } from "../src/db/queries";

export interface SubmissionData {
  url: string;
  title: string;
  description: string;
  tags: string[];
  submitter: string;
}

export async function processIssue(issueBody: string, submitter: string): Promise<void> {
  // 1. Parse issue body
  const data = parseIssueBody(issueBody);
  
  // 2. Validate submission
  const errors = await validateSubmission(data);
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  // 3. Capture screenshot
  const screenshotUrl = await captureScreenshot(data.url);
  
  // 4. Add to database
  await addWebsite({
    url: data.url,
    title: data.title,
    description: data.description,
    screenshot_url: screenshotUrl,
    submitter_github: submitter,
    submission_date: new Date().toISOString(),
    status: 'approved', // Auto-approve or set to 'pending'
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  // 5. Link tags
  for (const tag of data.tags) {
    // Implementation for linking tags
  }
}

function parseIssueBody(body: string): SubmissionData {
  // Parse YAML front matter or form fields
  const urlMatch = body.match(/### Website URL\s*\n\s*(.+)/);
  const titleMatch = body.match(/### Title\s*\n\s*(.+)/);
  const descMatch = body.match(/### Description\s*\n\s*(.+)/);
  const tagsMatch = body.match(/### Tags\s*\n\s*(.+)/);
  
  return {
    url: urlMatch?.[1]?.trim() || '',
    title: titleMatch?.[1]?.trim() || '',
    description: descMatch?.[1]?.trim() || '',
    tags: tagsMatch?.[1]?.split(',').map(t => t.trim()) || [],
    submitter: ''
  };
}

async function validateSubmission(data: SubmissionData): Promise<string[]> {
  const errors: string[] = [];
  
  // URL validation
  try {
    new URL(data.url);
  } catch {
    errors.push('Invalid URL format');
  }
  
  // Check for duplicates
  const existing = await getAllWebsites();
  if (existing.some(w => w.url === data.url)) {
    errors.push('URL already exists in gallery');
  }
  
  // Required fields
  if (!data.title) errors.push('Title is required');
  if (!data.description) errors.push('Description is required');
  
  // Length checks
  if (data.title.length > 100) errors.push('Title too long (max 100 chars)');
  if (data.description.length > 500) errors.push('Description too long (max 500 chars)');
  
  return errors;
}
```

**Screenshot Capture**:

```typescript
// src/api/screenshot.ts
export async function captureScreenshot(url: string): Promise<string> {
  // Option 1: Use external API
  const apiKey = process.env.SCREENSHOT_API_KEY;
  const response = await fetch(
    `https://api.screenshotapi.net/screenshot?url=${encodeURIComponent(url)}&token=${apiKey}`
  );
  
  const buffer = await response.arrayBuffer();
  const filename = `screenshot-${Date.now()}.jpg`;
  const path = `public/images/screenshots/${filename}`;
  
  await Bun.write(path, buffer);
  
  return `/images/screenshots/${filename}`;
}

// Option 2: Use Playwright (would require adding to dependencies)
// import { chromium } from 'playwright';
// 
// export async function captureScreenshot(url: string): Promise<string> {
//   const browser = await chromium.launch();
//   const page = await browser.newPage();
//   await page.goto(url);
//   
//   const filename = `screenshot-${Date.now()}.jpg`;
//   await page.screenshot({ path: `public/images/screenshots/${filename}` });
//   
//   await browser.close();
//   return `/images/screenshots/${filename}`;
// }
```

### 4. GitHub Actions Workflows

**Build & Deploy Workflow**:

```yaml
# .github/workflows/build-deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  issues:
    types: [opened, labeled]
  workflow_dispatch:

permissions:
  contents: write
  issues: write
  pages: write
  id-token: write

jobs:
  process-submission:
    if: github.event_name == 'issues' && contains(github.event.issue.labels.*.name, 'website-submission')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Process submission
        env:
          ISSUE_BODY: ${{ github.event.issue.body }}
          SUBMITTER: ${{ github.event.issue.user.login }}
        run: bun run scripts/process-submission.ts
      
      - name: Commit database changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add data/gallery.db
          git commit -m "Add website submission from issue #${{ github.event.issue.number }}"
          git push
      
      - name: Comment on issue
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ Your submission has been processed and will appear on the site shortly!'
            })

  build:
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Build site
        run: bun run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Issue Template**:

```yaml
# .github/ISSUE_TEMPLATE/submit-website.yml
name: Submit Website
description: Submit a website to Good Vibes Gallery
title: "[Submission] "
labels: ["website-submission"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for submitting your website! Please fill out the form below.
  
  - type: input
    id: url
    attributes:
      label: Website URL
      description: The full URL of your website
      placeholder: https://example.com
    validations:
      required: true
  
  - type: input
    id: title
    attributes:
      label: Title
      description: A short, descriptive title for your website
      placeholder: My Awesome Portfolio
    validations:
      required: true
  
  - type: textarea
    id: description
    attributes:
      label: Description
      description: Describe your website (max 500 characters)
      placeholder: A modern portfolio showcasing my web development projects...
    validations:
      required: true
  
  - type: input
    id: tags
    attributes:
      label: Tags
      description: Comma-separated tags (e.g., portfolio, blog, ecommerce)
      placeholder: portfolio, react, design
    validations:
      required: true
  
  - type: input
    id: screenshot
    attributes:
      label: Screenshot URL (Optional)
      description: URL to a screenshot of your site. If not provided, we'll capture one automatically.
      placeholder: https://example.com/screenshot.jpg
    validations:
      required: false
  
  - type: checkboxes
    id: terms
    attributes:
      label: Submission Guidelines
      description: By submitting, you agree to the following
      options:
        - label: I own this website or have permission to submit it
          required: true
        - label: The website contains appropriate content
          required: true
        - label: The website is fully functional and accessible
          required: true
```

## Frontend Architecture

### CSS Organization (Using Cascade Layers)

```css
/* public/css/styles.css */
@layer reset, tokens, layout, components, utilities;

@layer reset {
  /* Modern CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}

@layer tokens {
  :root {
    /* Colors using light-dark() */
    --color-bg: light-dark(#ffffff, #1a1a1a);
    --color-text: light-dark(#1a1a1a, #ffffff);
    --color-primary: light-dark(#0066cc, #3399ff);
    
    /* Spacing */
    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 2rem;
    --space-xl: 3rem;
    
    /* Typography */
    --font-base: system-ui, sans-serif;
    --font-mono: 'SF Mono', Monaco, monospace;
  }
}

@layer layout {
  .gallery-grid {
    container-type: inline-size;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: var(--space-md);
  }
  
  @container (min-width: 600px) {
    .gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
    }
  }
}

@layer components {
  .website-card {
    container-type: inline-size;
    background: var(--color-bg);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
  }
  
  .website-card:has(:hover) {
    transform: translateY(-4px);
  }
}
```

### JavaScript Architecture (Module-based)

```javascript
// public/js/main.js
import { initSearch } from './search.js';
import { initFilter } from './filter.js';
import { initViewTransitions } from './transitions.js';

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initFilter();
  initViewTransitions();
});

// public/js/search.js
export function initSearch() {
  const searchInput = document.getElementById('search');
  const cards = document.querySelectorAll('.website-card');
  
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    cards.forEach(card => {
      const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
      const matches = title.includes(query) || desc.includes(query);
      
      card.style.display = matches ? '' : 'none';
    });
  });
}
```

## Data Flow

### Submission to Display Flow

1. **User creates GitHub Issue** with website details
2. **GitHub Actions triggered** on issue creation with `website-submission` label
3. **Validation script runs** to check URL, duplicate, required fields
4. **Screenshot captured** either via API or Playwright
5. **Database updated** with new website entry
6. **Database committed** to repository
7. **Build triggered** on database commit
8. **Static site generated** reading from updated database
9. **Deployed to GitHub Pages** automatically

### Build Process Flow

1. **Read SQLite database** with all approved websites
2. **Generate HTML** using template functions
3. **Process CSS** (copy or bundle)
4. **Process JavaScript** (copy or bundle)
5. **Copy assets** (images, fonts, etc.)
6. **Generate meta files** (sitemap, robots.txt)
7. **Output to `/dist` directory**
8. **Deploy `/dist` to gh-pages branch**

## Security Considerations

1. **Input Validation**: All user-submitted data is validated and sanitized
2. **URL Verification**: URLs are checked for valid format and protocol
3. **XSS Prevention**: All content is properly escaped in templates
4. **Rate Limiting**: GitHub's built-in rate limiting on issue creation
5. **Content Moderation**: Manual review option via issue labels
6. **Dependency Security**: Regular updates via Dependabot

## Performance Targets

- **Time to First Byte**: < 200ms
- **First Contentful Paint**: < 1s
- **Largest Contentful Paint**: < 2.5s
- **Total Blocking Time**: < 200ms
- **Cumulative Layout Shift**: < 0.1
- **Lighthouse Score**: > 90 (all categories)

## Scalability Considerations

- **Database Size**: SQLite can handle millions of rows, sufficient for this use case
- **Build Time**: Static generation scales linearly with number of websites
- **GitHub Pages**: 1GB size limit, 100GB bandwidth/month (soft limit)
- **Optimization**: Implement pagination if gallery exceeds 1000 websites
