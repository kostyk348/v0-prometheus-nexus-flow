# Installation Guide - Prometheus Nexus Flow

This comprehensive guide will help you install, configure, and deploy Prometheus Nexus Flow.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Local Development Setup](#local-development-setup)
3. [Configuration](#configuration)
4. [Building for Production](#building-for-production)
5. [Deployment Options](#deployment-options)
6. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- **Node.js**: 18.17 or higher
- **npm**: 9.0 or higher (or yarn 1.22+, pnpm 8.0+)
- **RAM**: 4GB minimum
- **Disk Space**: 500MB for dependencies

### Recommended Requirements
- **Node.js**: 20.x LTS
- **npm**: 10.x
- **RAM**: 8GB or more
- **Disk Space**: 1GB
- **OS**: macOS, Linux, or Windows 10/11

## Local Development Setup

### Step 1: Install Node.js

#### macOS
\`\`\`bash
# Using Homebrew
brew install node

# Or download from nodejs.org
\`\`\`

#### Linux (Ubuntu/Debian)
\`\`\`bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

#### Windows
Download and install from [nodejs.org](https://nodejs.org/)

### Step 2: Clone the Repository

\`\`\`bash
# Using HTTPS
git clone https://github.com/yourusername/prometheus-nexus-flow.git

# Or using SSH
git clone git@github.com:yourusername/prometheus-nexus-flow.git

# Navigate to project directory
cd prometheus-nexus-flow
\`\`\`

### Step 3: Install Dependencies

\`\`\`bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm (recommended for faster installs)
pnpm install
\`\`\`

This will install all required dependencies including:
- Next.js 15.2
- React 19
- TypeScript 5
- Tailwind CSS 4
- Radix UI components
- And more...

### Step 4: Run Development Server

\`\`\`bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
\`\`\`

The application will start at [http://localhost:3000](http://localhost:3000)

### Step 5: Verify Installation

1. Open your browser to `http://localhost:3000`
2. You should see the Prometheus Nexus Flow home page
3. Try entering a URL like `https://en.wikipedia.org/wiki/Hypertext`
4. The page should load and render with the default lens

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# App Configuration
NEXT_PUBLIC_APP_NAME="Prometheus Nexus Flow"
NEXT_PUBLIC_DEFAULT_LENS="dark-minimal"

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"

# Optional: Custom API endpoint
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
\`\`\`

### Customizing Default Settings

Edit `lib/schemas/default-lenses.ts` to modify or add lenses:

\`\`\`typescript
// Add your custom lens
export const customLens: Lens = {
  id: 'custom',
  name: 'Custom Lens',
  description: 'My custom styling',
  rules: [
    // Your custom rules
  ]
}
\`\`\`

### Port Configuration

To run on a different port:

\`\`\`bash
# Using npm
PORT=3001 npm run dev

# Using yarn
PORT=3001 yarn dev

# Using pnpm
PORT=3001 pnpm dev
\`\`\`

## Building for Production

### Step 1: Build the Application

\`\`\`bash
npm run build
\`\`\`

This will:
1. Compile TypeScript
2. Optimize React components
3. Generate static assets
4. Create production bundles

### Step 2: Test Production Build Locally

\`\`\`bash
npm start
\`\`\`

The production server will start at `http://localhost:3000`

### Step 3: Verify Production Build

1. Check that all pages load correctly
2. Test navigation and lens switching
3. Verify bookmarks and history work
4. Test on different devices/browsers

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js apps:

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   \`\`\`

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

3. **Configure Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Docker

Create a `Dockerfile`:

\`\`\`dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
\`\`\`

Build and run:

\`\`\`bash
# Build image
docker build -t prometheus-nexus-flow .

# Run container
docker run -p 3000:3000 prometheus-nexus-flow
\`\`\`

### Option 3: Self-Hosted (VPS/Cloud)

1. **Prepare Server**
   \`\`\`bash
   # Install Node.js on server
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   \`\`\`

2. **Deploy Application**
   \`\`\`bash
   # Clone repository on server
   git clone https://github.com/yourusername/prometheus-nexus-flow.git
   cd prometheus-nexus-flow
   
   # Install and build
   npm install
   npm run build
   
   # Start with PM2
   pm2 start npm --name "nexus-flow" -- start
   pm2 save
   pm2 startup
   \`\`\`

3. **Configure Nginx** (Optional)
   \`\`\`nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   \`\`\`

### Option 4: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   \`\`\`bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod
   \`\`\`

## Troubleshooting

### Common Issues

#### Port Already in Use
\`\`\`bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
\`\`\`

#### Module Not Found Errors
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

#### Build Failures
\`\`\`bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
\`\`\`

#### TypeScript Errors
\`\`\`bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript
npm install typescript@latest
\`\`\`

### Performance Issues

1. **Slow Development Server**
   - Increase Node.js memory: `NODE_OPTIONS='--max-old-space-size=4096' npm run dev`
   - Disable source maps in development

2. **Large Bundle Size**
   - Analyze bundle: `npm run build -- --analyze`
   - Enable code splitting
   - Lazy load components

### Browser Compatibility

Supported browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

For older browsers, consider adding polyfills.

## Getting Help

- **Documentation**: Check the [README.md](README.md)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/prometheus-nexus-flow/issues)
- **Discussions**: Join [GitHub Discussions](https://github.com/yourusername/prometheus-nexus-flow/discussions)
- **Email**: Contact support@example.com

## Next Steps

After installation:
1. Read the [Usage Guide](README.md#usage-guide)
2. Explore the [Architecture](README.md#architecture)
3. Try creating custom lenses
4. Contribute to the project

---

Happy browsing with Prometheus Nexus Flow! 🚀
\`\`\`

```typescript file="" isHidden
