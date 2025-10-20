# Good Vibes Gallery - Project Plan

## Project Overview

A modern static website gallery that showcases community-submitted websites. Built with Bun, featuring automated submission workflow via GitHub Issues and deployed to GitHub Pages.

## Core Features

### 1. Website Gallery
- Grid-based responsive layout showcasing submitted websites
- Each entry displays:
  - Website screenshot/thumbnail
  - Title and description
  - Tags/categories
  - Submission date
  - Link to live site
  - Submitter information (GitHub username)
- Search and filter capabilities
- Sorting options (newest, popular, alphabetical)

### 2. Submission System
- GitHub Issue-based submission workflow
- Issue template with required fields:
  - Website URL
  - Title
  - Description
  - Category/tags
  - Screenshot URL (optional)
- Automated validation and processing
- Anti-spam measures

### 3. Build Pipeline
- GitHub Actions workflow triggered on issue creation
- Automated validation of submissions
- Screenshot capture service (optional)
- Database update
- Static site regeneration
- Deployment to GitHub Pages

## Technical Stack

### Runtime & Build
- **Bun**: Runtime, bundler, and SQLite database
- **Bun SQLite**: Native SQLite integration for content management
- **Static Site Generation**: Pre-rendered HTML pages

### Frontend
- **Vanilla JavaScript**: Lightweight client-side interactions
- **CSS Baseline 2024+**: Modern CSS features
  - Container queries
  - Cascade layers
  - :has() selector
  - Subgrid
  - Color-mix()
  - Light-dark() function
  - View transitions API

### Deployment & CI/CD
- **GitHub Pages**: Static hosting
- **GitHub Actions**: Automated build and deployment
- **GitHub Issues**: Submission interface

## Architecture

### Database Schema

```sql
-- websites table
CREATE TABLE websites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  screenshot_url TEXT,
  submitter_github TEXT NOT NULL,
  submission_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- tags table
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- website_tags junction table
CREATE TABLE website_tags (
  website_id INTEGER,
  tag_id INTEGER,
  FOREIGN KEY (website_id) REFERENCES websites(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id),
  PRIMARY KEY (website_id, tag_id)
);

-- metadata table for stats
CREATE TABLE metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Build Process

1. **Trigger**: GitHub Issue created with label `website-submission`
2. **Validation**: 
   - Parse issue body
   - Validate URL format
   - Check for duplicates
   - Verify all required fields
3. **Processing**:
   - Insert into SQLite database
   - Capture screenshot (if not provided)
   - Generate optimized images
4. **Build**:
   - Read from SQLite database
   - Generate static HTML pages
   - Bundle CSS and JS
   - Optimize assets
5. **Deploy**: Push to gh-pages branch

## Project Structure

```
windsurf-project/
├── src/
│   ├── db/
│   │   ├── schema.ts          # Database schema definitions
│   │   ├── queries.ts         # Database queries
│   │   └── seed.ts            # Initial data seeding
│   ├── build/
│   │   ├── generate.ts        # Static site generator
│   │   ├── templates/         # HTML templates
│   │   └── utils.ts           # Build utilities
│   ├── api/
│   │   ├── validate.ts        # Submission validation
│   │   └── screenshot.ts      # Screenshot capture
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
│   ├── css/
│   │   ├── base.css           # CSS reset & baseline
│   │   ├── layout.css         # Layout system
│   │   ├── components.css     # Component styles
│   │   └── utilities.css      # Utility classes
│   ├── js/
│   │   ├── main.js           # Core functionality
│   │   ├── filter.js         # Filter & search
│   │   └── animations.js     # View transitions
│   └── images/
│       └── placeholders/
├── .github/
│   ├── workflows/
│   │   ├── build-deploy.yml  # Main build workflow
│   │   └── validate.yml      # Validation workflow
│   └── ISSUE_TEMPLATE/
│       └── submit-website.yml # Submission template
├── scripts/
│   ├── process-submission.ts  # Issue processor
│   └── deploy.ts             # Deployment script
├── data/
│   └── gallery.db            # SQLite database (gitignored)
├── dist/                     # Build output (gitignored)
├── bunfig.toml              # Bun configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Development Phases

### Phase 1: Foundation (Week 1)
- [ ] Project setup and configuration
- [ ] Database schema implementation
- [ ] Basic HTML templates
- [ ] CSS baseline system setup

### Phase 2: Core Features (Week 2)
- [ ] Static site generator
- [ ] Gallery display logic
- [ ] Search and filter functionality
- [ ] Responsive design implementation

### Phase 3: Automation (Week 3)
- [ ] GitHub Issue template
- [ ] GitHub Actions workflow
- [ ] Submission validation
- [ ] Screenshot capture integration

### Phase 4: Polish & Deploy (Week 4)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Documentation
- [ ] Initial deployment

## Key Considerations

### Performance
- Lazy loading for images
- Code splitting for JS
- CSS containment
- Efficient database queries
- Static generation for speed

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance
- Screen reader testing

### Security
- URL validation
- XSS prevention
- Rate limiting on submissions
- Content moderation workflow

### SEO
- Semantic HTML structure
- Meta tags for each page
- Open Graph tags
- Sitemap generation
- Robots.txt

## Success Metrics

- Page load time < 2s
- Lighthouse score > 90
- Mobile-friendly
- 100% accessibility compliance
- Zero security vulnerabilities
- Automated deployment success rate > 95%
