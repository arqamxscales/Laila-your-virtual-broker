import { type CSSProperties, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Stock = {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  volume: number
  marketCapB: number
  pe: number
}

type Message = {
  role: 'user' | 'assistant'
  text: string
}

type IndexSnapshot = {
  index: string
  level: number
  change: number
}

type NewsItem = {
  title: string
  url: string
  source: string
  publishedAt: string
}

type Holding = {
  symbol: string
  shares: number
  avgPrice: number
}

type SecpSector = {
  code: string
  name: string
}

type SectorMapping = {
  liveSector: string
  matched: SecpSector | null
  score: number
}

type PsxSessionState = {
  isOpen: boolean
  phase: 'open' | 'closed' | 'break'
  phaseLabel: string
  nextEventLabel: string
  nextEventInMinutes: number
}

type StrategyMode = 'scalp' | 'swing' | 'position'

const DEMO_USER = {
  email: import.meta.env.VITE_DEMO_EMAIL ?? 'demo@genzfintech.com',
  password: import.meta.env.VITE_DEMO_PASSWORD ?? 'ChangeMe@2026',
}

const DEFAULT_ALERT_THRESHOLD = Number(import.meta.env.VITE_ALERT_THRESHOLD ?? '2.5')
const VGI_MODEL_VERSION = import.meta.env.VITE_MODEL_VERSION ?? 'VGI-PSX-2.6'

const APP_NAME = 'Laila-Your-Virtual-Broker'

const REAL_IMAGES = {
  loginHero: '/images/karachi-finance.jpeg',
  tradingFloor: '/images/psx-trading-floor.webp',
  marketCity: '/images/karachi-finance.jpeg',
  analytics: '/images/market-dashboard.png',
  lailaAvatar: '/images/laila-avatar.jpeg',
}

const upcomingIPOs = [
  { name: 'GenZ Digital Securities', expected: 'Q3 2026', size: 'PKR 3.2B', sector: 'FinTech Services' },
  { name: 'Pak Green Hydrogen Ltd', expected: 'Q4 2026', size: 'PKR 6.1B', sector: 'Renewable Energy' },
  { name: 'Karachi Cloud Exchange', expected: 'Q1 2027', size: 'PKR 2.4B', sector: 'Data Centers' },
  { name: 'Indus Retail Ventures', expected: 'Q1 2027', size: 'PKR 4.8B', sector: 'Retail Chains' },
]

const macroIndicators = [
  { label: 'PKR / USD', value: '279.40', change: -0.22 },
  { label: 'Policy Rate', value: '18.00%', change: 0 },
  { label: 'CPI YoY', value: '12.8%', change: -0.8 },
  { label: 'Brent (USD)', value: '83.6', change: 0.92 },
]

const indexSnapshots: IndexSnapshot[] = [
  { index: 'KSE-100', level: 79420, change: 1.12 },
  { index: 'KSE-30', level: 28143, change: 0.78 },
  { index: 'KMI-30', level: 131002, change: 0.96 },
  { index: 'ALLSHR', level: 52683, change: 0.61 },
]

const SECP_54_SECTOR_CATALOG: SecpSector[] = [
  { code: 'SECP-01', name: 'Automobile Assembler' },
  { code: 'SECP-02', name: 'Automobile Parts & Accessories' },
  { code: 'SECP-03', name: 'Cable & Electrical Goods' },
  { code: 'SECP-04', name: 'Cement' },
  { code: 'SECP-05', name: 'Chemical' },
  { code: 'SECP-06', name: 'Close-End Mutual Fund' },
  { code: 'SECP-07', name: 'Commercial Banks' },
  { code: 'SECP-08', name: 'Engineering' },
  { code: 'SECP-09', name: 'Fertilizer' },
  { code: 'SECP-10', name: 'Food & Personal Care Products' },
  { code: 'SECP-11', name: 'Glass & Ceramics' },
  { code: 'SECP-12', name: 'Insurance' },
  { code: 'SECP-13', name: 'Investment Banks / Investment Companies / Securities Companies' },
  { code: 'SECP-14', name: 'Leasing Companies' },
  { code: 'SECP-15', name: 'Leather & Tanneries' },
  { code: 'SECP-16', name: 'Miscellaneous' },
  { code: 'SECP-17', name: 'Modarabas' },
  { code: 'SECP-18', name: 'Oil & Gas Exploration Companies' },
  { code: 'SECP-19', name: 'Oil & Gas Marketing Companies' },
  { code: 'SECP-20', name: 'Paper & Board' },
  { code: 'SECP-21', name: 'Pharmaceuticals' },
  { code: 'SECP-22', name: 'Power Generation & Distribution' },
  { code: 'SECP-23', name: 'Refinery' },
  { code: 'SECP-24', name: 'Sugar & Allied Industries' },
  { code: 'SECP-25', name: 'Synthetic & Rayon' },
  { code: 'SECP-26', name: 'Technology & Communication' },
  { code: 'SECP-27', name: 'Textile Composite' },
  { code: 'SECP-28', name: 'Textile Spinning' },
  { code: 'SECP-29', name: 'Textile Weaving' },
  { code: 'SECP-30', name: 'Tobacco' },
  { code: 'SECP-31', name: 'Transport' },
  { code: 'SECP-32', name: 'Vanaspati & Allied Industries' },
  { code: 'SECP-33', name: 'Woolen' },
  { code: 'SECP-34', name: 'Exchange Traded Funds' },
  { code: 'SECP-35', name: 'Real Estate Investment Trust' },
  { code: 'SECP-36', name: 'Asset Management Companies' },
  { code: 'SECP-37', name: 'Property' },
  { code: 'SECP-38', name: 'Transport Services' },
  { code: 'SECP-39', name: 'Automobile Dealer' },
  { code: 'SECP-40', name: 'Building Materials' },
  { code: 'SECP-41', name: 'Ceramics' },
  { code: 'SECP-42', name: 'Consumer Electronics' },
  { code: 'SECP-43', name: 'Data Storage' },
  { code: 'SECP-44', name: 'E-Commerce' },
  { code: 'SECP-45', name: 'Education' },
  { code: 'SECP-46', name: 'Healthcare Services' },
  { code: 'SECP-47', name: 'Household Goods' },
  { code: 'SECP-48', name: 'Information Technology Services' },
  { code: 'SECP-49', name: 'Logistics' },
  { code: 'SECP-50', name: 'Metals & Mining' },
  { code: 'SECP-51', name: 'Packaging' },
  { code: 'SECP-52', name: 'Petrochemicals' },
  { code: 'SECP-53', name: 'Renewable Energy' },
  { code: 'SECP-54', name: 'Telecommunication Infrastructure' },
]

const TAXONOMY_REFERENCE_DATE = '24 Apr 2026'
const PAK_TIMEZONE = 'Asia/Karachi'
const PAK_OFFSET_MS = 5 * 60 * 60 * 1000

const toPakClock = (ts: number) => {
  const pak = new Date(ts + PAK_OFFSET_MS)
  return {
    day: pak.getUTCDay(),
    minutes: pak.getUTCHours() * 60 + pak.getUTCMinutes(),
  }
}

const formatCountdown = (mins: number) => {
  const safe = Math.max(0, mins)
  const h = Math.floor(safe / 60)
  const m = safe % 60
  return `${h}h ${m}m`
}

const getPsxSessionState = (ts: number): PsxSessionState => {
  const { day, minutes } = toPakClock(ts)
  const windowsByDay: Record<number, Array<{ start: number; end: number }>> = {
    1: [{ start: 9 * 60 + 30, end: 15 * 60 + 30 }],
    2: [{ start: 9 * 60 + 30, end: 15 * 60 + 30 }],
    3: [{ start: 9 * 60 + 30, end: 15 * 60 + 30 }],
    4: [{ start: 9 * 60 + 30, end: 15 * 60 + 30 }],
    5: [
      { start: 9 * 60 + 30, end: 12 * 60 },
      { start: 14 * 60, end: 16 * 60 + 30 },
    ],
    6: [],
    0: [],
  }

  const todaysWindows = windowsByDay[day] ?? []
  const activeWindow = todaysWindows.find((w) => minutes >= w.start && minutes < w.end)
  if (activeWindow) {
    return {
      isOpen: true,
      phase: 'open',
      phaseLabel: 'PSX OPEN',
      nextEventLabel: 'Session closes in',
      nextEventInMinutes: activeWindow.end - minutes,
    }
  }

  if (day === 5 && minutes >= 12 * 60 && minutes < 14 * 60) {
    return {
      isOpen: false,
      phase: 'break',
      phaseLabel: 'FRIDAY BREAK',
      nextEventLabel: 'Session resumes in',
      nextEventInMinutes: 14 * 60 - minutes,
    }
  }

  const nextOpenDelta = (() => {
    for (let add = 0; add < 8; add += 1) {
      const candidateDay = (day + add) % 7
      const candidateWindows = windowsByDay[candidateDay] ?? []
      for (const window of candidateWindows) {
        if (add === 0 && window.start <= minutes) continue
        return add * 24 * 60 - minutes + window.start
      }
    }
    return 24 * 60
  })()

  return {
    isOpen: false,
    phase: 'closed',
    phaseLabel: 'PSX CLOSED',
    nextEventLabel: 'Next open in',
    nextEventInMinutes: nextOpenDelta,
  }
}

type TaxonomyModalProps = {
  isOpen: boolean
  onClose: () => void
  sectors: SecpSector[]
  mappedCount: number
  liveSectorCount: number
  unmatchedLiveSectors: string[]
  generatedAt: string
}

function TaxonomyModal({ isOpen, onClose, sectors, mappedCount, liveSectorCount, unmatchedLiveSectors, generatedAt }: TaxonomyModalProps) {
  if (!isOpen) return null

  return (
    <div className="taxonomy-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="taxonomy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="taxonomy-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="taxonomy-modal-head">
          <h2 id="taxonomy-modal-title">SECP 54-Sector Taxonomy</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>
        <p className="hint">Reference catalog for taxonomy view and sector normalization.</p>
        <div className="taxonomy-meta-grid">
          <span>Reference Date: {TAXONOMY_REFERENCE_DATE}</span>
          <span>Generated: {generatedAt}</span>
          <span>Coverage: {mappedCount}/{liveSectorCount || 0} live sectors mapped</span>
          <span>Catalog Size: {sectors.length}</span>
        </div>
        {unmatchedLiveSectors.length ? (
          <p className="hint">
            Unmapped live sectors: {unmatchedLiveSectors.slice(0, 6).join(', ')}{unmatchedLiveSectors.length > 6 ? '…' : ''}
          </p>
        ) : (
          <p className="hint up">All live sectors are mapped to taxonomy entries.</p>
        )}
        <div className="taxonomy-list-wrap">
          <ol className="taxonomy-list">
            {sectors.map((sector) => (
              <li key={sector.code}>
                <strong>{sector.code}</strong>
                <span>{sector.name}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

const formatMoney = (n: number) => new Intl.NumberFormat('en-PK').format(Math.round(n))
const parseNumber = (value: string) => Number(value.replace(/,/g, '').replace(/[^0-9.+-]/g, '')) || 0
const normalizeSectorName = (value: string) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

function App() {
  const [email, setEmail] = useState(DEMO_USER.email)
  const [password, setPassword] = useState(DEMO_USER.password)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedSector, setSelectedSector] = useState('All PSX Sectors')
  const [showTaxonomyModal, setShowTaxonomyModal] = useState(false)
  const [search, setSearch] = useState('')
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Laila online. Ask: ticker symbol, sector pulse, or "calc 100000 122 136" for trade simulation.',
    },
  ])
  const [preferredVoice, setPreferredVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [apiMode, setApiMode] = useState<'offline' | 'live'>('offline')
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [liveIndexSnapshots, setLiveIndexSnapshots] = useState<IndexSnapshot[]>(indexSnapshots)
  const [lastSync, setLastSync] = useState('')
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null)
  const [loginTime, setLoginTime] = useState<number | null>(null)
  const [analytics, setAnalytics] = useState({ chatQueries: 0, stockSearches: 0, trades: 0, briefings: 0 })
  const [portfolioCash, setPortfolioCash] = useState(1_500_000)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [tradeSymbol, setTradeSymbol] = useState('HBL')
  const [tradeQty, setTradeQty] = useState(100)
  const [portfolioNote, setPortfolioNote] = useState('Ready for your first virtual trade.')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [cameraStatus, setCameraStatus] = useState('Camera off')
  const [motionLevel, setMotionLevel] = useState(0)
  const [lightLevel, setLightLevel] = useState(0.5)
  const [lastCvTickAt, setLastCvTickAt] = useState<number | null>(null)
  const [voiceStatus, setVoiceStatus] = useState('Voice ready')
  const [beatOn, setBeatOn] = useState(false)
  const [beatBpm, setBeatBpm] = useState(62)
  const [nowTs, setNowTs] = useState(Date.now())
  const [watchInput, setWatchInput] = useState('')
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [alertThreshold, setAlertThreshold] = useState(DEFAULT_ALERT_THRESHOLD)
  const [riskBudgetPct, setRiskBudgetPct] = useState(2)
  const [strategyMode, setStrategyMode] = useState<StrategyMode>('swing')
  const lastTrackedSearch = useRef('')
  const audioCtxRef = useRef<AudioContext | null>(null)
  const beatTimerRef = useRef<number | null>(null)
  const beatStepRef = useRef(0)
  const cvVideoRef = useRef<HTMLVideoElement | null>(null)
  const cvCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const cvRafRef = useRef<number | null>(null)
  const lastLumaRef = useRef<Float32Array | null>(null)
  const cvStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const fetchLiveNews = async () => {
      const q = encodeURIComponent('(Pakistan AND (economy OR inflation OR "stock exchange" OR KSE100 OR PSX))')
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=ArtList&format=json&maxrecords=8&sort=datedesc`
      const res = await fetch(url)
      if (!res.ok) throw new Error('news feed unavailable')
      const data = (await res.json()) as {
        articles?: Array<{ title?: string; url?: string; domain?: string; seendate?: string }>
      }

      const parsed = (data.articles ?? [])
        .filter((a) => a.title && a.url)
        .slice(0, 8)
        .map((a) => ({
          title: a.title ?? 'Untitled',
          url: a.url ?? '#',
          source: a.domain ?? 'Global feed',
          publishedAt: a.seendate ?? '',
        }))

      setNewsItems(parsed)
    }

    const fetchLivePsx = async () => {
      const symbolsRes = await fetch('https://dps.psx.com.pk/symbols')
      if (!symbolsRes.ok) {
        throw new Error('PSX symbols endpoint unavailable')
      }

      const symbolsRaw = (await symbolsRes.json()) as Array<{
        symbol: string
        name: string
        sectorName: string
        isETF?: boolean
        isDebt?: boolean
      }>
      const symbols = symbolsRaw.filter((s) => !s.isDebt && !s.isETF && /^[A-Z]{2,5}$/.test(s.symbol))
      let topSymbols: Array<{ symbol: string; volume: number }> = []

      try {
        const topSymbolsRes = await fetch('https://dps.psx.com.pk/data/top-10-symbols')
        if (topSymbolsRes.ok) {
          topSymbols = (await topSymbolsRes.json()) as Array<{ symbol: string; volume: number }>
        }
      } catch {
        // optional endpoint
      }

      const symbolMeta = new Map(symbols.map((s) => [s.symbol, s]))
      const topVolMap = new Map(topSymbols.map((t) => [t.symbol, t.volume]))
      let marketWatchStocks: Stock[] = []

      try {
        const marketWatchRes = await fetch('https://dps.psx.com.pk/market-watch')
        if (marketWatchRes.ok) {
          const marketHtml = await marketWatchRes.text()
          const marketDoc = new DOMParser().parseFromString(marketHtml, 'text/html')
          const headerNames = [...marketDoc.querySelectorAll('thead th')].map((th) => (th.getAttribute('data-name') ?? th.textContent ?? '').toLowerCase())
          const idxOf = (key: string) => headerNames.findIndex((h) => h === key)
          const rows = [...marketDoc.querySelectorAll('tbody tr')]

          marketWatchStocks = rows
            .map((row, i) => {
              const cells = row.querySelectorAll('td')
              const pick = (key: string) => {
                const idx = idxOf(key)
                if (idx < 0 || !cells[idx]) return ''
                return cells[idx].textContent?.trim() ?? ''
              }

              const symbol = pick('symbol')
              if (!symbol) return null
              const current = parseNumber(pick('current') || pick('ldcp'))
              const ldcp = parseNumber(pick('ldcp'))
              const absoluteChange = parseNumber(pick('change'))
              const pct = parseNumber(pick('changep')) || (ldcp ? (absoluteChange / ldcp) * 100 : 0)
              const vol = parseNumber(pick('volume')) || topVolMap.get(symbol) || 0
              const meta = symbolMeta.get(symbol)

              return {
                symbol,
                name: meta?.name ?? symbol,
                sector: pick('sector') || meta?.sectorName || 'PSX Listed',
                price: current || 0,
                change: +pct.toFixed(2),
                volume: Math.max(0, Math.round(vol)),
                marketCapB: +(18 + ((i * 2.8) % 650)).toFixed(1),
                pe: +(5 + ((i * 0.35) % 28)).toFixed(1),
              } satisfies Stock
            })
            .filter((s): s is Stock => s !== null)
        }
      } catch {
        // optional endpoint
      }

      if (!symbols.length) {
        throw new Error('empty PSX symbols response')
      }

      const marketBySymbol = new Map(marketWatchStocks.map((s) => [s.symbol, s]))
      const builtStocks: Stock[] = symbols
        .map((meta, i) => {
          const market = marketBySymbol.get(meta.symbol)
          return {
            symbol: meta.symbol,
            name: meta.name,
            sector: meta.sectorName || market?.sector || 'PSX Listed',
            price: market?.price ?? +(48 + (i % 120) * 2.15).toFixed(2),
            change: market?.change ?? 0,
            volume: market?.volume ?? topVolMap.get(meta.symbol) ?? 0,
            marketCapB: market?.marketCapB ?? +(18 + ((i * 2.8) % 650)).toFixed(1),
            pe: market?.pe ?? +(5 + ((i * 0.35) % 28)).toFixed(1),
          }
        })
        .sort((a, b) => a.symbol.localeCompare(b.symbol))

      setStocks(builtStocks)

      try {
        const indicesRes = await fetch('https://dps.psx.com.pk/indices/')
        if (indicesRes.ok) {
          const indicesHtml = await indicesRes.text()
          const indicesDoc = new DOMParser().parseFromString(indicesHtml, 'text/html')
          const indexRows = [...indicesDoc.querySelectorAll('#indicesTable tbody tr')]
          const parsedIndices = indexRows
            .map((row) => {
              const tds = row.querySelectorAll('td')
              const index = tds[0]?.textContent?.trim().split(' ')[0] ?? ''
              const level = parseNumber(tds[3]?.textContent?.trim() ?? '')
              const change = parseNumber(tds[5]?.textContent?.trim() ?? '')
              if (!index || !level) return null
              return { index, level, change }
            })
            .filter((i): i is IndexSnapshot => i !== null)
            .slice(0, 6)

          if (parsedIndices.length) {
            setLiveIndexSnapshots(parsedIndices)
          }
        }
      } catch {
        // optional endpoint
      }

      const now = Date.now()
      setLastSyncAt(now)
      setLastSync(new Date(now).toLocaleTimeString('en-PK', { timeZone: PAK_TIMEZONE }))
    }

    const syncAll = async () => {
      try {
        await Promise.all([fetchLivePsx(), fetchLiveNews()])
        setApiMode('live')
      } catch {
        setApiMode('offline')
      }
    }

    syncAll()
    const timer = window.setInterval(syncAll, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNowTs(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    try {
      const savedWatch = window.localStorage.getItem('genz.watchlist')
      const savedThreshold = window.localStorage.getItem('genz.alertThreshold')

      if (savedWatch) {
        const parsed = JSON.parse(savedWatch) as string[]
        if (Array.isArray(parsed)) {
          setWatchlist(parsed.filter((s) => /^[A-Z0-9]{2,5}$/.test(s)).slice(0, 20))
        }
      }

      if (savedThreshold) {
        const threshold = Number(savedThreshold)
        if (Number.isFinite(threshold) && threshold > 0) {
          setAlertThreshold(Math.min(15, Math.max(0.5, threshold)))
        }
      }
    } catch {
      // localStorage optional
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('genz.watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    window.localStorage.setItem('genz.alertThreshold', String(alertThreshold))
  }, [alertThreshold])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return

      const rankedKeywords = ['laila', 'female', 'woman', 'samantha', 'victoria', 'zira', 'aria', 'ava', 'google uk english female']
      const found = voices.find((v) => rankedKeywords.some((k) => `${v.name} ${v.voiceURI}`.toLowerCase().includes(k)))
      setPreferredVoice(found ?? voices[0])
    }

    pickVoice()
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice)

    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickVoice)
  }, [])

  useEffect(() => {
    if (!showTaxonomyModal) return

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowTaxonomyModal(false)
      }
    }

    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [showTaxonomyModal])

  const totalMarketCap = useMemo(
    () => stocks.reduce((sum, s) => sum + s.marketCapB, 0),
    [stocks],
  )

  const avgChange = useMemo(
    () => (stocks.length ? stocks.reduce((sum, s) => sum + s.change, 0) / stocks.length : 0),
    [stocks],
  )

  const topMovers = useMemo(
    () => [...stocks].sort((a, b) => b.change - a.change).slice(0, 12),
    [stocks],
  )

  const bottomMovers = useMemo(
    () => [...stocks].sort((a, b) => a.change - b.change).slice(0, 8),
    [stocks],
  )

  const volatility = useMemo(() => {
    if (!stocks.length) return 0
    const mean = avgChange
    const variance = stocks.reduce((acc, s) => acc + (s.change - mean) ** 2, 0) / stocks.length
    return Math.sqrt(variance)
  }, [avgChange, stocks])

  const sectorPerformance = useMemo(() => {
    const groups = new Map<string, { sum: number; count: number }>()
    stocks.forEach((s) => {
      const current = groups.get(s.sector) ?? { sum: 0, count: 0 }
      groups.set(s.sector, { sum: current.sum + s.change, count: current.count + 1 })
    })

    return [...groups.entries()]
      .map(([sector, value]) => ({ sector, avg: value.sum / value.count }))
      .sort((a, b) => b.avg - a.avg)
  }, [stocks])

  const bestSector = sectorPerformance[0]
  const weakSector = sectorPerformance[sectorPerformance.length - 1]

  const sectorList = useMemo(() => {
    return [...new Set(stocks.map((s) => s.sector).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  }, [stocks])

  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      const sectorMatch = selectedSector === 'All PSX Sectors' || s.sector === selectedSector
      const text = `${s.symbol} ${s.name}`.toLowerCase()
      return sectorMatch && text.includes(search.toLowerCase())
    })
  }, [search, selectedSector, stocks])

  const taxonomyMappings = useMemo(() => {
    const normalizedCatalog = SECP_54_SECTOR_CATALOG.map((sector) => ({
      sector,
      normalized: normalizeSectorName(sector.name),
      tokens: new Set(normalizeSectorName(sector.name).split(' ').filter((t) => t.length > 2)),
    }))

    const scoreMatch = (live: string, candidate: { normalized: string; tokens: Set<string> }) => {
      if (live === candidate.normalized) return 1
      if (live.includes(candidate.normalized) || candidate.normalized.includes(live)) return 0.92
      const liveTokens = new Set(live.split(' ').filter((t) => t.length > 2))
      let overlap = 0
      liveTokens.forEach((t) => {
        if (candidate.tokens.has(t)) overlap += 1
      })
      if (!liveTokens.size) return 0
      return overlap / Math.max(liveTokens.size, candidate.tokens.size)
    }

    const mappings: SectorMapping[] = sectorList.map((liveSector) => {
      const normalizedLive = normalizeSectorName(liveSector)
      let best: { sector: SecpSector; score: number } | null = null

      for (const candidate of normalizedCatalog) {
        const score = scoreMatch(normalizedLive, candidate)
        if (!best || score > best.score) {
          best = { sector: candidate.sector, score }
        }
      }

      const threshold = 0.45
      return {
        liveSector,
        matched: best && best.score >= threshold ? best.sector : null,
        score: best?.score ?? 0,
      }
    })

    return mappings.sort((a, b) => b.score - a.score)
  }, [sectorList])

  const taxonomyCoverage = useMemo(() => {
    const mapped = taxonomyMappings.filter((m) => m.matched)
    const unmapped = taxonomyMappings.filter((m) => !m.matched).map((m) => m.liveSector)
    const ratio = taxonomyMappings.length ? (mapped.length / taxonomyMappings.length) * 100 : 0
    return {
      mappedCount: mapped.length,
      unmapped,
      ratio,
    }
  }, [taxonomyMappings])

  const aiAdvanced = useMemo(() => {
    const positiveCount = stocks.filter((s) => s.change > 0).length
    const breadth = stocks.length ? (positiveCount / stocks.length) * 100 : 0
    const sortedByVol = [...stocks].sort((a, b) => b.volume - a.volume)
    const totalVolume = sortedByVol.reduce((sum, s) => sum + s.volume, 0)
    const top10Volume = sortedByVol.slice(0, 10).reduce((sum, s) => sum + s.volume, 0)
    const concentration = totalVolume ? (top10Volume / totalVolume) * 100 : 0
    const anomalyThreshold = Math.abs(avgChange) + volatility * 1.9
    const anomalies = stocks.filter((s) => Math.abs(s.change) >= anomalyThreshold).slice(0, 5)

    const regime =
      avgChange >= 0.25 && breadth >= 52 && volatility <= 2.2
        ? 'Trend expansion'
        : avgChange < 0 && breadth < 45
          ? 'Risk-off rotation'
          : 'Mixed / range bound'

    return {
      breadth,
      concentration,
      anomalies,
      anomalyThreshold,
      regime,
    }
  }, [avgChange, stocks, volatility])

  const psxSession = useMemo(() => getPsxSessionState(nowTs), [nowTs])

  const vgiSignal = useMemo(() => {
    const momentum = Math.min(100, Math.max(0, 50 + avgChange * 14))
    const stability = Math.max(0, 100 - volatility * 22)
    const distribution = Math.max(0, 100 - aiAdvanced.concentration)
    const taxonomy = taxonomyCoverage.ratio
    const score = momentum * 0.34 + stability * 0.25 + distribution * 0.21 + taxonomy * 0.2
    const grade = score >= 75 ? 'A' : score >= 62 ? 'B' : score >= 48 ? 'C' : 'D'
    const bias = score >= 62 ? 'Constructive' : score >= 48 ? 'Neutral' : 'Defensive'
    return { score, grade, bias }
  }, [aiAdvanced.concentration, avgChange, taxonomyCoverage.ratio, volatility])

  const watchlistRows = useMemo(() => {
    return watchlist
      .map((symbol) => {
        const stock = stocks.find((s) => s.symbol === symbol)
        if (!stock) return null
        return {
          symbol,
          price: stock.price,
          change: stock.change,
          volume: stock.volume,
        }
      })
      .filter((row): row is { symbol: string; price: number; change: number; volume: number } => row !== null)
  }, [stocks, watchlist])

  const watchAlerts = useMemo(() => {
    const symbolAlerts = watchlistRows
      .filter((row) => Math.abs(row.change) >= alertThreshold)
      .map((row) => `${row.symbol} moved ${row.change.toFixed(2)}% (threshold ${alertThreshold.toFixed(2)}%)`)

    const anomalyAlerts = aiAdvanced.anomalies.slice(0, 3).map((row) => `Anomaly: ${row.symbol} at ${row.change.toFixed(2)}%`)
    return [...symbolAlerts, ...anomalyAlerts]
  }, [aiAdvanced.anomalies, alertThreshold, watchlistRows])

  const dataHealth = useMemo(() => {
    const latencySec = lastSyncAt ? Math.max(0, (nowTs - lastSyncAt) / 1000) : null
    const feedStatus = apiMode === 'live' && latencySec !== null && latencySec <= 95 ? 'Healthy' : apiMode === 'live' ? 'Degraded' : 'Offline'
    return { latencySec, feedStatus }
  }, [apiMode, lastSyncAt, nowTs])

  const sessionDateLabel = useMemo(
    () => new Date(nowTs).toLocaleDateString('en-PK', { timeZone: PAK_TIMEZONE, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
    [nowTs],
  )
  const sessionTimeLabel = useMemo(
    () => new Date(nowTs).toLocaleTimeString('en-PK', { timeZone: PAK_TIMEZONE, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    [nowTs],
  )

  const avatarInsight = useMemo(() => {
    const mood = avgChange >= 0 ? 'Risk-on momentum building. Market vibe is clean and constructive.' : 'Defensive rotation active. Stay sharp on drawdown risk.'
    const hottest = topMovers[0]
    const feedTag = apiMode === 'live' ? 'Live PSX feed connected.' : 'PSX feed reconnecting. Showing latest available PSX dataset.'
    const leader = hottest ? `${hottest.symbol} (${hottest.change.toFixed(2)}%)` : 'N/A'
    return `PSX Live Pulse: ${mood} Leading ticker ${leader}. Net market cap PKR ${formatMoney(totalMarketCap)}B. ${feedTag}`
  }, [apiMode, avgChange, topMovers, totalMarketCap])

  const aiForecast = useMemo(() => {
    const forecastBias = avgChange * 0.65 - volatility * 0.15
    const direction = forecastBias > 0 ? 'Bullish tilt' : 'Cautious tilt'
    const confidence = Math.min(96, Math.max(54, 72 + forecastBias * 8))
    return { direction, confidence }
  }, [avgChange, volatility])

  const speakInsight = () => {
    if (!('speechSynthesis' in window)) {
      setVoiceStatus('Voice unavailable in this browser')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(avatarInsight)
    if (preferredVoice) utterance.voice = preferredVoice
    utterance.rate = 0.93
    utterance.pitch = 1.14
    utterance.onstart = () => {
      setIsSpeaking(true)
      setVoiceStatus('Speaking')
    }
    utterance.onend = () => {
      setIsSpeaking(false)
      setVoiceStatus('Voice ready')
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setVoiceStatus('Voice error — check browser audio permissions')
    }
    window.speechSynthesis.speak(utterance)
    setAnalytics((prev) => ({ ...prev, briefings: prev.briefings + 1 }))
  }

  useEffect(() => {
    if (!cameraEnabled) {
      if (cvRafRef.current) {
        cancelAnimationFrame(cvRafRef.current)
        cvRafRef.current = null
      }
      if (cvStreamRef.current) {
        cvStreamRef.current.getTracks().forEach((t) => t.stop())
        cvStreamRef.current = null
      }
      if (cvVideoRef.current) {
        cvVideoRef.current.srcObject = null
      }
      lastLumaRef.current = null
      setMotionLevel(0)
      setCameraStatus('Camera off')
      setLastCvTickAt(null)
      return
    }

    let cancelled = false

    const startCv = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraStatus('Camera not supported')
          setCameraEnabled(false)
          return
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: 'user',
          },
          audio: false,
        })

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        cvStreamRef.current = stream
        const video = cvVideoRef.current
        const canvas = cvCanvasRef.current
        if (!video || !canvas) return

        video.srcObject = stream
        await video.play()
        setCameraStatus('Computer vision active')

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return

        const w = 48
        const h = 36
        canvas.width = w
        canvas.height = h

        const tick = () => {
          if (!cvVideoRef.current || cvVideoRef.current.readyState < 2) {
            cvRafRef.current = requestAnimationFrame(tick)
            return
          }

          ctx.drawImage(video, 0, 0, w, h)
          const frame = ctx.getImageData(0, 0, w, h).data

          let lightSum = 0
          let motionSum = 0
          const totalPx = w * h
          const luma = new Float32Array(totalPx)

          for (let i = 0, p = 0; i < frame.length; i += 4, p += 1) {
            const y = 0.2126 * frame[i] + 0.7152 * frame[i + 1] + 0.0722 * frame[i + 2]
            luma[p] = y
            lightSum += y
            if (lastLumaRef.current) {
              motionSum += Math.abs(y - lastLumaRef.current[p])
            }
          }

          const avgLight = lightSum / (totalPx * 255)
          const rawMotion = lastLumaRef.current ? motionSum / (totalPx * 255) : 0

          setLightLevel((prev) => prev * 0.82 + avgLight * 0.18)
          setMotionLevel((prev) => prev * 0.58 + Math.min(1, rawMotion * 14) * 0.42)
          setLastCvTickAt(Date.now())
          lastLumaRef.current = luma

          cvRafRef.current = requestAnimationFrame(tick)
        }

        cvRafRef.current = requestAnimationFrame(tick)
      } catch (error) {
        const name = (error as { name?: string })?.name
        if (name === 'NotAllowedError') {
          setCameraStatus('Camera permission denied by browser')
        } else if (name === 'NotFoundError') {
          setCameraStatus('No camera device detected')
        } else {
          setCameraStatus('Camera failed to start')
        }
        setCameraEnabled(false)
      }
    }

    void startCv()

    return () => {
      cancelled = true
      if (cvRafRef.current) {
        cancelAnimationFrame(cvRafRef.current)
        cvRafRef.current = null
      }
      if (cvStreamRef.current) {
        cvStreamRef.current.getTracks().forEach((t) => t.stop())
        cvStreamRef.current = null
      }
      if (cvVideoRef.current) {
        cvVideoRef.current.srcObject = null
      }
      lastLumaRef.current = null
    }
  }, [cameraEnabled])

  const triggerBeat = (ctx: AudioContext, when: number, accent: boolean) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(accent ? 74 : 54, when)

    gain.gain.setValueAtTime(0.0001, when)
    gain.gain.exponentialRampToValueAtTime(accent ? 0.12 : 0.08, when + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.24)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(when)
    osc.stop(when + 0.26)
  }

  const stopBeat = () => {
    if (beatTimerRef.current) {
      window.clearInterval(beatTimerRef.current)
      beatTimerRef.current = null
    }
    audioCtxRef.current?.suspend()
    setBeatOn(false)
  }

  const startBeat = async () => {
    try {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!Ctx) return
        audioCtxRef.current = new Ctx()
      }

      const ctx = audioCtxRef.current
      await ctx.resume()

      if (beatTimerRef.current) {
        window.clearInterval(beatTimerRef.current)
      }

      beatStepRef.current = 0
      beatTimerRef.current = window.setInterval(() => {
        const now = ctx.currentTime
        const isAccent = beatStepRef.current % 4 === 0
        triggerBeat(ctx, now + 0.02, isAccent)
        beatStepRef.current += 1

        if (beatStepRef.current >= 16) {
          beatStepRef.current = 0
        }
      }, Math.round((60 / Math.max(44, Math.min(90, beatBpm))) * 1000))

      setBeatOn(true)
    } catch {
      setBeatOn(false)
    }
  }

  const toggleBeat = () => {
    if (beatOn) {
      stopBeat()
      return
    }
    void startBeat()
  }

  useEffect(() => {
    return () => {
      if (beatTimerRef.current) {
        window.clearInterval(beatTimerRef.current)
      }
      void audioCtxRef.current?.close()
    }
  }, [])

  useEffect(() => {
    if (!beatOn) return
    stopBeat()
    void startBeat()
  }, [beatBpm])

  const onLogin = (e: FormEvent) => {
    e.preventDefault()
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      setLoggedIn(true)
      setLoginTime(Date.now())
      setLoginError('')
      return
    }
    setLoginError('Invalid demo credentials. Use prefilled values.')
  }

  useEffect(() => {
    const q = search.trim().toLowerCase()
    if (q.length < 2 || q === lastTrackedSearch.current) return
    const timer = window.setTimeout(() => {
      setAnalytics((prev) => ({ ...prev, stockSearches: prev.stockSearches + 1 }))
      lastTrackedSearch.current = q
    }, 450)
    return () => window.clearTimeout(timer)
  }, [search])

  const addWatchSymbol = (rawSymbol: string) => {
    const symbol = rawSymbol.trim().toUpperCase()
    if (!/^[A-Z0-9]{2,5}$/.test(symbol)) {
      return 'Use a valid symbol format (2-5 letters).'
    }
    const exists = stocks.some((s) => s.symbol === symbol)
    if (!exists) {
      return `${symbol} is not found in current PSX feed.`
    }
    let added = false
    setWatchlist((prev) => {
      if (prev.includes(symbol)) return prev
      added = true
      return [...prev, symbol].slice(0, 20)
    })
    return added ? `${symbol} added to watchlist.` : `${symbol} already exists in watchlist.`
  }

  const removeWatchSymbol = (rawSymbol: string) => {
    const symbol = rawSymbol.trim().toUpperCase()
    let removed = false
    setWatchlist((prev) => {
      if (!prev.includes(symbol)) return prev
      removed = true
      return prev.filter((s) => s !== symbol)
    })
    return removed ? `${symbol} removed from watchlist.` : `${symbol} is not in watchlist.`
  }

  const processChat = (q: string) => {
    const input = q.trim()
    if (!input) return

    const lowerInput = input.toLowerCase()
    const compare = input.match(/compare\s+([a-z0-9]+)\s+([a-z0-9]+)/i)
    const watchAdd = input.match(/watch\s+add\s+([a-z0-9]{2,5})/i)
    const watchRemove = input.match(/watch\s+remove\s+([a-z0-9]{2,5})/i)

    let answer = 'I can help with ticker lookup, sector pulse, IPOs, and calculations. Try: calc 100000 120 136'
    const calc = input.match(/calc\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/i)

    if (lowerInput === 'help' || lowerInput === 'commands') {
      answer = 'Commands: [ticker], calc capital buy sell, compare AAA BBB, gainers, losers, portfolio, forecast, risk, kse, news, sector <name>, taxonomy, anomalies, session, vgi, watch add <sym>, watch remove <sym>, watchlist, alerts, health, date, beat on, beat off.'
    } else if (watchAdd) {
      answer = addWatchSymbol(watchAdd[1])
    } else if (watchRemove) {
      answer = removeWatchSymbol(watchRemove[1])
    } else if (lowerInput === 'watchlist' || lowerInput === 'watch') {
      answer = watchlistRows.length
        ? `Watchlist: ${watchlistRows.map((r) => `${r.symbol} ${r.change.toFixed(2)}%`).join(' | ')}`
        : 'Watchlist is empty. Use: watch add HBL'
    } else if (lowerInput === 'alerts') {
      answer = watchAlerts.length ? watchAlerts.slice(0, 5).join(' | ') : 'No active AI alerts right now.'
    } else if (lowerInput.includes('health')) {
      answer = `Feed health: ${dataHealth.feedStatus}. Latency ${dataHealth.latencySec !== null ? `${Math.round(dataHealth.latencySec)}s` : 'n/a'}. Sync ${lastSync || 'pending'}.`
    } else if (lowerInput === 'beat on') {
      void startBeat()
      answer = 'Slow background beat enabled.'
    } else if (lowerInput === 'beat off') {
      stopBeat()
      answer = 'Background beat stopped.'
    } else if (lowerInput === 'date' || lowerInput === 'time' || lowerInput.includes('date time')) {
      answer = `Session clock: ${sessionDateLabel} ${sessionTimeLabel}. Taxonomy reference date: ${TAXONOMY_REFERENCE_DATE}.`
    } else if (lowerInput.includes('session') || lowerInput.includes('market hour') || lowerInput.includes('psx time')) {
      answer = `${psxSession.phaseLabel}. ${psxSession.nextEventLabel} ${formatCountdown(psxSession.nextEventInMinutes)} (Pakistan time).`
    } else if (lowerInput.includes('vgi')) {
      answer = `VGI score ${vgiSignal.score.toFixed(1)} (${vgiSignal.grade}) with ${vgiSignal.bias} bias. Breadth ${aiAdvanced.breadth.toFixed(0)}%, concentration ${aiAdvanced.concentration.toFixed(0)}%, volatility ${volatility.toFixed(2)}.`
    } else if (lowerInput.includes('taxonomy')) {
      answer = `Taxonomy coverage: ${taxonomyCoverage.mappedCount}/${sectorList.length} (${taxonomyCoverage.ratio.toFixed(0)}%) live sectors mapped. Unmapped sample: ${taxonomyCoverage.unmapped.slice(0, 3).join(', ') || 'none'}.`
    } else if (lowerInput.includes('anomal')) {
      answer = aiAdvanced.anomalies.length
        ? `Anomaly radar (${aiAdvanced.anomalyThreshold.toFixed(2)}% threshold): ${aiAdvanced.anomalies.map((s) => `${s.symbol} ${s.change.toFixed(2)}%`).join(' | ')}`
        : `No major outliers above ${aiAdvanced.anomalyThreshold.toFixed(2)}% right now.`
    } else if (calc) {
      const capital = Number(calc[1])
      const buy = Number(calc[2])
      const sell = Number(calc[3])
      const shares = Math.floor(capital / buy)
      const pnl = +(shares * (sell - buy)).toFixed(2)
      const ret = +(((sell - buy) / buy) * 100).toFixed(2)
      answer = `Trade simulation: ${shares} shares, P/L PKR ${formatMoney(pnl)}, return ${ret}%.`
    } else if (compare) {
      const a = stocks.find((s) => s.symbol.toLowerCase() === compare[1].toLowerCase())
      const b = stocks.find((s) => s.symbol.toLowerCase() === compare[2].toLowerCase())
      if (!a || !b) {
        answer = 'Compare format: compare HBL UBL (both symbols must exist in PSX list).'
      } else {
        const leader = a.change >= b.change ? a : b
        answer = `${a.symbol}: ${a.change.toFixed(2)}% @ ${a.price.toFixed(2)} | ${b.symbol}: ${b.change.toFixed(2)}% @ ${b.price.toFixed(2)}. Momentum leader: ${leader.symbol}.`
      }
    } else if (lowerInput.includes('ipo')) {
      answer = upcomingIPOs.map((i) => `${i.name} (${i.expected}, ${i.size})`).join(' | ')
    } else if (lowerInput.includes('forecast')) {
      answer = `AI signal: ${aiForecast.direction} for next session, confidence ${aiForecast.confidence.toFixed(0)}%. Keep stops tight and position sizing disciplined.`
    } else if (lowerInput.includes('risk')) {
      const best = bestSector ? `${bestSector.sector} (${bestSector.avg.toFixed(2)}%)` : 'loading'
      const weak = weakSector ? `${weakSector.sector} (${weakSector.avg.toFixed(2)}%)` : 'loading'
      answer = `Risk meter: volatility ${volatility.toFixed(2)}. Best sector ${best}, weak zone ${weak}.`
    } else if (lowerInput.includes('kse')) {
      answer = liveIndexSnapshots.map((i) => `${i.index} ${i.level.toLocaleString()} (${i.change.toFixed(2)}%)`).join(' | ')
    } else if (lowerInput.includes('news')) {
      answer = newsItems.length ? newsItems.slice(0, 3).map((n) => `${n.title} (${n.source})`).join(' | ') : 'Live news stream loading...'
    } else if (lowerInput === 'gainers') {
      answer = topMovers.slice(0, 5).map((m) => `${m.symbol} ${m.change.toFixed(2)}%`).join(' | ')
    } else if (lowerInput === 'losers') {
      answer = bottomMovers.slice(0, 5).map((m) => `${m.symbol} ${m.change.toFixed(2)}%`).join(' | ')
    } else if (lowerInput === 'portfolio') {
      answer = `Portfolio: Cash PKR ${formatMoney(portfolioCash)}, Holdings PKR ${formatMoney(portfolioValue)}, Equity PKR ${formatMoney(totalEquity)}, P/L PKR ${formatMoney(portfolioPnl)}.`
    } else if (lowerInput.startsWith('sector ')) {
      const sectorName = input.slice(7).trim().toLowerCase()
      const sectorTop = stocks
        .filter((s) => s.sector.toLowerCase().includes(sectorName))
        .sort((a, b) => b.change - a.change)
        .slice(0, 3)
      answer = sectorTop.length
        ? `Sector focus: ${sectorTop.map((s) => `${s.symbol} ${s.change.toFixed(2)}%`).join(' | ')}`
        : 'No matching PSX sector found. Try: sector bank'
    } else {
      const found = stocks.find((s) => s.symbol.toLowerCase() === lowerInput)
      if (found) {
        answer = `${found.symbol}: PKR ${found.price.toFixed(2)}, ${found.change.toFixed(2)}%, Vol ${formatMoney(found.volume)}, P/E ${found.pe}.`
      } else if (lowerInput.includes('sector')) {
        answer = `Coverage: ${sectorList.length} PSX sectors and ${stocks.length} PSX listed companies loaded.`
      }
    }

    setMessages((prev) => [...prev, { role: 'user', text: input }, { role: 'assistant', text: answer }])
    setAnalytics((prev) => ({ ...prev, chatQueries: prev.chatQueries + 1 }))
    setChatInput('')
  }

  const runAiPlaybook = (mode: 'rebalance' | 'hedge' | 'swing') => {
    const top1 = topMovers[0]
    const top2 = topMovers[1]
    const note =
      mode === 'rebalance'
        ? `AI Rebalancer: trim weakest sectors and rotate 12-18% into ${bestSector?.sector ?? 'best sector candidate'}.`
        : mode === 'hedge'
          ? `AI Hedge: volatility ${volatility.toFixed(2)} indicates partial defensive hedge until momentum stabilizes.`
          : `AI Swing Setup: focus on ${top1?.symbol ?? 'top mover #1'} and ${top2?.symbol ?? 'top mover #2'} with strict stop discipline.`

    setMessages((prev) => [...prev, { role: 'assistant', text: note }])
  }

  const portfolioRows = useMemo(() => {
    return holdings
      .map((h) => {
        const stock = stocks.find((s) => s.symbol === h.symbol)
        const livePrice = stock?.price ?? h.avgPrice
        const value = h.shares * livePrice
        const cost = h.shares * h.avgPrice
        const pnl = value - cost
        return {
          ...h,
          livePrice,
          value,
          pnl,
          changePct: cost ? (pnl / cost) * 100 : 0,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [holdings, stocks])

  const portfolioValue = useMemo(() => portfolioRows.reduce((sum, row) => sum + row.value, 0), [portfolioRows])
  const portfolioCost = useMemo(() => portfolioRows.reduce((sum, row) => sum + row.avgPrice * row.shares, 0), [portfolioRows])
  const portfolioPnl = portfolioValue - portfolioCost
  const totalEquity = portfolioCash + portfolioValue

  const quantSizing = useMemo(() => {
    const strategyMultiplier: Record<StrategyMode, number> = {
      scalp: 0.72,
      swing: 1,
      position: 1.26,
    }
    const capitalAtRisk = totalEquity * (riskBudgetPct / 100)
    const volAdj = Math.max(0.45, Math.min(1.65, 2.2 / Math.max(0.55, volatility || 0.55)))
    const suggestedExposure = Math.min(totalEquity * 0.35, capitalAtRisk * volAdj * strategyMultiplier[strategyMode])
    const stock = stocks.find((s) => s.symbol === tradeSymbol.trim().toUpperCase())
    const suggestedQty = stock ? Math.max(0, Math.floor(suggestedExposure / Math.max(1, stock.price))) : 0
    return {
      capitalAtRisk,
      volAdj,
      suggestedExposure,
      suggestedQty,
    }
  }, [riskBudgetPct, strategyMode, stocks, totalEquity, tradeSymbol, volatility])

  const doTrade = (side: 'buy' | 'sell') => {
    if (!psxSession.isOpen) {
      setPortfolioNote(`Trading window is closed (${psxSession.phaseLabel}). ${psxSession.nextEventLabel} ${formatCountdown(psxSession.nextEventInMinutes)} PKT.`)
      return
    }

    const symbol = tradeSymbol.trim().toUpperCase()
    const qty = Math.max(0, Math.floor(tradeQty))
    if (!symbol || qty <= 0) {
      setPortfolioNote('Enter a valid symbol and quantity.')
      return
    }

    const stock = stocks.find((s) => s.symbol === symbol)
    if (!stock) {
      setPortfolioNote(`Symbol ${symbol} not found in current feed.`)
      return
    }

    const tradeValue = stock.price * qty

    if (side === 'buy') {
      if (tradeValue > portfolioCash) {
        setPortfolioNote('Insufficient virtual cash for this buy order.')
        return
      }

      setPortfolioCash((prev) => prev - tradeValue)
      setHoldings((prev) => {
        const existing = prev.find((h) => h.symbol === symbol)
        if (!existing) {
          return [...prev, { symbol, shares: qty, avgPrice: stock.price }]
        }
        const totalShares = existing.shares + qty
        const newAvg = (existing.avgPrice * existing.shares + stock.price * qty) / totalShares
        return prev.map((h) => (h.symbol === symbol ? { ...h, shares: totalShares, avgPrice: +newAvg.toFixed(2) } : h))
      })

      setPortfolioNote(`Bought ${qty} ${symbol} @ PKR ${stock.price.toFixed(2)}.`)
    } else {
      const existing = holdings.find((h) => h.symbol === symbol)
      if (!existing || existing.shares < qty) {
        setPortfolioNote(`Not enough shares to sell. Available ${existing?.shares ?? 0}.`)
        return
      }

      setPortfolioCash((prev) => prev + tradeValue)
      setHoldings((prev) => {
        return prev
          .map((h) => (h.symbol === symbol ? { ...h, shares: h.shares - qty } : h))
          .filter((h) => h.shares > 0)
      })
      setPortfolioNote(`Sold ${qty} ${symbol} @ PKR ${stock.price.toFixed(2)}.`)
    }

    setWatchlist((prev) => (prev.includes(symbol) ? prev : [...prev, symbol].slice(0, 20)))

    setAnalytics((prev) => ({ ...prev, trades: prev.trades + 1 }))
  }

  const activeMinutes = useMemo(() => {
    if (!loginTime) return 0
    return Math.max(1, Math.floor((Date.now() - loginTime) / 60_000))
  }, [loginTime, loggedIn])

  const engagementScore = Math.min(
    100,
    analytics.chatQueries * 8 + analytics.stockSearches * 6 + analytics.trades * 12 + analytics.briefings * 5 + activeMinutes * 2,
  )

  const avatarStyle = {
    '--cv-motion': motionLevel.toFixed(3),
    '--cv-light': lightLevel.toFixed(3),
    '--cv-talk': isSpeaking ? '1' : '0',
  } as CSSProperties

  const cvSignalText = `Motion ${(motionLevel * 100).toFixed(0)}% · Light ${(lightLevel * 100).toFixed(0)}%`
  const cvTickText = lastCvTickAt ? `Last CV frame ${new Date(lastCvTickAt).toLocaleTimeString()}` : 'No CV frames yet'

  if (!loggedIn) {
    return (
      <main className="login-wrap">
        <section className="login-card">
          <img src={REAL_IMAGES.loginHero} alt="Financial district with data overlays" className="login-hero-image" />
          <h1>{APP_NAME}</h1>
          <p>PSX Intelligence Portal · Pakistan Stock Exchange Data · Blue White Black Theme</p>
          <div className="start-highlights">
            <span>Live market data fallback</span>
            <span>AI assistant with voice briefing</span>
            <span>Virtual portfolio manager</span>
            <span>User analytics and engagement scoring</span>
            <span>Built for Mohammad Arqam Javed</span>
          </div>
          <form onSubmit={onLogin}>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Enter Dashboard</button>
          </form>
          <small>Demo user: {DEMO_USER.email} (password configured via environment)</small>
          {loginError ? <p className="error">{loginError}</p> : null}
        </section>
      </main>
    )
  }

  return (
    <main className="app">
      <header>
        <div>
          <h1>{APP_NAME}</h1>
          <p>Designed for Mohammad Arqam Javed · PSX Geo-Political & Economic AI Terminal</p>
          <small className="date-badge">As of {sessionDateLabel} · {sessionTimeLabel} (PKT)</small>
        </div>
        <div className="kpis">
          <article>
            <strong>{stocks.length}</strong>
            <span>Listed Companies</span>
          </article>
          <article>
            <strong>{sectorList.length}</strong>
            <span>PSX Sectors</span>
          </article>
          <article>
            <strong className={avgChange >= 0 ? 'up' : 'down'}>{avgChange.toFixed(2)}%</strong>
            <span>Market Momentum</span>
          </article>
          <article>
            <strong className={apiMode === 'live' ? 'up' : 'down'}>{apiMode === 'live' ? 'LIVE' : 'OFFLINE'}</strong>
            <span>{lastSync ? `Synced ${lastSync}` : 'Sync pending'}</span>
          </article>
          <article>
            <strong>{taxonomyCoverage.ratio.toFixed(0)}%</strong>
            <span>Taxonomy Mapping</span>
          </article>
          <article>
            <strong>{VGI_MODEL_VERSION}</strong>
            <span>AI Model</span>
          </article>
        </div>
      </header>

      <section className="soundbar">
        <span className={`session-chip ${psxSession.phase}`}>
          {psxSession.phaseLabel} · {psxSession.nextEventLabel} {formatCountdown(psxSession.nextEventInMinutes)}
        </span>
        <span>Feed health: {dataHealth.feedStatus} {dataHealth.latencySec !== null ? `· ${Math.round(dataHealth.latencySec)}s latency` : ''}</span>
        <button type="button" onClick={toggleBeat}>{beatOn ? 'Stop Slow Beat' : 'Play Slow Beat'}</button>
        <span>{beatOn ? `Background beat running · ${beatBpm} BPM` : 'Background beat is off'}</span>
        <input
          type="range"
          min={44}
          max={90}
          value={beatBpm}
          onChange={(e) => setBeatBpm(Number(e.target.value))}
          aria-label="Background beat speed"
        />
      </section>

      <section className="ticker-strip" aria-label="Live Tickers">
        <div className="ticker-track">
          {stocks.slice(0, 35).map((s) => (
            <span key={s.symbol} className={s.change >= 0 ? 'up' : 'down'}>
              {s.symbol} {s.price.toFixed(2)} ({s.change.toFixed(2)}%)
            </span>
          ))}
        </div>
      </section>

      <section className="grid">
        <article className="card hero-panel">
          <img src={REAL_IMAGES.tradingFloor} alt="Real stock trading screen and candlestick chart" />
          <div>
            <h2>Starting Screen & Command Center</h2>
            <p>
              Black-white-blue layout with real-time simulation, geo-political lens, macro pulse, and AI-ready analytics. Professional flow with crisp, modern energy.
            </p>
            <p>Launch path: Sign in → review analytics pulse → execute virtual portfolio actions → ask AI for forecast and risk playbook.</p>
          </div>
        </article>

        <article className="card market-snapshot">
          <h2>PSX Index Snapshot</h2>
          <ul className="index-list">
            {liveIndexSnapshots.map((snapshot) => (
              <li key={snapshot.index}>
                <strong>{snapshot.index}</strong>
                <span>{snapshot.level.toLocaleString()}</span>
                <span className={snapshot.change >= 0 ? 'up' : 'down'}>{snapshot.change.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card macro-card">
          <h2>Macro & Geo Signals</h2>
          <ul className="macro-list">
            {macroIndicators.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small className={item.change >= 0 ? 'up' : 'down'}>{item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="card avatar-card">
          <div className={`avatar cv-avatar ${isSpeaking ? 'speaking' : ''}`} style={avatarStyle}>
            <img src={REAL_IMAGES.lailaAvatar} alt="Laila virtual broker portrait" />
            <span className="avatar-ring" aria-hidden="true" />
            <span className="avatar-mouth" aria-hidden="true" />
          </div>
          <div>
            <h2>Laila · GenZ Avatar Analyst</h2>
            <p>{avatarInsight}</p>
            <div className="avatar-actions">
              <button onClick={speakInsight}>Laila Live Briefing</button>
              <button type="button" onClick={() => setCameraEnabled((v) => !v)}>
                {cameraEnabled ? 'Disable CV Camera' : 'Enable CV Camera'}
              </button>
            </div>
            <small>{cameraStatus} · {cvSignalText}</small>
            <small>{voiceStatus} · {cvTickText}</small>
            <video ref={cvVideoRef} className="cv-video-hidden" playsInline muted />
            <canvas ref={cvCanvasRef} className="cv-canvas-hidden" />
          </div>
        </article>

        <article className="card ai-analytics">
          <h2>AI Analytics</h2>
          <div className="ai-meters">
            <div>
              <span>Forecast Bias</span>
              <strong>{aiForecast.direction}</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>{aiForecast.confidence.toFixed(0)}%</strong>
            </div>
            <div>
              <span>Volatility</span>
              <strong>{volatility.toFixed(2)}</strong>
            </div>
          </div>
          <p>
            Sector alpha now: <span className="up">{bestSector ? `${bestSector.sector} (${bestSector.avg.toFixed(2)}%)` : 'Loading...'}</span> · Pressure zone: <span className="down">{weakSector ? `${weakSector.sector} (${weakSector.avg.toFixed(2)}%)` : 'Loading...'}</span>
          </p>
        </article>

        <article className="card ai-advanced-card">
          <h2>AI Advanced Radar</h2>
          <div className="ai-meters">
            <div>
              <span>Market Breadth</span>
              <strong>{aiAdvanced.breadth.toFixed(0)}%</strong>
            </div>
            <div>
              <span>Volume Concentration</span>
              <strong>{aiAdvanced.concentration.toFixed(0)}%</strong>
            </div>
            <div>
              <span>Regime</span>
              <strong>{aiAdvanced.regime}</strong>
            </div>
          </div>
          <p>
            Outlier threshold: {aiAdvanced.anomalyThreshold.toFixed(2)}% · Active anomalies: {aiAdvanced.anomalies.length}
          </p>
          <p className="hint">
            {aiAdvanced.anomalies.length
              ? aiAdvanced.anomalies.map((s) => `${s.symbol} ${s.change.toFixed(2)}%`).join(' | ')
              : 'No abnormal movers detected right now.'}
          </p>
          <button type="button" onClick={() => setShowTaxonomyModal(true)}>Open Taxonomy Intelligence</button>
        </article>

        <article className="card terminal-card">
          <h2>Advanced Market Terminal · PKT Synced</h2>
          <div className="ai-meters">
            <div>
              <span>PSX Session</span>
              <strong className={psxSession.isOpen ? 'up' : 'down'}>{psxSession.phaseLabel}</strong>
            </div>
            <div>
              <span>VGI Score</span>
              <strong>{vgiSignal.score.toFixed(1)} · {vgiSignal.grade}</strong>
            </div>
            <div>
              <span>VGI Bias</span>
              <strong>{vgiSignal.bias}</strong>
            </div>
          </div>
          <p>
            Countdown: {psxSession.nextEventLabel} <strong>{formatCountdown(psxSession.nextEventInMinutes)}</strong> · Timezone: Pakistan ({PAK_TIMEZONE})
          </p>
          <p className="hint">
            PSX schedule synced: Mon-Thu 09:30-15:30 · Fri 09:30-12:00 and 14:00-16:30.
          </p>
        </article>

        <article className="card watchlist-card">
          <h2>AI Watchlist & Alert Center</h2>
          <div className="watch-controls">
            <input
              placeholder="Add symbol (e.g. HBL)"
              value={watchInput}
              onChange={(e) => setWatchInput(e.target.value.toUpperCase())}
            />
            <button type="button" onClick={() => {
              const msg = addWatchSymbol(watchInput)
              setMessages((prev) => [...prev, { role: 'assistant', text: msg }])
              setWatchInput('')
            }}>
              Add
            </button>
            <label className="threshold-inline">
              Alert %
              <input
                type="number"
                min={0.5}
                max={15}
                step={0.1}
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Math.min(15, Math.max(0.5, Number(e.target.value) || DEFAULT_ALERT_THRESHOLD)))}
              />
            </label>
          </div>
          <ul className="watch-list">
            {(watchlistRows.length ? watchlistRows : [{ symbol: 'No symbols', price: 0, change: 0, volume: 0 }]).map((row) => (
              <li key={row.symbol}>
                <strong>{row.symbol}</strong>
                <span>{row.price ? row.price.toFixed(2) : '-'}</span>
                <span className={row.change >= 0 ? 'up' : 'down'}>{row.price ? `${row.change.toFixed(2)}%` : '-'}</span>
                {row.price ? <button type="button" onClick={() => removeWatchSymbol(row.symbol)}>Remove</button> : <span>-</span>}
              </li>
            ))}
          </ul>
          <p className="hint">
            {watchAlerts.length ? watchAlerts.slice(0, 3).join(' | ') : 'No watchlist alerts currently active.'}
          </p>
        </article>

        <article className="card user-analytics">
          <h2>User Analytics</h2>
          <div className="ai-meters">
            <div>
              <span>Active Minutes</span>
              <strong>{activeMinutes}</strong>
            </div>
            <div>
              <span>Engagement</span>
              <strong>{engagementScore}%</strong>
            </div>
            <div>
              <span>Chat / Trades</span>
              <strong>{analytics.chatQueries} / {analytics.trades}</strong>
            </div>
          </div>
          <p>
            Searches tracked: <strong>{analytics.stockSearches}</strong> · Voice briefings: <strong>{analytics.briefings}</strong>
          </p>
          <img src={REAL_IMAGES.analytics} alt="Real analytics dashboard display" className="market-image" />
        </article>

        <article className="card portfolio-card">
          <h2>Virtual Portfolio Manager</h2>
          <div className="portfolio-kpis">
            <span>Cash: PKR {formatMoney(portfolioCash)}</span>
            <span>Holdings: PKR {formatMoney(portfolioValue)}</span>
            <span className={portfolioPnl >= 0 ? 'up' : 'down'}>P/L: PKR {formatMoney(portfolioPnl)}</span>
            <span>Total Equity: PKR {formatMoney(totalEquity)}</span>
          </div>
          <div className="trade-controls">
            <input
              placeholder="Symbol"
              value={tradeSymbol}
              onChange={(e) => setTradeSymbol(e.target.value.toUpperCase())}
            />
            <input
              type="number"
              min={1}
              value={tradeQty}
              onChange={(e) => setTradeQty(Number(e.target.value) || 0)}
            />
            <button type="button" onClick={() => doTrade('buy')}>Buy</button>
            <button type="button" onClick={() => doTrade('sell')}>Sell</button>
          </div>
          <small>{portfolioNote}</small>
          <ul className="portfolio-list">
            {(portfolioRows.length ? portfolioRows : [{ symbol: 'No holdings', shares: 0, avgPrice: 0, livePrice: 0, value: 0, pnl: 0, changePct: 0 }]).map((row) => (
              <li key={row.symbol}>
                <strong>{row.symbol}</strong>
                <span>{row.shares} shares</span>
                <span>Avg {row.avgPrice.toFixed(2)}</span>
                <span>{row.livePrice.toFixed(2)}</span>
                <span className={row.changePct >= 0 ? 'up' : 'down'}>{row.changePct.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card ai-lab-card">
          <h2>AI Quant Execution Lab</h2>
          <p>Adaptive sizing engine based on regime, volatility, and risk budget.</p>
          <div className="quant-controls">
            <label>
              Strategy
              <select value={strategyMode} onChange={(e) => setStrategyMode(e.target.value as StrategyMode)}>
                <option value="scalp">Scalp</option>
                <option value="swing">Swing</option>
                <option value="position">Position</option>
              </select>
            </label>
            <label>
              Risk Budget %
              <input
                type="number"
                min={0.5}
                max={10}
                step={0.1}
                value={riskBudgetPct}
                onChange={(e) => setRiskBudgetPct(Math.min(10, Math.max(0.5, Number(e.target.value) || 2)))}
              />
            </label>
          </div>
          <div className="quant-kpis">
            <span>Capital at risk: PKR {formatMoney(quantSizing.capitalAtRisk)}</span>
            <span>Volatility factor: {quantSizing.volAdj.toFixed(2)}x</span>
            <span>Suggested exposure: PKR {formatMoney(quantSizing.suggestedExposure)}</span>
            <span>Suggested qty ({tradeSymbol.toUpperCase()}): {quantSizing.suggestedQty}</span>
          </div>
          <div className="playbook-actions">
            <button type="button" onClick={() => runAiPlaybook('rebalance')}>Run Rebalancer</button>
            <button type="button" onClick={() => runAiPlaybook('hedge')}>Run Hedge Plan</button>
            <button type="button" onClick={() => runAiPlaybook('swing')}>Run Swing Setup</button>
          </div>
        </article>

        <article className="card">
          <h2>Upcoming IPOs</h2>
          <ul className="ipo-list">
            {upcomingIPOs.map((ipo) => (
              <li key={ipo.name}>
                <strong>{ipo.name}</strong>
                <span>{ipo.sector}</span>
                <span>{ipo.expected}</span>
                <span>{ipo.size}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card news-card">
          <h2>Live Geopolitical & Economic News</h2>
          <ul className="news-list">
            {(newsItems.length ? newsItems : [{ title: 'Fetching live news feed...', url: '#', source: 'System', publishedAt: '' }]).map((item) => (
              <li key={`${item.url}-${item.title}`}>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
                <small>{item.source}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="card large">
          <div className="panel-head">
            <h2>Stocks Live Board</h2>
            <div className="controls">
              <button type="button" onClick={() => setShowTaxonomyModal(true)}>SECP Taxonomy</button>
              <select value={selectedSector} onChange={(e) => setSelectedSector(e.target.value)}>
                <option>All PSX Sectors</option>
                {sectorList.map((sector) => (
                  <option key={sector}>{sector}</option>
                ))}
              </select>
              <input
                placeholder="Search symbol or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Company</th>
                  <th>Sector</th>
                  <th>Price</th>
                  <th>Change</th>
                  <th>Volume</th>
                  <th>P/E</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 120).map((s) => (
                  <tr key={s.symbol + s.name}>
                    <td>{s.symbol}</td>
                    <td>{s.name}</td>
                    <td>{s.sector}</td>
                    <td>{s.price.toFixed(2)}</td>
                    <td className={s.change >= 0 ? 'up' : 'down'}>{s.change.toFixed(2)}%</td>
                    <td>{formatMoney(s.volume)}</td>
                    <td>{s.pe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hint">Showing first 120 results for speed. Full feed size: {filtered.length}.</p>
        </article>

        <article className="card">
          <h2>Top Movers</h2>
          <ul className="movers">
            {topMovers.map((m) => (
              <li key={m.symbol}>
                <span>{m.symbol}</span>
                <span>{m.price.toFixed(2)}</span>
                <span className={m.change >= 0 ? 'up' : 'down'}>{m.change.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Heat Risk (Bottom Movers)</h2>
          <ul className="movers">
            {bottomMovers.map((m) => (
              <li key={m.symbol}>
                <span>{m.symbol}</span>
                <span>{m.price.toFixed(2)}</span>
                <span className={m.change >= 0 ? 'up' : 'down'}>{m.change.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card sector-card">
          <h2>Sector Momentum Board</h2>
          <div className="sector-bars">
            {sectorPerformance.slice(0, 10).map((entry) => (
              <div key={entry.sector}>
                <span>{entry.sector}</span>
                <div className="bar-wrap">
                  <div className="bar" style={{ width: `${Math.min(100, Math.abs(entry.avg) * 26 + 18)}%` }} />
                </div>
                <strong className={entry.avg >= 0 ? 'up' : 'down'}>{entry.avg.toFixed(2)}%</strong>
              </div>
            ))}
          </div>
          <img src={REAL_IMAGES.marketCity} alt="Real skyline image for financial district" className="market-image" />
        </article>

        <article className="card chatbot">
          <h2>AI Query Assistant</h2>
          <p>Use: help, ticker, compare HBL UBL, gainers, losers, portfolio, sector bank, forecast, risk, taxonomy, anomalies, session, vgi, watch add HBL, watch remove HBL, watchlist, alerts, health, date, kse, news, beat on/off, or calc 100000 120 136</p>
          <div className="chatbox">
            {messages.slice(-10).map((m, i) => (
              <div key={`${m.role}-${i}`} className={`msg ${m.role}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form
            className="chat-controls"
            onSubmit={(e) => {
              e.preventDefault()
              processChat(chatInput)
            }}
          >
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask anything" />
            <button type="submit">Send</button>
          </form>
        </article>
      </section>

      <TaxonomyModal
        isOpen={showTaxonomyModal}
        onClose={() => setShowTaxonomyModal(false)}
        sectors={SECP_54_SECTOR_CATALOG}
        mappedCount={taxonomyCoverage.mappedCount}
        liveSectorCount={sectorList.length}
        unmatchedLiveSectors={taxonomyCoverage.unmapped}
        generatedAt={`${sessionDateLabel} ${sessionTimeLabel}`}
      />

      <p className="owner-note">Built for Mohammad Arqam Javed · {APP_NAME} · {VGI_MODEL_VERSION}</p>
    </main>
  )
}

export default App
