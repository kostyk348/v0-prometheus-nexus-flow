# Prometheus Nexus Flow

A semantic browser that renders websites as interactive hypergraphs. Built with Next.js, TypeScript, and WebAssembly-compatible technologies.

## Features

- **Semantic Hypergraph Rendering**: Converts social media content into structured, navigable hypergraphs
- **Interactive Hyperedges**: Click to expand threads, replies, and comments with smooth animations
- **Adaptive Lens System**: Switch between visual themes (Dark Minimal, Social Light, Xanadu)
- **Responsive Design**: Automatically adapts layout for mobile and desktop
- **Zero LLM Dependencies**: Pure deterministic parsing and rendering

## Architecture

### Core Components

- **MYCT (Semantic Structure)**: JSON-based hypergraph format with support for text, images, stacks, and hyperedges
- **Lens System**: CSS-like styling rules that adapt based on node type, role, state, and device
- **URL Translator**: Converts social media URLs (X/Twitter, Reddit) into MYCT format
- **Adaptive Renderer**: React-based renderer with mobile/desktop layout support

### Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- React 19

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

Open [http://localhost:3000](http://localhost:3000) and enter a URL to explore.

## Example URLs

- `x.com/elonmusk` - Twitter/X feed with expandable replies
- `x.com/vercel` - Vercel's social media feed
- `reddit.com/r/rust` - Reddit threads with comments

## Lens Themes

### Dark Minimal (Default)
Clean dark theme with green accents, optimized for focus and readability.

### Social Light
Bright theme inspired by modern social media platforms.

### Xanadu
Monospace theme with GitHub-inspired colors, emphasizing the hypergraph structure.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── myct-renderer.tsx  # Core hypergraph renderer
│   ├── lens-selector.tsx  # Theme switcher
│   └── nexus-browser.tsx  # Main browser interface
├── lib/
│   ├── types/             # TypeScript definitions
│   │   ├── myct.ts       # Hypergraph types
│   │   └── lens.ts       # Styling system types
│   ├── schemas/           # Default lens definitions
│   └── translator/        # URL parsing and translation
└── README.md
\`\`\`

## Future Enhancements

- IPFS integration for permanent node IDs
- Real API integrations (Twitter API, Reddit API)
- Custom lens creation UI
- Graph visualization mode
- Export/import MYCT documents
- WebAssembly performance optimizations

## License

MIT
