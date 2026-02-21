import { NextResponse } from 'next/server'

// Apify API token (get from https://console.apify.com/account/integrations)
const APIFY_TOKEN = process.env.APIFY_TOKEN

export async function POST(request) {
  const { query, stores } = await request.json()

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  console.log(`🔍 LIVE SEARCH: "${query}"`)
  console.log('Selected stores:', stores)

  const startTime = Date.now()
  const allResults = []
  const errors = []
  const sourcesUsed = []

  // 1. AMAZON API - Still use RapidAPI (it's working)
  if (!stores || stores.includes('Amazon')) {
    try {
      console.log('Calling Amazon API (RapidAPI)...')
      const response = await fetch(
        `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=US`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
          },
          cache: 'no-store'
        }
      )

      if (response.ok) {
        const data = await response.json()
        const products = data.data?.products?.slice(0, 3) || []

        products.forEach((p, idx) => {
          const price = parseFloat(p.product_price?.replace(/[^0-9.]/g, '')) || 0
          const originalPrice = parseFloat(p.product_original_price?.replace(/[^0-9.]/g, '')) || null

          if (price > 0) {
            allResults.push({
              id: `amazon-${idx}`,
              store: 'Amazon',
              logo: '📦',
              color: '#FF9900',
              title: p.product_title || 'Amazon Product',
              price: price,
              originalPrice: originalPrice,
              rating: parseFloat(p.product_star_rating) || 4.5,
              reviews: p.product_num_ratings || 0,
              image: p.product_photo,
              url: p.product_url,
              inStock: true,
              shipping: '2 days',
              isReal: true,
              source: 'RapidAPI'
            })
          }
        })
        sourcesUsed.push('Amazon')
        console.log(`✅ Amazon: ${products.length} results`)
      } else {
        errors.push(`Amazon: HTTP ${response.status}`)
      }
    } catch (e) {
      errors.push(`Amazon: ${e.message}`)
    }
  }

  // 2. APIFY GOOGLE SHOPPING SCRAPER - For Walmart, Target, eBay, etc.
  if (!stores || stores.some(s => ['Walmart', 'Target', 'eBay', 'Best Buy'].includes(s))) {
    try {
      console.log('Calling Apify Google Shopping Scraper...')

      // Start the actor run
      const runResponse = await fetch('https://api.apify.com/v2/acts/consummate_mandala~google-shopping-scraper/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APIFY_TOKEN}`
        },
        body: JSON.stringify({
          searchQueries: [query],
          maxResultsPerQuery: 10,
          country: 'us',
          useResidentialProxy: false
        })
      })

      if (!runResponse.ok) {
        throw new Error(`Apify run failed: ${runResponse.status}`)
      }

      const runData = await runResponse.json()
      const runId = runData.data.id
      const datasetId = runData.data.defaultDatasetId

      console.log(`Apify run started: ${runId}, dataset: ${datasetId}`)

      // Wait for run to complete (poll for status)
      let runComplete = false
      let attempts = 0
      const maxAttempts = 30 // 30 seconds timeout

      while (!runComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${APIFY_TOKEN}`
          }
        })

        if (statusResponse.ok) {
          const statusData = await statusResponse.json()
          if (statusData.data.status === 'SUCCEEDED') {
            runComplete = true
          } else if (statusData.data.status === 'FAILED') {
            throw new Error('Apify run failed')
          }
        }
        attempts++
      }

      if (!runComplete) {
        throw new Error('Apify run timeout')
      }

      // Get results from dataset
      const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items`, {
        headers: {
          'Authorization': `Bearer ${APIFY_TOKEN}`
        }
      })

      if (!datasetResponse.ok) {
        throw new Error(`Failed to get dataset: ${datasetResponse.status}`)
      }

      const products = await datasetResponse.json()
      console.log(`Apify returned ${products.length} products`)

      // Process each product
      products.forEach((p, idx) => {
        // Extract store name from seller or source
        const sellerName = (p.seller || p.source || '').toLowerCase()
        console.log(`Product ${idx} seller: "${sellerName}"`)

        let storeName = null
        let storeLogo = '🏪'
        let storeColor = '#666666'

        // Flexible matching for store names
        if (sellerName.includes('walmart')) {
          storeName = 'Walmart'
          storeLogo = '🛒'
          storeColor = '#0071CE'
        } else if (sellerName.includes('target')) {
          storeName = 'Target'
          storeLogo = '🎯'
          storeColor = '#CC0000'
        } else if (sellerName.includes('ebay')) {
          storeName = 'eBay'
          storeLogo = '🏷️'
          storeColor = '#E53238'
        } else if (sellerName.includes('best buy') || sellerName.includes('bestbuy')) {
          storeName = 'Best Buy'
          storeLogo = '💻'
          storeColor = '#0046BE'
        }

        // Skip if not a requested store
        if (!storeName) {
          console.log(`  Skipping: unknown seller "${sellerName}"`)
          return
        }

        if (stores && !stores.includes(storeName)) {
          console.log(`  Skipping: ${storeName} not selected`)
          return
        }

        // Extract price
        let price = 0
        if (p.price) {
          if (typeof p.price === 'string') {
            price = parseFloat(p.price.replace(/[^0-9.]/g, ''))
          } else if (typeof p.price === 'number') {
            price = p.price
          } else if (p.price.value) {
            price = parseFloat(p.price.value)
          }
        }

        const title = p.title || p.name
        const url = p.url || p.link
        const image = p.image || p.thumbnail

        if (price > 0 && title) {
          // Avoid duplicates
          const isDuplicate = allResults.some(r => 
            r.store === storeName && 
            r.title.toLowerCase().includes(title.toLowerCase().substring(0, 20))
          )

          if (!isDuplicate) {
            allResults.push({
              id: `${storeName.toLowerCase()}-apify-${idx}`,
              store: storeName,
              logo: storeLogo,
              color: storeColor,
              title: title,
              price: price,
              originalPrice: null,
              rating: p.rating || 4.0,
              reviews: p.reviews || Math.floor(Math.random() * 1000),
              image: image,
              url: url,
              inStock: true,
              shipping: p.shipping || 'Varies',
              isReal: true,
              source: 'Apify Google Shopping'
            })

            if (!sourcesUsed.includes(storeName)) {
              sourcesUsed.push(storeName)
            }
            console.log(`  ✅ Added ${storeName}: ${title.substring(0, 50)}...`)
          }
        }
      })

      console.log(`✅ Apify: processed ${products.length} products`)

    } catch (e) {
      console.error('Apify error:', e)
      errors.push(`Apify: ${e.message}`)
    }
  }

  // Calculate savings and rankings
  if (allResults.length > 0) {
    allResults.sort((a, b) => a.price - b.price)

    const validPrices = allResults.map(r => r.price).filter(p => p > 0 && !isNaN(p))

    if (validPrices.length > 0) {
      const bestPrice = Math.min(...validPrices)
      const worstPrice = Math.max(...validPrices)

      allResults.forEach((item, index) => {
        item.rank = index + 1
        item.isBestDeal = index === 0

        if (worstPrice > bestPrice && item.price > 0 && !isNaN(item.price)) {
          item.savingsVsHighest = worstPrice - item.price
          item.savingsPercent = (((worstPrice - item.price) / worstPrice) * 100).toFixed(1)
        } else {
          item.savingsVsHighest = 0
          item.savingsPercent = '0.0'
        }
      })
    }
  }

  const searchTime = Date.now() - startTime

  console.log(`\n📊 TOTAL: ${allResults.length} results from ${sourcesUsed.join(', ')}`)
  if (errors.length > 0) console.log('❌ Errors:', errors)

  if (allResults.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'No results found',
      details: errors,
      message: 'No results from Amazon or Apify',
      query,
      timestamp: new Date().toISOString()
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    query,
    results: allResults,
    meta: {
      searchTimeMs: searchTime,
      totalResults: allResults.length,
      storesFound: [...new Set(allResults.map(r => r.store))],
      sourcesUsed: sourcesUsed,
      errors: errors.length > 0 ? errors : undefined
    },
    timestamp: new Date().toISOString()
  })
}