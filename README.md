# 🌐 Prometheus Nexus Flow

> A revolutionary semantic web browser that transforms any webpage into an interactive, lens-filtered hypergraph experience.

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## ✨ What is Prometheus Nexus Flow?

Prometheus Nexus Flow is not just another web browser—it's a **semantic lens system** that translates any webpage into a structured, navigable hypergraph format (MYCT - Multi-dimensional Yielding Content Tree). Apply different "lenses" to transform how you perceive and interact with web content.

### 🎯 Key Features

- **🔍 Universal Web Parser**: Fetches and parses any webpage, extracting semantic content
- **🎨 Adaptive Lens System**: Transform content appearance with visual lenses (Dark Minimal, Social Light, Xanadu)
- **📊 Connection Graph**: Visualize page relationships and navigate through link networks
- **🔖 Smart Bookmarks**: Save and organize your favorite pages
- **📜 Browsing History**: Track and revisit your exploration journey
- **🤖 AI Insights**: Automatic document analysis with reading time, word count, and key topics
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **🎭 Multiple View Modes**: Standard, Bento Grid, and Layers for different content layouts
- **📝 Document Outline**: Navigate long articles with auto-generated table of contents
- **💾 Export Functionality**: Download pages as Markdown for offline reading
- **🎬 Rich Media Support**: Images, videos (including YouTube/Vimeo), audio, and tables

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/prometheus-nexus-flow.git
cd prometheus-nexus-flow

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/prometheus-nexus-flow)

The easiest way to deploy Prometheus Nexus Flow is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

## 📖 Usage Guide

### Basic Navigation

1. **Enter a URL**: Type any webpage URL in the address bar
2. **Select a Lens**: Choose from Dark Minimal, Social Light, or Xanadu
3. **Switch View Mode**: Toggle between Standard, Bento Grid, or Layers view
4. **Explore Connections**: Open the graph sidebar to see all linked pages

### Advanced Features

#### Bookmarks
- Click the bookmark icon (⭐) to save the current page
- Access bookmarks from the home page or bookmarks panel
- Bookmarks persist across sessions using localStorage

#### Document Outline
- Click the outline button to see the page structure
- Click any heading to jump to that section
- Automatically generated from page headings

#### AI Insights
- View reading time and word count
- See extracted key topics from the document
- Analyze document structure (sections, paragraphs, media)

#### Export
- Click the download icon to export as Markdown
- Preserves headings, paragraphs, lists, and links
- Perfect for offline reading or archiving

### Keyboard Shortcuts

- `Ctrl/Cmd + B` - Toggle bookmarks panel
- `Ctrl/Cmd + H` - Toggle history panel
- `Ctrl/Cmd + O` - Toggle document outline
- `Ctrl/Cmd + G` - Toggle connection graph
- `Ctrl/Cmd + I` - Toggle AI insights
- `Escape` - Close all panels

## 🏗️ Architecture

### Core Concepts

#### MYCT (Multi-dimensional Yielding Content Tree)
A JSON-based semantic format that represents web content as a structured tree:

\`\`\`typescript
interface MyctNode {
  id: string
  role: string  // semantic role: heading-2, paragraph, link, image, etc.
  content?: string
  url?: string
  children?: MyctNode[]
  metadata?: Record<string, any>
}
\`\`\`

#### Lens System
CSS-like styling rules that transform content based on semantic roles:

\`\`\`typescript
interface LensRule {
  target: {
    role?: string
    state?: string
    device?: 'mobile' | 'desktop'
  }
  style: {
    color?: string
    fontSize?: string
    fontWeight?: string
    // ... and more
  }
}
\`\`\`

#### URL Translation Pipeline
1. **Fetch**: Server-side API route fetches the webpage
2. **Parse**: HTML parser extracts semantic content
3. **Transform**: Content is converted to MYCT format
4. **Render**: React renderer applies lens styling
5. **Display**: User sees transformed content

### Project Structure

\`\`\`
prometheus-nexus-flow/
├── app/
│   ├── api/
│   │   └── fetch-page/
│   │       └── route.ts          # Server-side page fetcher
│   ├── globals.css               # Global styles and design tokens
│   ├── layout.tsx                # Root layout with fonts
│   └── page.tsx                  # Home page
├── components/
│   ├── nexus-browser.tsx         # Main browser interface
│   ├── myct-renderer.tsx         # MYCT rendering engine
│   └── lens-selector.tsx         # Lens switcher UI
├── lib/
│   ├── types/
│   │   ├── myct.ts              # MYCT type definitions
│   │   └── lens.ts              # Lens system types
│   ├── schemas/
│   │   └── default-lenses.ts    # Built-in lens definitions
│   └── translator/
│       ├── url-parser.ts        # URL to MYCT translator
│       └── html-parser.ts       # HTML content extractor
├── public/
│   ├── manifest.json            # PWA manifest
│   └── icons/                   # App icons
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

## 🎨 Lens Themes

### Dark Minimal
Clean dark theme with green accents, optimized for focus and readability. Perfect for long reading sessions.

### Social Light
Bright theme inspired by modern social media platforms. Great for casual browsing and visual content.

### Xanadu
Monospace theme with hypertext aesthetics, emphasizing the hypergraph structure. Ideal for technical content and code.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

\`\`\`env
# Optional: Add custom configuration
NEXT_PUBLIC_APP_NAME="Prometheus Nexus Flow"
NEXT_PUBLIC_DEFAULT_LENS="dark-minimal"
\`\`\`

### Customizing Lenses

Edit `lib/schemas/default-lenses.ts` to create custom lenses:

\`\`\`typescript
export const myCustomLens: Lens = {
  id: 'my-custom-lens',
  name: 'My Custom Lens',
  description: 'A custom lens for my needs',
  rules: [
    {
      target: { role: 'heading-2' },
      style: {
        color: '#ff0000',
        fontSize: '2rem',
        fontWeight: 'bold'
      }
    }
    // Add more rules...
  ]
}
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use semantic commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by Ted Nelson's Xanadu project

## 🗺️ Roadmap

- [ ] Custom lens creation UI
- [ ] Real-time collaboration
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] IPFS integration for permanent content
- [ ] WebAssembly performance optimizations
- [ ] Plugin system for custom parsers
- [ ] Graph database integration
- [ ] Semantic search across visited pages
- [ ] AI-powered content summarization

## 📧 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourusername](https://twitter.com/yourusername)
- Email: your.email@example.com

---

Made with ❤️ by the Prometheus Nexus Flow team
