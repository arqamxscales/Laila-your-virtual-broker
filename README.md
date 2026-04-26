# Laila - Your Virtual Broker

**Advanced AI-powered Pakistan Stock Exchange (PSX) Dashboard with Real-Time Market Intelligence, Voice Analytics, and Virtual Trading Simulation**

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue) ![React](https://img.shields.io/badge/React-19.2+-61dafb) ![Vite](https://img.shields.io/badge/Vite-8.0+-646cff) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Live Demo

- **Production**: [https://laila-your-virtual-broker.vercel.app](https://laila-your-virtual-broker.vercel.app)
- **GitHub Repository**: [laila-your-virtual-broker](https://github.com/YourUsername/laila-your-virtual-broker)

---

## 📋 Features Overview

### Core Market Intelligence
- ✅ **Live PSX Data Integration**: Real-time stock symbols, indices, market-watch, and top movers
- ✅ **Pakistan-Synced Session Engine**: Accurate PSX trading hours (Mon-Thu 09:30-15:30, Fri split session)
- ✅ **Sector Momentum Tracking**: 54 SECP-classified sectors with momentum analysis
- ✅ **Index Snapshots**: KSE-100, KSE-30, KMI-30, ALLSHR with live updates
- ✅ **Macro Indicators**: PKR/USD, Policy Rate, CPI, Brent Oil pricing

### AI Analytics Suite
- ✅ **VGI Scoring Engine**: Proprietary volatility-guided-investment score (0-100) with grade assignment
- ✅ **Advanced Radar**: Market breadth, volume concentration, regime detection, anomaly detection
- ✅ **Forecast Bias System**: Bullish/Cautious/Defensive directional bias with confidence metrics
- ✅ **SECP Taxonomy Mapping**: Intelligent sector normalization from 40+ live sector names to 54-sector standard
- ✅ **Anomaly Detection**: Real-time identification of outlier movers with threshold alerts

### Virtual Trading & Portfolio
- ✅ **Paper Trading Simulator**: Buy/sell virtual positions with real-time P&L tracking
- ✅ **Position Management**: Holdings, cost basis, average price, portfolio value calculations
- ✅ **AI Quant Lab**: Strategy-aware position sizing (Scalp/Swing/Position modes)
- ✅ **Risk Budget Framework**: Volatility-adjusted capital at risk with exposure calculations
- ✅ **Playbook Engine**: AI Rebalancer, Hedge Plan, and Swing Setup automation

### Advanced Terminal Features
- ✅ **Watchlist Management**: Track up to 20 symbols with persistent local storage
- ✅ **Smart Alert Center**: Configurable % change threshold alerts + anomaly radar
- ✅ **AI Query Assistant**: Natural language commands for stock lookup, sector pulse, forecasts
- ✅ **Command Support**: 40+ specialized commands (help, calc, compare, portfolio, risk, vgi, taxonomy, etc.)
- ✅ **Chat History**: Last 10 messages displayed with streaming responses

### Avatar & Multimedia
- ✅ **Laila Voice Avatar**: 3D-styled AI analyst avatar with speaking animations
- ✅ **Voice Briefing**: Text-to-speech market insights with rate/pitch control
- ✅ **Computer Vision**: Camera-based motion/light detection with real-time 3D transforms
- ✅ **Background Beat**: Customizable 44-90 BPM metronome for trading flow

### User Experience
- ✅ **Modern Blue-White-Black Theme**: Professional dashboard with glassmorphism design
- ✅ **Real-Time Clock**: Pakistan timezone-synced date/time display
- ✅ **Engagement Scoring**: Activity tracking with analytics (searches, trades, briefings)
- ✅ **Responsive Layout**: 12-column grid that adapts to all device sizes
- ✅ **Accessibility**: ARIA labels, semantic HTML, keyboard navigation support

### Security & Reliability
- ✅ **Graceful Fallback**: Auto-switches to demo mode if APIs unavailable
- ✅ **Environment Hardening**: All secrets hidden in .env, safe public API usage only
- ✅ **No Backend Required**: Pure frontend - can run entirely in browser
- ✅ **Local Persistence**: Watchlist and settings saved to localStorage

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19.2 + TypeScript 6.0
- **Build Tool**: Vite 8.0 (lightning-fast HMR)
- **Styling**: Custom CSS with CSS custom properties for theming
- **Deployment**: Vercel serverless (with optional API routes for proxying)
- **Package Manager**: npm 10+

### Data Flow
```
┌─────────────────────────────────────────────────────────────┐
│ External APIs (read-only, public endpoints)                 │
├──────────────────────────────────────────────────────────────┤
│ • dps.psx.com.pk/symbols       (PSX listed companies)       │
│ • dps.psx.com.pk/market-watch  (live stock prices/volumes)  │
│ • dps.psx.com.pk/indices       (index snapshots)            │
│ • dps.psx.com.pk/top-10-symbols (volume leaders)            │
│ • api.gdeltproject.org         (geopolitical news feed)     │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ React App (Browser)                                         │
├──────────────────────────────────────────────────────────────┤
│ • Real-time stock data → State management via useState       │
│ • AI analytics → useMemo calculations (no network latency)   │
│ • Portfolio simulation → In-memory paper trading             │
│ • Voice synthesis → Web Speech API                           │
│ • Computer vision → MediaDevices getUserMedia()             │
│ • Persistent storage → localStorage for watchlist/settings   │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│ User Interface (Dashboard)                                   │
├──────────────────────────────────────────────────────────────┤
│ • 12-column responsive grid layout                           │
│ • Real-time market snapshots                                 │
│ • Chat-based command interface                               │
│ • AI avatar with voice/video effects                         │
│ • Portfolio manager + analytics                              │
└──────────────────────────────────────────────────────────────┘
```

### Component Hierarchy
- **App.tsx**: Main component (1,824 lines, fully self-contained)
  - State management (stocks, portfolio, chat, watchlist, settings)
  - API integration & data fetching
  - AI calculation engines (VGI, anomalies, forecasts)
  - 20+ sub-sections (header, ticker, grid, cards)
  - TaxonomyModal component (modal overlay)

---

## 📊 Advanced Features Explained

### VGI Scoring Algorithm
Proprietary **Volatility-Guided-Investment** score combining 4 metrics:

```
VGI Score = (Momentum × 0.34) + (Stability × 0.25) + (Distribution × 0.21) + (Taxonomy × 0.20)

Where:
- Momentum = 50 + (avgChange × 14), capped 0-100
- Stability = 100 - (volatility × 22), min 0
- Distribution = 100 - volumeConcentration, min 0
- Taxonomy = sectorMappingCoverage%

Grade: A (≥75) | B (≥62) | C (≥48) | D (<48)
Bias: Constructive (≥62) | Neutral (≥48) | Defensive (<48)
```

### SECP Taxonomy Mapping
Intelligent fuzzy matching of live sector names (40+) to official SECP 54-sector catalog:
- **Token-based similarity** scoring with substring matching
- **Threshold-based matching** (45% minimum score)
- **Visual coverage display** showing mapped/unmapped sectors
- **Modal inspector** to review full taxonomy relationships

### AI Anomaly Detection
Real-time identification of outlier stocks:
```
AnomalyThreshold = |avgChange| + (volatility × 1.9)
Flagged = stocks where |change| ≥ threshold
```
Top 5 anomalies displayed with alert integration.

### Adaptive Position Sizing
Quant Lab adjusts position size based on:
- **Strategy Mode**: Scalp (0.72x) | Swing (1.0x) | Position (1.26x)
- **Volatility Adjustment**: 2.2 / volatility, clamped 0.45-1.65x
- **Risk Budget**: User-defined % of portfolio at risk (0.5-10%)
- **Capital Allocation**: Max 35% of total equity exposed per trade

---

## 🔐 Security & Privacy

### Environment Variables
All sensitive configuration stored in `.env` (never committed):

```bash
VITE_DEMO_EMAIL=your_email@example.com
VITE_DEMO_PASSWORD=secure_demo_password
VITE_ALERT_THRESHOLD=2.5
VITE_MODEL_VERSION=VGI-PSX-2.6
```

### .gitignore Hardening
Comprehensive rules protect:
- `.env*` files (except `.env.example`)
- API keys, tokens, credentials
- Node modules, dist builds, caches
- IDE configs, OS files (.DS_Store, Thumbs.db)
- Coverage reports, temporary files

### Data Handling
- ✅ **No backend authentication**: Demo mode always accessible
- ✅ **Public APIs only**: All endpoints are read-only, publicly documented
- ✅ **Browser storage**: Portfolio/watchlist saved locally, never uploaded
- ✅ **No tracking**: No third-party analytics or telemetry
- ✅ **CORS enabled**: Vercel API routes proxy external APIs safely

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ and npm 10+
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Setup

```bash
# 1. Clone repository
git clone https://github.com/YourUsername/laila-your-virtual-broker.git
cd laila-your-virtual-broker

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your demo credentials (optional)

# 4. Start development server
npm run dev

# 5. Open http://localhost:5173
```

### Development Commands

```bash
# Development server with HMR
npm run dev

# TypeScript type checking
npm run build

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

### Build Output

```
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-HASH.js       # Main bundle (React + App)
│   ├── index-HASH.css      # Compiled CSS
│   └── ...
```

---

## 📦 Deployment to Vercel

### Quick Deploy

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy to staging
vercel

# 3. Deploy to production
vercel --prod
```

### Vercel Configuration

The `vercel.json` file configures:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables (set in Vercel dashboard)

### Environment Variables on Vercel

Set in **Vercel Project Settings → Environment Variables**:

```
VITE_DEMO_EMAIL=demo@genzfintech.com
VITE_DEMO_PASSWORD=ChangeMe@2026
VITE_ALERT_THRESHOLD=2.5
VITE_MODEL_VERSION=VGI-PSX-2.6
```

### Custom Domain
1. Add custom domain in Vercel dashboard
2. Update DNS records (CNAME to `cname.vercel.sh`)
3. Vercel auto-provisions HTTPS certificate

---

## 📱 GitHub Setup

### Recommended Repository Configuration

**Repository Name**: `laila-your-virtual-broker`

**Repository Settings**:
- Visibility: Public
- Branch protection: Require PR reviews (optional)
- Default branch: `main`

**GitHub Topics** (for discoverability):
- `psx` `pakistan-stock-exchange`
- `fintech` `trading-dashboard`
- `react` `typescript` `vite`
- `ai-analytics` `virtual-trading`
- `pakistan` `finance`

### Automated Deployments

GitHub Actions can auto-deploy on push:

```yaml
# .github/workflows/deploy.yml (example)
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🎯 API Integration Details

### PSX Data Endpoints (No Auth Required)

```javascript
// Symbols listing (all companies)
GET https://dps.psx.com.pk/symbols
Response: [{ symbol, name, sectorName, isETF, isDebt }, ...]

// Market watch (live prices)
GET https://dps.psx.com.pk/market-watch
Response: HTML table, parsed for live data

// Indices snapshots
GET https://dps.psx.com.pk/indices/
Response: HTML with table data

// Top 10 by volume
GET https://dps.psx.com.pk/data/top-10-symbols
Response: [{ symbol, volume }, ...]
```

### GDELT News Feed (Public API)

```javascript
// Geopolitical event data
GET https://api.gdeltproject.org/api/v2/doc/doc?query=...&mode=ArtList&format=json
Response: { articles: [{ title, url, domain, seendate }, ...] }
```

All requests made directly from browser with fallback if unavailable.

---

## 📈 Usage Examples

### Login
1. Enter demo email: `demo@genzfintech.com`
2. Enter password: `ChangeMe@2026` (or from .env)
3. Click "Enter Dashboard"

### Chat Commands
```
help              → Show all available commands
HBL               → Look up stock HBL
compare HBL UBL   → Compare two stocks
calc 100000 120 136 → Simulate trade (capital, buy, sell)
gainers           → Top 5 movers
losers            → Bottom 5 movers
portfolio         → Show virtual portfolio
forecast          → AI directional bias
risk              → Risk metrics and sector analysis
sector bank       → Filter stocks by sector
taxonomy          → SECP sector mapping coverage
anomalies         → Outlier stocks
vgi               → VGI score and signal
watchlist         → Show tracked symbols
alerts            → Active watchlist alerts
watch add HBL     → Add to watchlist
watch remove HBL  → Remove from watchlist
beat on/off       → Enable/disable background metronome
date              → Show current session date/time
health            → API feed status
```

### Virtual Trading
1. Enter symbol (e.g., HBL)
2. Enter quantity
3. Click **Buy** or **Sell**
4. View portfolio P&L instantly

### Watchlist Alerts
1. Add symbols to watchlist
2. Set alert threshold (default 2.5%)
3. Receive alerts when stocks move beyond threshold

### AI Briefing
1. Click **"Laila Live Briefing"**
2. Listen to market insight (voice synthesis)
3. Watch avatar mouth animation while speaking

---

## 🛠️ Advanced Customization

### Theme Customization
Edit `src/App.css` CSS variables:

```css
:root {
  --primary-color: #0b5cff;
  --accent-color: #53b0ff;
  --success-color: #78ffb4;
  --danger-color: #ff8383;
}
```

### AI Model Tuning
Edit `src/App.tsx` constants:

```typescript
const VGI_MODEL_VERSION = 'VGI-PSX-2.6'
const DEFAULT_ALERT_THRESHOLD = 2.5
const VITE_DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL

// VGI weights (line ~730)
const score = momentum * 0.34 + stability * 0.25 + distribution * 0.21 + taxonomy * 0.20
```

### Adding External APIs
1. Update `src/App.tsx` fetch calls
2. Add environment variables to `.env.example`
3. Configure Vercel environment variables
4. Test in preview deployment first

---

## 📝 File Structure

```
laila-your-virtual-broker/
├── src/
│   ├── App.tsx             # Main component (1,824 lines)
│   ├── App.css             # All styling
│   ├── main.tsx            # React entry point
│   ├── index.css           # Global styles
│   └── assets/             # Images, fonts
├── api/                    # Vercel serverless functions
│   ├── news-feed.js        # GDELT proxy
│   ├── psx-*.js            # PSX data proxies
│   ├── news/
│   │   └── [...path].js    # Dynamic news route
│   └── psx/
│       └── [...path].js    # Dynamic PSX route
├── public/
│   └── images/             # Hero images
├── .gitignore              # Comprehensive ignore rules
├── .env.example            # Safe environment template
├── package.json            # Dependencies
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
├── vercel.json             # Vercel config
├── eslint.config.js        # Linting rules
└── README.md               # This file
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- TypeScript strict mode
- React hooks patterns
- Functional components only
- memoized calculations with useMemo
- no external UI libraries (pure CSS)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💼 About

**Built for**: Mohammad Arqam Javed

**Purpose**: Advanced AI-powered market intelligence and virtual trading platform for Pakistan Stock Exchange

**Status**: Production-ready with continuous enhancements

---

## 🔗 Quick Links

- **Live App**: [https://laila-your-virtual-broker.vercel.app](https://laila-your-virtual-broker.vercel.app)
- **GitHub**: [YourUsername/laila-your-virtual-broker](https://github.com/YourUsername/laila-your-virtual-broker)
- **PSX Official**: [https://www.psx.com.pk](https://www.psx.com.pk)
- **GDELT Project**: [https://www.gdeltproject.org](https://www.gdeltproject.org)

---

## 📞 Support

For issues, feature requests, or questions:
- Open GitHub issue
- Check existing documentation
- Review API endpoint status

**Last Updated**: April 26, 2026
**Version**: 2.6 (Super-Advanced)
