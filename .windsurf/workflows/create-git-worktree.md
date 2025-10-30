---
trigger: user_request
description: Workflow for creating and developing features on a new git worktree directory
---

# Feature Development on Git Worktree

## Overview

This workflow guides you through creating and developing a feature on a new git worktree directory. Worktrees allow you to work on multiple branches simultaneously without switching contexts in a single repository directory.

## Prerequisites

- Git 2.5+ (worktree support)
- Bun runtime installed
- Good Vibes Gallery repository cloned
- Main branch up-to-date: `git fetch origin && git checkout main && git pull origin main`

## Workflow Steps

### 1. Create a New Worktree

```bash
# Create a new worktree for your feature
# Replace 'feature-name' with your actual feature branch name
git worktree add ../good-vibes-gallery-feature-name feature-name

# Navigate to the new worktree directory
cd ../good-vibes-gallery-feature-name
```

**Why**: Worktrees isolate your work, allowing you to keep the main directory clean and switch between features without stashing/popping changes.

### 2. Verify Worktree Setup

```bash
# Confirm you're on the correct branch
git branch

# List all worktrees
git worktree list
```

### 3. Install Dependencies

```bash
# Install project dependencies
bun install
```

**Note**: Each worktree has its own `node_modules/` and build artifacts, so this step is necessary for each worktree.

### 4. Start Development Server

```bash
# Start Astro dev server with hot module reloading
bun run dev

# Dev server runs at http://localhost:4321
```

### 5. Develop Your Feature

#### Code Changes

- Make changes to files in `src/` directory
- Follow project code style guidelines (see `.windsurf/rules/`)
- Use TypeScript with strict mode
- Format code: `bunx prettier --write [file]`

#### File Organization

```
src/
├── pages/           # Add new routes here
├── components/      # Add new components
├── layouts/         # Modify layouts if needed
├── db/              # Database queries/schema changes
├── styles/          # Global CSS changes
└── types/           # TypeScript type definitions
```

#### Testing Changes

- Dev server auto-reloads on file changes
- Test in browser at `http://localhost:4321`
- Run type checking: `bun run astro check`
- Build for production: `bun run build`
- Preview production build: `bun run preview`

### 6. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add feature description"

# Follow conventional commits:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting/style changes
# refactor: code refactoring
# test: test additions/changes
# chore: build/dependency changes
```

### 7. Push to Remote

```bash
# Push feature branch to remote
git push origin feature-name

# Set upstream if first push
git push -u origin feature-name
```

### 8. Create Pull Request

- Go to GitHub repository
- Create PR from `feature-name` → `main`
- Add descriptive title and description
- Link related issues
- Request reviewers
- Ensure CI/CD checks pass

### 9. Code Review & Iteration

```bash
# Make requested changes
# Commit and push
git add .
git commit -m "fix: address review feedback"
git push origin feature-name

# PR automatically updates
```

### 10. Merge Pull Request

- Merge PR on GitHub (squash or rebase as per project preference)
- Delete remote branch after merge

### 11. Clean Up Worktree

```bash
# Navigate out of worktree
cd ../good-vibes-gallery

# Remove the worktree
git worktree remove ../good-vibes-gallery-feature-name

# Verify removal
git worktree list
```

## Troubleshooting

### Worktree Already Exists

```bash
# Remove existing worktree first
git worktree remove ../good-vibes-gallery-feature-name

# Then create new one
git worktree add ../good-vibes-gallery-feature-name feature-name
```

### Branch Doesn't Exist

```bash
# Create new branch from main
git worktree add -b feature-name ../good-vibes-gallery-feature-name main
```

### Port 4321 Already in Use

```bash
# Specify different port
bun run dev -- --port 4322
```

### Dependencies Conflict

```bash
# Clean install
rm -rf node_modules bun.lock
bun install
```

### Database Issues

```bash
# Reinitialize database
bun run db:init
bun run db:seed
```

## Best Practices

- **One feature per worktree**: Keep worktrees focused on single features
- **Regular commits**: Commit frequently with clear messages
- **Keep main updated**: Periodically fetch and rebase on latest main
- **Clean up**: Remove worktrees after merging to avoid clutter
- **Test before push**: Run `bun run build` and `bun run astro check` before pushing
- **Format code**: Always run `bunx prettier --write` before committing
- **Review your own code**: Check diffs before pushing

## Quick Reference

```bash
# Create worktree
git worktree add ../good-vibes-gallery-feature-name feature-name

# Navigate to worktree
cd ../good-vibes-gallery-feature-name

# Install and develop
bun install
bun run dev

# Type check
bun run astro check

# Format code
bunx prettier --write .

# Build production
bun run build

# Clean up
cd ../good-vibes-gallery
git worktree remove ../good-vibes-gallery-feature-name
```

## Related Documentation

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Astro Documentation](https://docs.astro.build)
- [Bun Documentation](https://bun.sh/docs)
- Project: `AGENTS.md` for architecture overview
- Rules: `.windsurf/rules/` for code style guidelines
