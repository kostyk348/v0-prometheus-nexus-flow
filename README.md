# 🌐 Prometheus Nexus Flow

> A revolutionary hyperdimensional semantic browser inspired by Ted Nelson's Project Xanadu and decentralized mesh networking. Transform any webpage into an interactive, lens-filtered hypergraph with bidirectional links, transclusion, and version control.

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## ✨ What is Prometheus Nexus Flow?

Prometheus Nexus Flow transcends traditional web browsing by implementing **Xanadu's hypertext vision** and **decentralized mesh networking principles**. It's not just a browser—it's a **semantic knowledge graph** that reveals the hidden connections between ideas, documents, and concepts across the web.

### 🎯 Revolutionary Features

#### Xanadu-Inspired Hypertext
- **Bidirectional Links**: See what links TO a page, not just what it links to
- **Transclusion**: Embed content from other documents with live updates
- **Version Control**: Track changes to documents over time
- **Parallel Documents**: Compare multiple versions side by side
- **Deep Linking**: Link to specific paragraphs, sentences, or words
- **Visible Connections**: Visualize the web of relationships as a 3D graph

#### Decentralized Architecture (Netsukuku-Inspired)
- **Peer-to-Peer Content Sharing**: Share cached pages with other users
- **Distributed Knowledge Graph**: Build a collective understanding of the web
- **Mesh Networking**: Connect to nearby users for faster content delivery
- **Offline-First**: Full functionality without internet connection
- **Content Addressing**: Reference content by hash, not location

#### Enterprise & Corporate Features
- **Team Workspaces**: Collaborate with colleagues on research
- **Shared Annotations**: Comment and discuss documents together
- **Access Control**: Role-based permissions for sensitive content
- **Analytics Dashboard**: Track team browsing patterns and insights
- **API Access**: Integrate with your existing tools
- **SSO Integration**: Enterprise authentication (SAML, OAuth)
- **Audit Logs**: Complete history of all actions
- **Custom Lens Marketplace**: Share and monetize custom lenses

#### Advanced AI & Semantic Features
- **Concept Extraction**: Automatically identify key concepts and entities
- **Semantic Search**: Find pages by meaning, not just keywords
- **Topic Clustering**: Group related pages automatically
- **Smart Summarization**: AI-generated summaries of any length
- **Citation Network**: Trace ideas through academic papers
- **Knowledge Graph**: Build your personal knowledge base

#### Next-Generation UI Paradigm
- **3D Spatial Navigation**: Navigate content in three dimensions
- **Hypergraph Visualization**: See all connections at once
- **Gesture Controls**: Swipe, pinch, and rotate to explore
- **Voice Commands**: Navigate hands-free
- **AR/VR Support**: Immersive browsing in virtual reality
- **Neural Interface Ready**: Prepared for brain-computer interfaces

### 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/prometheus-nexus-flow.git
cd prometheus-nexus-flow

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📦 Installation Options

#### Option 1: Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/prometheus-nexus-flow)

