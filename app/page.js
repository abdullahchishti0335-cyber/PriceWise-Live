'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, TrendingDown, Star, ShoppingCart, RefreshCw, Github, Heart, Sparkles, Zap } from 'lucide-react'

// Store Logos as SVG Components
const StoreLogos = {
  Amazon: () => (
    <svg viewBox="0 0 100 30" style={{ width: '60px', height: '18px' }}>
      <path fill="#FF9900" d="M62.9 26.3c-5.5 4.1-13.5 6.2-20.4 6.2-9.7 0-18.4-3.6-25-9.5-.5-.5 0-1.1.6-.7 7.1 4.1 15.9 6.6 25 6.6 6.1 0 12.9-1.3 19.1-3.9.9-.4 1.7.6.7 1.3z"/>
      <path fill="#FF9900" d="M65.2 23.5c-.7-.9-4.6-.4-6.4-.2-.5.1-.6-.4-.1-.7 3.1-2.2 8.3-1.6 8.9-.8.6.8-.2 6.3-3.1 8.9-.4.4-.9.2-.7-.3.7-1.7 2.2-5.6 1.4-6.9z"/>
      <path fill="#221F1F" d="M58.5 3.5V1c0-.3.2-.5.5-.5h11.5c.3 0 .5.2.5.5v2.1c0 .3-.3.7-.7 1.4l-4.8 6.9c1.8 0 3.7.2 5.4.9.3.1.4.4.4.7v2.6c0 .3-.3.6-.6.5-2.3-1-5.4-1.1-7.9.1-.3.1-.6-.1-.6-.5V12c0-.3 0-.8.3-1.3l5.6-8h-4.9c-.3 0-.5-.2-.5-.5zM21.3 16.6h-3.3c-.3-.1-.5-.3-.5-.5V1.1c0-.3.3-.6.6-.6h3.1c.3 0 .5.3.5.5v1.9h.1c.6-1.8 1.9-2.7 3.8-2.7 1.9 0 3.1.9 3.9 2.7.6-1.8 2.3-2.7 4-2.7 1.2 0 2.5.5 3.3 1.6.9 1.3.7 3.1.7 4.8v9.6c0 .3-.3.6-.6.6h-3.3c-.3-.1-.5-.3-.5-.6V6.8c0-.6.1-2.2-.1-2.7-.2-.7-.7-.9-1.4-.9-.6 0-1.2.4-1.4 1-.3.7-.2 1.9-.2 2.7v8c0 .3-.3.6-.6.6h-3.3c-.3-.1-.5-.3-.5-.6V6.8c0-1.6.2-4-1.7-4-.9 0-1.4.6-1.7 1.5-.3.8-.2 1.9-.2 2.7v8c-.1.3-.4.6-.7.6zM82.3.4c4.9 0 7.5 4.2 7.5 9.5 0 5.1-2.9 9.2-7.5 9.2-4.8 0-7.4-4.2-7.4-9.4 0-5.2 2.7-9.3 7.4-9.3zm.1 3.4c-2.4 0-2.6 3.3-2.6 5.4 0 2-.1 6.5 2.5 6.5 2.5 0 2.7-3.5 2.7-5.7 0-1.4-.1-3.1-.5-4.4-.4-1.2-1.1-1.8-2.1-1.8zM96.1 16.6h-3.3c-.3-.1-.5-.3-.5-.6l.1-15c0-.3.3-.5.6-.5h3.1c.3 0 .5.2.5.4v2.3h.1c.8-2 1.9-2.9 3.8-2.9 1.3 0 2.5.5 3.1 1.7.7 1.2.7 3.3.7 4.8v9.6c0 .3-.3.6-.6.6h-3.3c-.3-.1-.5-.3-.5-.6V6.6c0-1.7.2-4.1-1.7-4.1-.7 0-1.2.5-1.5 1.1-.4.9-.4 1.8-.4 2.8v8.2c0 .3-.3.6-.6.6zM47.5 9.4c0 1.4.1 2.6-.6 3.9-.6.9-1.5 1.5-2.5 1.5-1.4 0-2.2-1.1-2.2-2.6 0-3.1 2.7-3.6 5.3-3.6v.8zm3.3 8c-.2.2-.5.2-.7.1-1-.8-1.2-1.2-1.7-2-1.6 1.7-2.8 2.2-4.9 2.2-2.5 0-4.4-1.5-4.4-4.6 0-2.4 1.3-4 3.2-4.8 1.6-.7 3.9-.8 5.6-1v-.4c0-.7.1-1.5-.3-2.1-.4-.5-1.1-.7-1.7-.7-1.2 0-2.2.6-2.5 1.8-.1.3-.3.6-.6.6l-3.2-.4c-.3-.1-.6-.3-.5-.7.8-4.1 4.4-5.3 7.7-5.3 1.7 0 3.8.5 5.1 1.7 1.7 1.6 1.5 3.7 1.5 6v5.4c0 1.6.7 2.3 1.3 3.2.2.3.3.7-.1.9-.8.7-2.2 1.9-3 2.6z"/>
    </svg>
  ),
  Walmart: () => (
    <svg viewBox="0 0 100 24" style={{ width: '70px', height: '16px' }}>
      <path fill="#0071CE" d="M8.8 1.5L6.1 16.8 3.5 1.5H0l4.5 21h3.3l2.6-15.3L12.9 22.5h3.3l4.5-21h-3.5L14.6 16.8 11.9 1.5zM23.1 7.8c-2.8 0-5.1 2-5.1 5.6 0 4.2 2.6 6.1 5.5 6.1 2.8 0 5.1-2 5.1-5.6 0-4.2-2.6-6.1-5.5-6.1zm.2 9c-1.3 0-2.2-1.2-2.2-3.5 0-2.2.9-3.3 2.2-3.3 1.3 0 2.2 1.2 2.2 3.3 0 2.3-.9 3.5-2.2 3.5zM35.3 7.8c-1.4 0-2.6.7-3.2 1.5l-.2-1.2h-3v15.3l3.2-.7V17c.6.5 1.5.9 2.6.9 2.7 0 5.1-2.2 5.1-5.9-.1-3.6-2.1-6.2-4.5-6.2zm-.7 9.1c-.9 0-1.4-.4-1.7-.9v-4.6c.4-.6 1-1 1.8-1 1.4 0 2.3 1.5 2.3 3.3 0 2-.9 3.2-2.4 3.2zM43.5 4.4l-3.2.7v2.9h-1.5v2.6h1.5v5.5c0 2.2 1.1 3 2.9 3 .9 0 1.6-.2 2-.3v-2.6c-.3.1-.7.1-1.1.1-.9 0-1.3-.3-1.3-1.2V10.6h1.5V8h-1.5V4.4zM49.5 4.3c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8-.8-1.8-1.8-1.8zM48 8h3.2v13.5H48V8zM59.6 7.8c-2.8 0-5.1 2-5.1 5.6 0 4.2 2.6 6.1 5.5 6.1 2.8 0 5.1-2 5.1-5.6 0-4.2-2.6-6.1-5.5-6.1zm.2 9c-1.3 0-2.2-1.2-2.2-3.5 0-2.2.9-3.3 2.2-3.3 1.3 0 2.2 1.2 2.2 3.3 0 2.3-.9 3.5-2.2 3.5zM72.3 7.8c-1.3 0-2.2.6-2.7 1.2l-.2-1h-3v15.3l3.2-.7V17c.5.4 1.3.8 2.3.8 2.7 0 5.2-2.2 5.2-5.9 0-3.7-2.2-6.1-4.8-6.1zm-.6 9.1c-.8 0-1.4-.4-1.7-.9v-4.6c.4-.5 1-1 1.8-1 1.4 0 2.3 1.5 2.3 3.3 0 2-.9 3.2-2.4 3.2zM81.8 1.5l-3.2.7V18h3.2V1.5zM91.7 12.2l-.1-.7c-.2-1.3-.9-2.3-2-2.3-1.3 0-2 1.2-2.2 2.3h4.3zm-7.4.9c0-3.5 2.2-5.6 5.3-5.6 3.4 0 4.7 2.6 4.7 5.4 0 .4 0 .9-.1 1.3H86c.3 1.8 1.4 2.5 2.9 2.5 1.1 0 1.9-.4 2.7-.9l1.2 2.1c-1.1.8-2.5 1.3-4.2 1.3-3.5 0-5.3-2.4-5.3-6.1z"/>
      <circle fill="#FFC220" cx="25" cy="19" r="3"/>
      <circle fill="#FFC220" cx="61" cy="19" r="3"/>
    </svg>
  ),
  eBay: () => (
    <svg viewBox="0 0 100 40" style={{ width: '50px', height: '20px' }}>
      <path fill="#E53238" d="M22.5 9.5c-4.5 0-7.5 2-8.5 5.5h-.1C13 9.5 8.5 8 5 8c-4.5 0-8 2-8 6.5v.5c0 4.5 4 6 8 6 4 0 8.5-1.5 9-5.5h.1c-1 3.5-4.5 5.5-9 5.5-4 0-8-1.5-8-6v-.5c0-4.5 3.5-6.5 8-6.5 3.5 0 8 1.5 9 5.5h.1c1-3.5 4-5.5 8.5-5.5 3.5 0 6.5 1 7.5 4h-4c-.5-1-2-1.5-3.5-1.5-3 0-5 1.5-5.5 4h13c.5-3.5-2-7-11.5-7zM5 11c3 0 5.5 1 5.5 3.5S8 18 5 18s-5.5-1-5.5-3.5S2 11 5 11z"/>
      <path fill="#0064D2" d="M33 9c-5 0-9 2.5-9 7.5S28 24 33 24s9-2.5 9-7.5S38 9 33 9zm0 12.5c-2.5 0-4.5-2-4.5-5s2-5 4.5-5 4.5 2 4.5 5-2 5-4.5 5z"/>
      <path fill="#F5AF02" d="M53 9c-5 0-9 2.5-9 7.5S48 24 53 24s9-2.5 9-7.5S58 9 53 9zm0 12.5c-2.5 0-4.5-2-4.5-5s2-5 4.5-5 4.5 2 4.5 5-2 5-4.5 5z"/>
      <path fill="#86B817" d="M73 9c-4.5 0-8 2-8 6v9h5v-7c0-2 1-3.5 3.5-3.5s3.5 1.5 3.5 3.5v7h5v-9c0-4-3.5-6-8-6h-1z"/>
    </svg>
  ),
  'Best Buy': () => (
    <svg viewBox="0 0 100 30" style={{ width: '55px', height: '16px' }}>
      <path fill="#0046BE" d="M12.5 2L2 7v16l10.5 5 10.5-5V7L12.5 2zm0 2.5l7.5 3.5v12l-7.5 3.5-7.5-3.5V8l7.5-3.5z"/>
      <path fill="#0046BE" d="M10.5 10h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4v-4zm0 6h4c1.1 0 2 .9 2 2s-.9 2-2 2h-4v-4z"/>
      <path fill="#0046BE" d="M35 8h8v2h-6v3h5v2h-5v5h-2V8zm11 0h2v12h-2V8zm7 0h6c2.2 0 4 1.8 4 4s-1.8 4-4 4h-4v4h-2V8zm2 2v4h4c1.1 0 2-.9 2-2s-.9-2-2-2h-4zm12-2h8v2h-6v3h5v2h-5v3h6v2h-8V8zm14 0h2v10h6v2h-8V8z"/>
    </svg>
  ),
  Default: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '24px', height: '24px' }}>
      <path d="M3 3h18v18H3z"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0f172a 0%, #000000 50%, #1e293b 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  // Animated background dots
  bgDots: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  dot: (i) => ({
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: 'rgba(59, 130, 246, 0.3)',
    borderRadius: '50%',
    left: `${(i * 17) % 100}%`,
    top: `${(i * 23) % 100}%`,
    animation: `float ${3 + (i % 4)}s ease-in-out infinite`,
    animationDelay: `${i * 0.2}s`,
  }),
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(59,130,246,0.3)',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  liveIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 700,
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    background: '#22c55e',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  hero: {
    position: 'relative',
    zIndex: 40,
    padding: '64px 24px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 'clamp(40px, 8vw, 72px)',
    fontWeight: 900,
    marginBottom: '24px',
    lineHeight: 1.1,
  },
  gradientText: {
    background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#94a3b8',
    marginBottom: '40px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto 32px',
  },
  searchGlow: {
    position: 'absolute',
    inset: '-4px',
    background: 'linear-gradient(135deg, #2563eb, #9333ea)',
    borderRadius: '16px',
    opacity: 0.25,
    filter: 'blur(8px)',
    animation: 'glowPulse 3s ease-in-out infinite',
  },
  searchBar: {
    position: 'relative',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
  },
  searchBarFocused: {
    border: '1px solid rgba(59, 130, 246, 0.5)',
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'white',
    fontSize: '18px',
    padding: '12px 16px',
  },
  searchButton: {
    background: 'linear-gradient(135deg, #2563eb, #9333ea)',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  searchButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)',
  },
  storeSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  storeChip: (selected, color) => ({
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: selected ? `linear-gradient(135deg, ${color}40, ${color}20)` : 'rgba(255,255,255,0.05)',
    color: selected ? 'white' : '#94a3b8',
    boxShadow: selected ? `0 4px 20px ${color}40, inset 0 1px 0 ${color}60` : 'none',
    border: selected ? `1px solid ${color}80` : '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  }),
  storeChipHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  },
  grid: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px 80px',
    position: 'relative',
    zIndex: 40,
  },
  // Section headers for API sources
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    marginTop: '32px',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  sectionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 700,
  },
  sectionBadge: {
    marginLeft: 'auto',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
  },
  resultCard: (isBest) => ({
    background: isBest 
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))' 
      : 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    border: isBest 
      ? '1px solid rgba(34, 197, 94, 0.4)' 
      : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    gap: '24px',
    alignItems: 'center',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
  }),
  resultCardHover: {
    transform: 'translateY(-4px) scale(1.01)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
  },
  // Spotlight effect
  spotlight: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.15), transparent 40%)',
    opacity: 0,
    transition: 'opacity 0.3s',
    pointerEvents: 'none',
  },
  bestDealBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
    animation: 'badgePulse 2s ease-in-out infinite',
  },
  priceTag: {
    fontSize: '36px',
    fontWeight: 900,
    color: '#4ade80',
    textShadow: '0 0 30px rgba(74, 222, 128, 0.3)',
  },
  storeLogo: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
  },
  loadingBar: {
    width: '100%',
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  loadingProgress: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #9333ea, #ec4899)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s linear infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  storesFound: {
    marginBottom: '24px', 
    display: 'flex', 
    gap: '12px', 
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  storeTag: {
    background: 'rgba(255,255,255,0.05)',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
  },
  storeTagHover: {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateY(-2px)',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '40px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    position: 'relative',
    zIndex: 40,
  },
  footerContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  footerLinkHover: {
    color: 'white',
    background: 'rgba(255,255,255,0.05)',
  },
  credits: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    fontSize: '12px',
    color: '#475569',
  },
  // Scroll indicator
  scrollIndicator: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #3b82f6, #9333ea, #ec4899)',
    zIndex: 100,
    transition: 'width 0.1s ease-out',
  },
}

