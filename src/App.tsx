import { useState, useCallback } from 'react'

interface NameResult {
  name: string
  domain: string
  tagline: string
  available: boolean
  liked: boolean
}

const NICHES = [
  { icon: '🍕', label: 'Restaurant', query: 'restaurant or food business' },
  { icon: '💻', label: 'Tech Startup', query: 'tech startup or SaaS company' },
  { icon: '🧁', label: 'Bakery', query: 'bakery or dessert shop' },
  { icon: '👗', label: 'Clothing Brand', query: 'fashion or clothing brand' },
  { icon: '🎙️', label: 'Podcast', query: 'podcast or media channel' },
  { icon: '📹', label: 'YouTube', query: 'YouTube channel or content creator brand' },
  { icon: '💪', label: 'Fitness', query: 'fitness studio or gym' },
  { icon: '🐾', label: 'Pet Business', query: 'pet care or pet products business' },
  { icon: '📸', label: 'Photography', query: 'photography studio or visual brand' },
  { icon: '☕', label: 'Coffee Shop', query: 'coffee shop or cafe' },
]

const STYLES = [
  { label: 'Brandable', value: 'brandable' },
  { label: 'Professional', value: 'professional' },
  { label: 'Playful', value: 'playful' },
  { label: 'Modern', value: 'modern' },
  { label: 'Short & Punchy', value: 'short' },
]

const AFFILIATE_URL = 'https://www.namecheap.com/domains/registration/results/?domain='

export default function App() {
  const [query, setQuery] = useState('')
  const [style, setStyle] = useState('brandable')
  const [results, setResults] = useState<NameResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleGenerate = useCallback(async (customQuery?: string) => {
    const q = customQuery || query
    if (!q.trim() || loading) return
    setLoading(true)
    setHasSearched(true)
    setResults([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim(), style }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      const names: NameResult[] = (data.names || []).map((n: any) => ({
        name: n.name,
        domain: n.domain,
        tagline: n.tagline,
        available: n.available ?? true,
        liked: false,
      }))
      setResults(names)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [query, style, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate()
  }

  const handleNicheClick = (nicheQuery: string) => {
    setQuery(nicheQuery)
    handleGenerate(nicheQuery)
  }

  const toggleLike = (idx: number) => {
    setResults(prev => prev.map((r, i) => i === idx ? { ...r, liked: !r.liked } : r))
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="/" className="logo">
            <span className="logo-mark">N</span>
            NameForge
          </a>
          <div className="header-links">
            <a href="#niches">Categories</a>
            <a href="#about">About</a>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h1>Find Your Perfect<br />Business Name</h1>
          <p>AI-generated brand names with instant domain availability check. Free, no sign-up.</p>

          <div className="search-box">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your business... e.g. AI productivity app"
            />
            <button onClick={() => handleGenerate()} disabled={!query.trim() || loading}>
              {loading ? 'Forging...' : 'Generate'}
            </button>
          </div>

          <div className="style-chips">
            {STYLES.map(s => (
              <button key={s.value} className={`chip ${style === s.value ? 'active' : ''}`} onClick={() => setStyle(s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="loading-state">
            <div className="spinner-lg" />
            <p className="loading-text">Forging brand names & checking domains...</p>
          </div>
        )}

        {!loading && hasSearched && results.length > 0 && (
          <section className="results">
            <div className="results-header">
              <h2>Generated Names</h2>
              <span className="results-count">{results.length} names found</span>
            </div>
            <div className="names-grid">
              {results.map((r, i) => (
                <div key={i} className="name-card">
                  <div className="name-card-top">
                    <span className="brand-name">{r.name}</span>
                    <button className={`heart-btn ${r.liked ? 'liked' : ''}`} onClick={() => toggleLike(i)}>
                      {r.liked ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <p className="brand-tagline">{r.tagline}</p>
                  <div className="domain-row">
                    <span className="domain-name">{r.domain}</span>
                    <span className={`domain-status ${r.available ? 'available' : 'taken'}`}>
                      <span className={`dot ${r.available ? 'green' : 'red'}`} />
                      {r.available ? 'Available' : 'Taken'}
                    </span>
                  </div>
                  {r.available && (
                    <a href={`${AFFILIATE_URL}${r.domain}`} target="_blank" rel="noopener noreferrer" className="buy-btn">
                      Register Domain →
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div className="ad-slot">Ad Space — Google AdSense</div>
          </section>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="loading-state">
            <p className="loading-text">No results. Try a different description.</p>
          </div>
        )}

        {!hasSearched && (
          <section className="niches" id="niches">
            <h2>Popular Categories</h2>
            <div className="niches-grid">
              {NICHES.map(n => (
                <div key={n.label} className="niche-card" onClick={() => handleNicheClick(n.query)}>
                  <div className="niche-icon">{n.icon}</div>
                  <h3>{n.label}</h3>
                  <p>Name Generator</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
          <p>&copy; {new Date().getFullYear()} NameForge AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