#### Option 2: Docker
\`\`\`bash
docker build -t prometheus-nexus-flow .
docker run -p 3000:3000 prometheus-nexus-flow
\`\`\`

#### Option 3: Self-Hosted
\`\`\`bash
npm run build
npm start
\`\`\`

## 📖 Core Concepts

### MYCT (Multi-dimensional Yielding Content Tree)
A semantic format that represents web content as a hypergraph with bidirectional links, transclusion, and version control.

### Lens System
Transform how you perceive content through visual and semantic filters. Create custom lenses for different contexts (research, casual reading, code review, etc.).

### Hypergraph Navigation
Move beyond linear browsing. See all connections, explore multiple paths simultaneously, and discover unexpected relationships.

### Transclusion
Quote and reference content from other pages with live updates. When the source changes, your quotes update automatically.

### Bidirectional Links
Every link is two-way. See what pages link to the current page, creating a web of knowledge.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Frutiger Aero design system
- **State Management**: React Context + localStorage
- **Rendering**: Custom MYCT renderer with lens system
- **Networking**: Server-side API routes for CORS bypass
- **Storage**: IndexedDB for offline caching
- **P2P**: WebRTC for peer-to-peer content sharing

### Project Structure
\`\`\`
prometheus-nexus-flow/
├── app/
│   ├── api/
│   │   ├── fetch-page/          # Page fetcher
│   │   ├── backlinks/           # Bidirectional link tracker
│   │   ├── transclude/          # Transclusion engine
│   │   └── version/             # Version control
│   ├── globals.css              # Frutiger Aero design system
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── nexus-browser.tsx        # Main browser interface
│   ├── myct-renderer.tsx        # MYCT rendering engine
│   ├── lens-selector.tsx        # Lens switcher
│   ├── hypergraph-3d.tsx        # 3D graph visualization
│   ├── transclusion-editor.tsx  # Transclusion UI
│   └── version-control.tsx      # Version history
├── lib/
│   ├── types/
│   │   ├── myct.ts              # MYCT types
│   │   ├── lens.ts              # Lens system
│   │   └── xanadu.ts            # Xanadu features
│   ├── schemas/
│   │   └── default-lenses.ts    # Built-in lenses
│   ├── translator/
│   │   ├── url-parser.ts        # URL to MYCT
│   │   └── html-parser.ts       # HTML extraction
│   └── xanadu/
│       ├── backlinks.ts         # Bidirectional links
│       ├── transclusion.ts      # Transclusion engine
│       └── versioning.ts        # Version control
├── public/
│   ├── manifest.json            # PWA manifest
│   └── icons/                   # App icons
└── README.md
\`\`\`

## 🎨 Design Philosophy

### Frutiger Aero Aesthetic
Inspired by mid-2000s futuristic interfaces (Windows Vista/7 era):
- Glossy, reflective surfaces
- Blue-to-green gradients
- Transparency and glass effects
- Soft glows and light effects
- Nature-inspired elements

### Hyperdimensional UI
Move beyond flat 2D interfaces:
- 3D spatial navigation
- Layered information architecture
- Gesture-based interactions
- Immersive visualizations

## 🔧 Configuration

### Environment Variables
\`\`\`env
# Required
NEXT_PUBLIC_APP_NAME="Prometheus Nexus Flow"
NEXT_PUBLIC_API_URL="https://your-api.com"

# Optional
NEXT_PUBLIC_DEFAULT_LENS="dark-minimal"
NEXT_PUBLIC_ENABLE_P2P="true"
NEXT_PUBLIC_ENABLE_XANADU="true"

# Enterprise Features
NEXT_PUBLIC_SSO_ENABLED="false"
NEXT_PUBLIC_ANALYTICS_ENABLED="false"
\`\`\`

### Custom Lenses
Create custom lenses in `lib/schemas/custom-lenses.ts`:

\`\`\`typescript
export const myLens: Lens = {
  id: 'my-lens',
  name: 'My Custom Lens',
  description: 'A lens for my specific needs',
  rules: [
    {
      target: { role: 'heading-2' },
      style: {
        color: '#00ff00',
        fontSize: '2rem',
        fontWeight: 'bold'
      }
    }
  ]
}
\`\`\`

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for public APIs
- Write tests for new features

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Ted Nelson** - Project Xanadu and hypertext vision
- **Netsukuku** - Decentralized mesh networking concepts
- **Next.js** - React framework
- **shadcn/ui** - UI components
- **Lucide** - Icons

## 🗺️ Roadmap

### Phase 1: Core Xanadu Features (Q1 2026)
- [x] Bidirectional links
- [x] Transclusion
- [x] Version control
- [ ] Parallel documents
- [ ] Deep linking

### Phase 2: Decentralization (Q2 2026)
- [ ] P2P content sharing
- [ ] Distributed knowledge graph
- [ ] Mesh networking
- [ ] Content addressing

### Phase 3: Enterprise Features (Q3 2026)
- [ ] Team workspaces
- [ ] SSO integration
- [ ] Analytics dashboard
- [ ] API access
- [ ] Custom lens marketplace

### Phase 4: Next-Gen UI (Q4 2026)
- [ ] 3D spatial navigation
- [ ] AR/VR support
- [ ] Voice commands
- [ ] Gesture controls
- [ ] Neural interface

## 📧 Contact

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: contact@prometheus-nexus.com
- Discord: [Join our community](https://discord.gg/prometheus-nexus)

---

**Prometheus Nexus Flow** - Reimagining the web as it was meant to be.
