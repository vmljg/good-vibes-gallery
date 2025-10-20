# 🌟 Good Vibes Gallery

A modern, community-driven gallery showcasing amazing websites. Submit your site via GitHub Issues and see it featured on our gallery!

## ✨ Features

- **Easy Submission**: Submit websites via GitHub Issues
- **Automated Processing**: GitHub Actions handles validation and processing
- **Fast & Modern**: Built with Bun for lightning-fast builds
- **Responsive Design**: Beautiful on all devices
- **Latest CSS**: Utilizing CSS Baseline 2024+ features
- **Static & Fast**: Pre-rendered HTML served from GitHub Pages

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0.0 or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/good-vibes-gallery.git
cd good-vibes-gallery

# Install dependencies
bun install

# Initialize database
bun run db:init

# Seed with sample data (optional)
bun run db:seed

# Build the site
bun run build

# Preview locally
cd dist && bun --port 3000 --hot
```

Visit `http://localhost:3000` to see the gallery!

## 📝 Submitting a Website

1. Go to the [Issues page](https://github.com/yourusername/good-vibes-gallery/issues/new?template=submit-website.yml)
2. Fill out the submission form
3. Submit the issue
4. Wait for automated processing (usually < 2 minutes)
5. Your website will appear on the gallery!

## 🏗️ Project Structure

```
windsurf-project/
├── src/
│   ├── db/              # Database schema and queries
│   ├── build/           # Static site generator
│   └── types/           # TypeScript type definitions
├── public/
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   └── images/          # Images and screenshots
├── scripts/             # Build and processing scripts
├── .github/
│   ├── workflows/       # GitHub Actions
│   └── ISSUE_TEMPLATE/  # Submission template
└── dist/                # Build output (generated)
```

## 🛠️ Development

### Available Scripts

- `bun run dev` - Start development server with watch mode
- `bun run build` - Build the static site
- `bun run db:init` - Initialize the SQLite database
- `bun run db:seed` - Seed database with sample data
- `bun run clean` - Clean build artifacts
- `bun test` - Run tests

### Database

The project uses Bun's built-in SQLite support for managing content. The database includes:

- **websites** - Submitted website entries
- **tags** - Categories and tags
- **website_tags** - Many-to-many relationship

### CSS Architecture

The project uses modern CSS features from Baseline 2024+:

- **Cascade Layers** (`@layer`) - For organized, maintainable styles
- **Container Queries** - Responsive components
- **:has() Selector** - Parent selection without JS
- **color-mix()** - Dynamic color variations
- **light-dark()** - Automatic dark mode support
- **Subgrid** - Advanced grid layouts
- **View Transitions API** - Smooth page transitions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Project Plan](./PROJECT_PLAN.md) - Overall project planning and features
- [Architecture](./ARCHITECTURE.md) - Technical architecture and design
- [TODO](./TODO.md) - Development tasks and roadmap

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh)
- Hosted on [GitHub Pages](https://pages.github.com)
- Inspired by the web community

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](./PROJECT_PLAN.md)
2. Search [existing issues](https://github.com/yourusername/good-vibes-gallery/issues)
3. Create a [new issue](https://github.com/yourusername/good-vibes-gallery/issues/new)

---

Made with ❤️ by the community
