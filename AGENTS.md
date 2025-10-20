# Good Vibes Gallery

The _Good Vibes_ Gallery is a website which showcases community submitted websites. Users submit websites via GitHub Issues, which triggers automated processing through GitHub Actions. The site is built with Bun and deployed to GitHub Pages.

This project uses the latest HTML, CSS, and ECMAScript Baseline web platform features.

## Project Architecture

- **Runtime**: Bun (runtime, bundler, SQLite database)
- **Database**: SQLite for content management (bun:sqlite)
- **Frontend**: Vanilla JavaScript + Modern CSS (no framework)
- **Build**: Static site generation from database
- **Deployment**: GitHub Pages via GitHub Actions
- **Submission**: GitHub Issues with automated workflow

## Dev Environment

### Setup

- Utilize MCP servers and web search for referencing documentation and code examples
- Use Bun for development and production builds
- Run `bun install` to install dependencies
- Run `bun run db:init` to initialize the SQLite database
- Run `bun run db:seed` to populate with sample data (optional)

### Development

- Run `bun run dev` to start development mode with watch
- Run `bun run build` to generate static site in `dist/`
- Database is stored in `data/gallery.db` (gitignored)

### Production

- Run `bun run build` to build the production version
- Static files output to `dist/` directory
- Deployed automatically via GitHub Actions on push to main

### Code Quality

- Always format changes using `bunx prettier --write [file]`
- Follow TypeScript strict mode conventions
- Use CSS cascade layers for organization

## Project Structure

```
src/
├── db/              # Database schema, queries, and initialization
├── build/           # Static site generator and templates
└── types/           # TypeScript type definitions

scripts/             # Automation scripts (submission processing)
public/              # Static assets (CSS, JS, images)
.github/             # GitHub Actions workflows and issue templates
dist/                # Build output (generated, not committed)
data/                # SQLite database (gitignored)
```

## Key Scripts

- `bun run dev` - Development mode with watch
- `bun run build` - Build static site
- `bun run db:init` - Initialize database
- `bun run db:seed` - Seed with sample data
- `bun run clean` - Clean build artifacts
- `bun run process-submission` - Process GitHub Issue submission

## CSS Guidelines

Use CSS Baseline 2024+ features:

- `@layer` for cascade organization (reset, tokens, layout, components, utilities)
- Container queries for responsive components
- `:has()` for parent selection
- `color-mix()` or relative color syntax `color(from <color>, <color>)` for color variations
- `light-dark()` for automatic dark mode
- `subgrid` for nested grid layouts
- View Transitions API for smooth navigation

## Documentation

- **PROJECT_SUMMARY.md** - Quick reference and navigation
- **GETTING_STARTED.md** - Step-by-step development guide
- **ARCHITECTURE.md** - Technical design and code examples
- **PROJECT_PLAN.md** - Features, tech stack, and roadmap
- **TODO.md** - Actionable task breakdown
- **ROADMAP.md** - Visual timeline and milestones

## Development Workflow

1. **Database Layer** - Implement schema, queries, and seed data
2. **Build System** - Create static site generator and templates
3. **Styling** - Use modern CSS with cascade layers
4. **Automation** - Set up GitHub Actions for submissions
5. **Testing** - Performance, accessibility, and functionality
6. **Deploy** - Push to GitHub Pages
