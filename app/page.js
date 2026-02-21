'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, TrendingDown, Star, ShoppingCart, RefreshCw, Github, Heart, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

// Store configurations with logo paths
const AVAILABLE_STORES = [
  { name: 'Amazon', color: '#FF9900', logo: '/amazon-logo.png' },
  { name: 'Walmart', color: '#0071CE', logo: '/walmart-logo.jpg' },
  { name: 'eBay', color: '#E53238', logo: '/ebay-logo.png' },
  { name: 'Best Buy', color: '#0046BE', logo: '/bestbuy-logo.png' },
]

export default function LivePriceComparator() {
  const [query, setQuery] = useState('')
  const [selectedStores, setSelectedStores] = useState(['Amazon', 'Walmart', 'eBay', 'Best Buy'])
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [searchProgress, setSearchProgress] = useState(0)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredStore, setHoveredStore] = useState(null)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [hoveredFooterLink, setHoveredFooterLink] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRefs = useRef({})
  const containerRef = useRef(null)

  // Track mouse position for global glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getBackgroundStyle = () => {
    const hue1 = 220 - (scrollProgress * 0.3)
    const hue2 = 270 + (scrollProgress * 0.2)
    const hue3 = 220 + (scrollProgress * 0.4)
    
    return {
      background: `linear-gradient(135deg, 
        hsl(${hue1}, 60%, 8%) 0%, 
        hsl(${hue2}, 50%, 5%) 50%, 
        hsl(${hue3}, 55%, 10%) 100%)`,
      transition: 'background 0.3s ease-out',
    }
  }

  const toggleStore = (storeName) => {
    setSelectedStores(prev => 
      prev.includes(storeName) 
        ? prev.filter(s => s !== storeName)
        : [...prev, storeName]
    )
  }

  const performLiveSearch = async () => {
    if (!query.trim() || selectedStores.length === 0) return
    setLoading(true)
    setSearchResults(null)
    setSearchProgress(0)
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 15, 90))
    }, 200)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, stores: selectedStores })
      })
      const data = await response.json()
      if (data.success) {
        const processedResults = processResults(data)
        setSearchResults({ ...data, results: processedResults })
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      clearInterval(progressInterval)
      setSearchProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  const processResults = (data) => {
    if (!data.results) return []
    const amazonResults = data.results.filter(r => r.store === 'Amazon').map(r => ({ ...r, apiSource: 'rapidapi' }))
    const serperResults = data.results.filter(r => r.store !== 'Amazon').map(r => ({ ...r, apiSource: 'serper' }))
    const sortByPrice = (a, b) => a.price - b.price
    amazonResults.sort(sortByPrice)
    serperResults.sort(sortByPrice)
    const allResults = [...amazonResults, ...serperResults]
    if (allResults.length > 0) {
      const minPrice = Math.min(...allResults.map(r => r.price))
      allResults.forEach(r => { r.isBestDeal = r.price === minPrice })
    }
    return allResults
  }

  const getStoreConfig = (storeName) => {
    return AVAILABLE_STORES.find(s => s.name === storeName) || { name: storeName, color: '#666666', logo: null }
  }

  const StoreLogo = ({ storeName, size = 'normal' }) => {
    const config = getStoreConfig(storeName)
    const dimensions = size === 'small' ? { width: 40, height: 40 } : { width: 56, height: 56 }
    if (!config.logo) return <div style={{width: dimensions.width, height: dimensions.height, borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: config.color}}>{storeName[0]}</div>
    return (
      <div style={{width: dimensions.width, height: dimensions.height, borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', overflow: 'hidden', border: `2px solid ${config.color}40`}}>
        <Image src={config.logo} alt={storeName} width={dimensions.width - 8} height={dimensions.height - 8} style={{ objectFit: 'contain' }} />
      </div>
    )
  }

  const StoreChipLogo = ({ storeName }) => {
    const config = getStoreConfig(storeName)
    if (!config.logo) return <span style={{ fontSize: '16px', fontWeight: 'bold', color: config.color }}>{storeName[0]}</span>
    return (
      <div style={{width: '28px', height: '28px', borderRadius: '6px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', overflow: 'hidden'}}>
        <Image src={config.logo} alt={storeName} width={24} height={24} style={{ objectFit: 'contain' }} />
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{...styles.container, ...getBackgroundStyle()}}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
        @keyframes glowPulse { 0%, 100% { opacity: 0.25; } 50% { opacity: 0.4; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes badgePulse { 0%, 100% { box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4); } 50% { box-shadow: 0 4px 25px rgba(34, 197, 94, 0.7); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .card-enter { animation: slideIn 0.5s ease-out forwards; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Mouse Glow */}
      <div style={{position: 'fixed', left: mousePosition.x - 150, top: mousePosition.y - 150, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.08) 40%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 1, transition: 'left 0.1s ease-out, top 0.1s ease-out', filter: 'blur(40px)'}} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Image 
                src="/site-logo.svg" 
                alt="PriceWise Logo" 
                width={38} 
                height={38} 
              />
            </div>
            <div>
              <h1 style={styles.logoText}>PriceWise Live</h1>
              <div style={styles.liveIndicator}>
                <span style={styles.pulseDot}></span>
                LIVE SEARCH
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>Find the <span style={styles.gradientText}>Best Price</span> Live</h2>
        <div style={styles.searchContainer}>
          <div style={styles.searchGlow} />
          <div style={{...styles.searchBar, ...(isSearchFocused ? styles.searchBarFocused : {})}}>
            <Search size={24} color="#64748b" style={{marginLeft: '12px'}} />
            <input
              type="text" placeholder="Search products (e.g., iPhone 15 Pro)..." style={styles.searchInput}
              value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performLiveSearch()}
              onFocus={() => setIsSearchFocused(true)} onBlur={() => setIsSearchFocused(false)}
            />
            <button 
              onClick={performLiveSearch} disabled={loading}
              style={{...styles.searchButton, opacity: loading ? 0.6 : 1}}
            >
              {loading ? <RefreshCw size={20} className="spin" /> : <Search size={20} />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {loading && <div style={styles.loadingBar}><div style={{...styles.loadingProgress, width: `${searchProgress}%`}} /></div>}
        </div>

        <div style={styles.storeSelector}>
          {AVAILABLE_STORES.map(store => (
            <button
              key={store.name} onClick={() => toggleStore(store.name)}
              style={{...styles.storeChip(selectedStores.includes(store.name), store.color)}}
            >
              <StoreChipLogo storeName={store.name} /> {store.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      {searchResults && (
        <section style={styles.grid}>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>${searchResults.results[0]?.price}</div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Best Price</div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text'}}>${Math.max(...searchResults.results.map(r => r.price)) - Math.min(...searchResults.results.map(r => r.price))}</div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Max Savings</div>
            </div>
          </div>

          {searchResults.results.map((item, index) => {
            const storeConfig = getStoreConfig(item.store)
            return (
              <div key={item.id} style={styles.resultCard(item.isBestDeal)} className="card-enter">
                {item.isBestDeal && <div style={styles.bestDealBadge}><Sparkles size={12} /> BEST DEAL</div>}
                <StoreLogo storeName={item.store} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h4 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>{item.title}</h4>
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24'}}><Star size={16} fill="#fbbf24" /> {item.rating}</span>
                    <span style={{color: storeConfig.color, fontSize: '12px', fontWeight: 700, padding: '2px 8px', background: `${storeConfig.color}20`, borderRadius: '4px'}}>{item.store}</span>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={styles.priceTag}>${item.price}</div>
                </div>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{background: `linear-gradient(135deg, ${storeConfig.color}, #9333ea)`, color: 'white', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <ShoppingCart size={18} /> Buy
                </a>
              </div>
            )
          })}
        </section>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLinks}>
          <a href="https://github.com/abdullahchishti0335-cyber" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
            <Github size={18} /> Muhammad Abdullah Rajpoot
          </a>
        </div>
        <p>© 2024 PriceWise Live. All rights reserved.</p>
      </footer>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', width: '100%', color: 'white', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' },
  header: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  headerContent: { maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoIcon: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoText: { fontSize: '24px', fontWeight: 900, background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  liveIndicator: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700 },
  pulseDot: { width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' },
  hero: { padding: '64px 24px', textAlign: 'center' },
  heroTitle: { fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, marginBottom: '24px' },
  gradientText: { background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  searchContainer: { position: 'relative', maxWidth: '800px', margin: '0 auto 32px' },
  searchBar: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '8px', display: 'flex', alignItems: 'center' },
  searchInput: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '18px', padding: '12px' },
  searchButton: { background: 'linear-gradient(135deg, #2563eb, #9333ea)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  storeSelector: { display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' },
  storeChip: (selected, color) => ({ padding: '10px 20px', borderRadius: '12px', border: selected ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.1)', background: selected ? `${color}20` : 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }),
  grid: { maxWidth: '1200px', margin: '0 auto', padding: '24px' },
  resultCard: (isBest) => ({ background: 'rgba(255,255,255,0.03)', border: isBest ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '24px', marginBottom: '16px', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '24px', alignItems: 'center', position: 'relative' },),
  priceTag: { fontSize: '32px', fontWeight: 900, color: '#4ade80' },
  bestDealBadge: { position: 'absolute', top: '12px', right: '12px', background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: '9999px', fontSize: '10px', fontWeight: 800, animation: 'badgePulse 2s infinite' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' },
  statCard: { background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' },
  statValue: { fontSize: '32px', fontWeight: 900, color: '#3b82f6' },
  footer: { borderTop: '1px solid rgba(255,255,255,0.1)', padding: '40px 24px', textAlign: 'center', color: '#64748b' },
  footerLink: { color: '#94a3b8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }
}