// Available stores with SVG logos
const AVAILABLE_STORES = [
  { name: 'Amazon', color: '#FF9900', Logo: StoreLogos.Amazon },
  { name: 'Walmart', color: '#0071CE', Logo: StoreLogos.Walmart },
  { name: 'eBay', color: '#E53238', Logo: StoreLogos.eBay },
  { name: 'Best Buy', color: '#0046BE', Logo: StoreLogos['Best Buy'] },
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
  const cardRefs = useRef({})

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mouse tracking for spotlight effect
  const handleMouseMove = (e, cardId) => {
    const card = cardRefs.current[cardId]
    if (card) {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--mouse-x', `${x}%`)
      card.style.setProperty('--mouse-y', `${y}%`)
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
        // Process and sort results - Amazon first, then by price
        const processedResults = processResults(data)
        setSearchResults({ ...data, results: processedResults })
      } else {
        console.error('Search failed:', data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      clearInterval(progressInterval)
      setSearchProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  // Process results: separate by API source and sort by price
  const processResults = (data) => {
    if (!data.results) return []
    
    // Separate Amazon (RapidAPI) and SerperAPI results
    const amazonResults = data.results.filter(r => 
      r.source?.toLowerCase().includes('rapidapi') || 
      r.store === 'Amazon'
    ).map(r => ({ ...r, apiSource: 'rapidapi' }))
    
    const serperResults = data.results.filter(r => 
      !r.source?.toLowerCase().includes('rapidapi') && 
      r.store !== 'Amazon'
    ).map(r => ({ ...r, apiSource: 'serper' }))
    
    // Sort each group by price
    const sortByPrice = (a, b) => a.price - b.price
    amazonResults.sort(sortByPrice)
    serperResults.sort(sortByPrice)
    
    // Mark best deals
    const allResults = [...amazonResults, ...serperResults]
    if (allResults.length > 0) {
      const minPrice = Math.min(...allResults.map(r => r.price))
      allResults.forEach(r => {
        r.isBestDeal = r.price === minPrice
      })
    }
    
    return allResults
  }

  // Get store config for a result item
  const getStoreConfig = (storeName) => {
    return AVAILABLE_STORES.find(s => s.name === storeName) ||
           { name: storeName, color: '#666666', Logo: StoreLogos.Default }
  }

  // Separate results by API source for display
  const getAmazonResults = () => {
    if (!searchResults?.results) return []
    return searchResults.results.filter(r => r.apiSource === 'rapidapi' || r.store === 'Amazon')
  }

  const getSerperResults = () => {
    if (!searchResults?.results) return []
    return searchResults.results.filter(r => r.apiSource === 'serper' && r.store !== 'Amazon')
  }

  const StoreLogoComponent = ({ storeName, size = 'normal' }) => {
    const config = getStoreConfig(storeName)
    const LogoComponent = config.Logo || StoreLogos.Default
    return (
      <div style={{
        ...styles.storeLogo,
        borderColor: `${config.color}40`,
        width: size === 'small' ? '48px' : '64px',
        height: size === 'small' ? '48px' : '64px',
      }}>
        <LogoComponent />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Global Styles */}
      <style>{`
        @keyframes pulse { 
          0%, 100% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.7; transform: scale(1.1); } 
        }
        @keyframes glowPulse { 
          0%, 100% { opacity: 0.25; } 
          50% { opacity: 0.4; } 
        }
        @keyframes shimmer { 
          0% { background-position: -200% 0; } 
          100% { background-position: 200% 0; } 
        }
        @keyframes float { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        @keyframes badgePulse { 
          0%, 100% { box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4); } 
          50% { box-shadow: 0 4px 25px rgba(34, 197, 94, 0.7); } 
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-enter {
          animation: slideIn 0.5s ease-out forwards;
        }
        .spotlight-active {
          opacity: 1 !important;
        }
      `}</style>

      {/* Scroll Progress Bar */}
      <div style={{...styles.scrollIndicator, width: `${scrollProgress}%`}} />

      {/* Animated Background Dots */}
      <div style={styles.bgDots}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={styles.dot(i)} />
        ))}
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <TrendingDown size={28} color="white" />
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
        <h2 style={styles.heroTitle}>
          Find the <span style={styles.gradientText}>Best Price</span> Live
        </h2>
        <p style={styles.heroSubtitle}>
          Real-time price comparison across Amazon, Walmart, eBay & Best Buy
        </p>

        <div style={styles.searchContainer}>
          <div style={styles.searchGlow} />
          <div style={{
            ...styles.searchBar,
            ...(isSearchFocused ? styles.searchBarFocused : {})
          }}>
            <Search size={24} color="#64748b" style={{marginLeft: '12px'}} />
            <input
              type="text"
              placeholder="Search products..."
              style={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performLiveSearch()}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button 
              onClick={performLiveSearch}
              disabled={loading}
              style={{
                ...styles.searchButton, 
                opacity: loading ? 0.6 : 1,
                ...(loading ? {} : styles.searchButtonHover)
              }}
              onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.searchButtonHover)}
              onMouseLeave={(e) => !loading && Object.assign(e.currentTarget.style, { transform: 'none', boxShadow: 'none' })}
            >
              {loading ? <RefreshCw size={20} className="spin" /> : <Search size={20} />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {loading && (
            <div style={styles.loadingBar}>
              <div style={{...styles.loadingProgress, width: `${searchProgress}%`}} />
            </div>
          )}
        </div>

        <div style={styles.storeSelector}>
          {AVAILABLE_STORES.map(store => (
            <button
              key={store.name}
              onClick={() => toggleStore(store.name)}
              style={{
                ...styles.storeChip(selectedStores.includes(store.name), store.color),
                ...(hoveredStore === store.name ? styles.storeChipHover : {})
              }}
              onMouseEnter={() => setHoveredStore(store.name)}
              onMouseLeave={() => setHoveredStore(null)}
            >
              <store.Logo />
              {store.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      {searchResults && (
        <section style={styles.grid}>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredStat === 'best' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat('best')}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={styles.statValue}>${searchResults.results[0]?.price}</div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Best Price</div>
            </div>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredStat === 'savings' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat('savings')}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text'}}>
                ${Math.max(...searchResults.results.map(r => r.price)) - Math.min(...searchResults.results.map(r => r.price))}
              </div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Max Savings</div>
            </div>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredStat === 'results' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat('results')}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text'}}>
                {searchResults.results.length}
              </div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Results Found</div>
            </div>
          </div>

          {/* Stores Found */}
          {searchResults?.meta?.storesFound && (
            <div style={styles.storesFound}>
              <span style={{color: '#94a3b8'}}>Stores with results:</span>
              {searchResults.meta.storesFound.map(store => {
                const config = getStoreConfig(store)
                return (
                  <span 
                    key={store} 
                    style={{
                      ...styles.storeTag, 
                      borderLeft: `3px solid ${config.color}`,
                      ...(hoveredStore === `tag-${store}` ? styles.storeTagHover : {})
                    }}
                    onMouseEnter={() => setHoveredStore(`tag-${store}`)}
                    onMouseLeave={() => setHoveredStore(null)}
                  >
                    <config.Logo /> {store}
                  </span>
                )
              })}
            </div>
          )}

          {/* Amazon (RapidAPI) Results Section */}
          {getAmazonResults().length > 0 && (
            <>
              <div style={styles.sectionHeader}>
                <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #FF990040, #FF990020)'}}>
                  <Zap size={20} color="#FF9900" />
                </div>
                <span style={styles.sectionTitle}>Amazon (RapidAPI)</span>
                <span style={{...styles.sectionBadge, background: 'rgba(255, 153, 0, 0.2)', color: '#FF9900'}}>
                  {getAmazonResults().length} results
                </span>
              </div>
              
              {getAmazonResults().map((item, index) => {
                const storeConfig = getStoreConfig(item.store)
                const cardId = `amazon-${index}`
                return (
                  <div 
                    key={cardId}
                    ref={el => cardRefs.current[cardId] = el}
                    style={{
                      ...styles.resultCard(item.isBestDeal),
                      ...(hoveredCard === cardId ? styles.resultCardHover : {}),
                      animationDelay: `${index * 0.1}s`,
                    }}
                    className="card-enter"
                    onMouseEnter={() => setHoveredCard(cardId)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onMouseMove={(e) => handleMouseMove(e, cardId)}
                  >
                    {/* Spotlight effect */}
                    <div 
                      style={{
                        ...styles.spotlight,
                        opacity: hoveredCard === cardId ? 1 : 0,
                      }} 
                    />
                    
                    {item.isBestDeal && (
                      <div style={styles.bestDealBadge}>
                        <Sparkles size={12} />
                        BEST DEAL
                      </div>
                    )}

                    <StoreLogoComponent storeName={item.store} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h4 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>
                        {item.title}
                      </h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8'}}>
                        <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24'}}>
                          <Star size={16} fill="#fbbf24" /> {item.rating}
                        </span>
                        <span>{item.shipping}</span>
                        <span style={{color: storeConfig.color, fontSize: '12px', fontWeight: 700, padding: '2px 8px', background: `${storeConfig.color}20`, borderRadius: '4px'}}>
                          {item.source}
                        </span>
                      </div>
                    </div>

                    <div style={{textAlign: 'right', position: 'relative', zIndex: 1}}>
                      <div style={styles.priceTag}>${item.price}</div>
                      {item.originalPrice && (
                        <div style={{color: '#64748b', textDecoration: 'line-through'}}>
                          ${item.originalPrice}
                        </div>
                      )}
                    </div>

                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: `linear-gradient(135deg, ${storeConfig.color}, #9333ea)`,
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = `0 10px 30px ${storeConfig.color}60`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <ShoppingCart size={18} />
                      Buy
                    </a>
                  </div>
                )
              })}
            </>
          )}

          {/* SerperAPI Results Section */}
          {getSerperResults().length > 0 && (
            <>
              <div style={{...styles.sectionHeader, marginTop: '48px'}}>
                <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #3b82f640, #9333ea20)'}}>
                  <Search size={20} color="#3b82f6" />
                </div>
                <span style={styles.sectionTitle}>Other Stores (SerperAPI)</span>
                <span style={{...styles.sectionBadge, background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>
                  {getSerperResults().length} results
                </span>
              </div>
              
              {getSerperResults().map((item, index) => {
                const storeConfig = getStoreConfig(item.store)
                const cardId = `serper-${index}`
                return (
                  <div 
                    key={cardId}
                    ref={el => cardRefs.current[cardId] = el}
                    style={{
                      ...styles.resultCard(item.isBestDeal),
                      ...(hoveredCard === cardId ? styles.resultCardHover : {}),
                      animationDelay: `${(getAmazonResults().length + index) * 0.1}s`,
                    }}
                    className="card-enter"
                    onMouseEnter={() => setHoveredCard(cardId)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onMouseMove={(e) => handleMouseMove(e, cardId)}
                  >
                    {/* Spotlight effect */}
                    <div 
                      style={{
                        ...styles.spotlight,
                        opacity: hoveredCard === cardId ? 1 : 0,
                      }} 
                    />
                    
                    {item.isBestDeal && (
                      <div style={styles.bestDealBadge}>
                        <Sparkles size={12} />
                        BEST DEAL
                      </div>
                    )}

                    <StoreLogoComponent storeName={item.store} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h4 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>
                        {item.title}
                      </h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8'}}>
                        <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24'}}>
                          <Star size={16} fill="#fbbf24" /> {item.rating}
                        </span>
                        <span>{item.shipping}</span>
                        <span style={{color: storeConfig.color, fontSize: '12px', fontWeight: 700, padding: '2px 8px', background: `${storeConfig.color}20`, borderRadius: '4px'}}>
                          {item.source}
                        </span>
                      </div>
                    </div>

                    <div style={{textAlign: 'right', position: 'relative', zIndex: 1}}>
                      <div style={styles.priceTag}>${item.price}</div>
                      {item.originalPrice && (
                        <div style={{color: '#64748b', textDecoration: 'line-through'}}>
                          ${item.originalPrice}
                        </div>
                      )}
                    </div>

                    <a 
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: `linear-gradient(135deg, ${storeConfig.color}, #9333ea)`,
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = `0 10px 30px ${storeConfig.color}60`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <ShoppingCart size={18} />
                      Buy
                    </a>
                  </div>
                )
              })}
            </>
          )}
        </section>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <a 
              href="https://github.com/abdullahchishti0335-cyber" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                ...styles.footerLink,
                ...(hoveredFooterLink === 'github' ? styles.footerLinkHover : {})
              }}
              onMouseEnter={() => setHoveredFooterLink('github')}
              onMouseLeave={() => setHoveredFooterLink(null)}
            >
              <Github size={18} />
              Muhammad Abdullah Rajpoot
            </a>
            <span style={{color: '#475569'}}>•</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> for price hunters
            </span>
          </div>

          <div style={styles.credits}>
            <p>Powered by RapidAPI (Amazon Data) & Serper.dev (Google Shopping) • Deployed on Vercel</p>
            <p style={{marginTop: '8px'}}>© 2024 PriceWise Live. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
