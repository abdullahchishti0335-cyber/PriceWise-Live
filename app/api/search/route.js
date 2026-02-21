import { NextResponse } from 'next/server'

/**
 * PriceWise Live - Real-Time Price Comparison API
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const SERPER_API_KEY = process.env.SERPER_API_KEY

const SUPPORTED_STORES = {
  'Amazon': { color: '#FF9900' },
  'Walmart': { color: '#0071CE' },
  'eBay': { color: '#E53238' },
  'Best Buy': { color: '#0046BE' }
}

export async function POST(request) {
  const { query, stores } = await request.json()

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  const apiPromises = []
  const allResults = []
  const errors = []

  // 1. AMAZON (RapidAPI)
  if (!stores || stores.includes('Amazon')) {
    apiPromises.push(
      fetchAmazonData(query).then(res => allResults.push(...res)).catch(e => errors.push(e.message))
    )
  }

  // 2. OTHER STORES (Serper)
  const otherStores = ['Walmart', 'eBay', 'Best Buy']
  if (!stores || stores.some(s => otherStores.includes(s))) {
    apiPromises.push(
      fetchSerperData(query, stores).then(res => allResults.push(...res)).catch(e => errors.push(e.message))
    )
  }

  await Promise.all(apiPromises)

  // Sort and meta
  allResults.sort((a, b) => a.price - b.price)

  return NextResponse.json({
    success: true,
    results: allResults,
    meta: { total: allResults.length, stores: [...new Set(allResults.map(r => r.store))] }
  })
}

async function fetchAmazonData(query) {
  const response = await fetch(
    `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=US`,
    {
      headers: { 'X-RapidAPI-Key': RAPIDAPI_KEY, 'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com' },
      cache: 'no-store'
    }
  )
  const data = await response.json()
  return (data.data?.products?.slice(0, 5) || []).map((p, idx) => ({
    id: `amazon-${idx}`,
    store: 'Amazon',
    title: p.product_title,
    price: parseFloat(p.product_price?.replace(/[^0-9.]/g, '')) || 0,
    rating: parseFloat(p.product_star_rating) || 4.5,
    url: p.product_url,
    image: p.product_photo,
    source: 'Amazon'
  })).filter(item => item.price > 0)
}

async function fetchSerperData(query, selectedStores) {
  const response = await fetch('https://google.serper.dev/shopping', {
    method: 'POST',
    headers: { 'X-API-KEY': SERPER_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, gl: 'us', hl: 'en' })
  })
  const data = await response.json()
  const results = []

  data.shopping?.forEach((p, idx) => {
    const seller = (p.merchant || p.source || '').toLowerCase()
    let storeName = null

    if (seller.includes('walmart')) storeName = 'Walmart'
    else if (seller.includes('ebay')) storeName = 'eBay'
    else if (seller.includes('best buy') || seller.includes('bestbuy')) storeName = 'Best Buy'

    if (!storeName || (selectedStores && !selectedStores.includes(storeName))) return

    // DIRECT TO STORE LOGIC: 
    // Construct a direct search URL to the specific store to avoid Google Shopping results
    const cleanTitle = p.title.split(' ').slice(0, 5).join(' ') // Get first 5 words for accuracy
    const searchQuery = encodeURIComponent(cleanTitle)
    let directUrl = p.link

    if (!directUrl || directUrl.includes('google.com/shopping')) {
      if (storeName === 'Walmart') directUrl = `https://www.walmart.com/search?q=${searchQuery}`
      else if (storeName === 'eBay') directUrl = `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}`
      else if (storeName === 'Best Buy') directUrl = `https://www.bestbuy.com/site/searchpage.jsp?st=${searchQuery}`
    }

    results.push({
      id: `${storeName}-${idx}`,
      store: storeName,
      title: p.title,
      price: parseFloat(p.price?.toString().replace(/[^0-9.]/g, '')) || 0,
      rating: p.rating || 4.0,
      url: directUrl, // User now goes to Walmart/eBay/BestBuy search instead of Google
      image: p.imageUrl,
      source: 'Verified Store'
    })
  })

  return results.filter(r => r.price > 0)
}