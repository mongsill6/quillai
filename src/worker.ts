/**
 * NameForge AI — Cloudflare Worker
 * AI name generation + domain availability check
 */

interface Env {
  OPENAI_API_KEY: string
}

interface GenerateBody {
  query: string
  style: string
}

const STYLE_GUIDE: Record<string, string> = {
  brandable: 'Create unique, invented words or creative combinations that feel premium and brandable (like Spotify, Shopify, Figma).',
  professional: 'Use real, established-sounding words that convey trust and authority (like Accenture, Deloitte, Meridian).',
  playful: 'Use fun, catchy, memorable names with personality (like Bumble, Wobble, Zappy).',
  modern: 'Create sleek, minimal, one or two-syllable names that feel modern (like Vercel, Notion, Linear).',
  short: 'Names must be 3-6 characters maximum. Short, punchy, easy to type (like Uber, Bolt, Hive).',
}

// Rate limiting
const rateMap = new Map<string, { count: number; reset: number }>()
function checkRate(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) { rateMap.set(ip, { count: 1, reset: now + 60000 }); return true }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Check domain availability via DNS lookup
async function checkDomain(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`, {
      headers: { Accept: 'application/dns-json' },
    })
    const data = (await res.json()) as any
    // If Status is 3 (NXDOMAIN), domain likely available
    // If Status is 0 and has answers, domain is taken
    if (data.Status === 3) return true
    if (data.Status === 0 && data.Answer && data.Answer.length > 0) return false
    // Fallback: also check NS records
    const nsRes = await fetch(`https://dns.google/resolve?name=${domain}&type=NS`, {
      headers: { Accept: 'application/dns-json' },
    })
    const nsData = (await nsRes.json()) as any
    if (nsData.Status === 3) return true
    if (nsData.Answer && nsData.Answer.length > 0) return false
    return true // If no records found, probably available
  } catch {
    return true // Default to available on error
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname !== '/api/generate') {
      return new Response('Not Found', { status: 404 })
    }
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders })
    }

    try {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown'
      if (!checkRate(ip)) {
        return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429, headers: corsHeaders })
      }

      const body = (await request.json()) as GenerateBody
      if (!body.query?.trim()) {
        return Response.json({ error: 'Please describe your business.' }, { status: 400, headers: corsHeaders })
      }

      const styleHint = STYLE_GUIDE[body.style] || STYLE_GUIDE.brandable

      // Step 1: Generate names with AI
      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a world-class brand naming expert. Generate 8 unique business name ideas based on the user's description.

${styleHint}

CRITICAL RULES:
- Each name should be 1-2 words maximum
- Names must be easy to pronounce and spell
- Suggest the .com domain for each name (lowercase, no spaces/hyphens)
- Write a short tagline (under 10 words) for each
- Output ONLY valid JSON array, no markdown, no code blocks

Output format:
[{"name":"BrandName","domain":"brandname.com","tagline":"Short catchy tagline here"}]`
            },
            { role: 'user', content: body.query },
          ],
          max_tokens: 1500,
          temperature: 0.9,
        }),
      })

      if (!openaiRes.ok) {
        console.error('OpenAI error:', await openaiRes.text())
        return Response.json({ error: 'AI service unavailable.' }, { status: 502, headers: corsHeaders })
      }

      const aiData = (await openaiRes.json()) as any
      let raw = aiData.choices?.[0]?.message?.content?.trim() || '[]'

      // Clean up potential markdown wrapping
      raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

      let names: { name: string; domain: string; tagline: string }[]
      try {
        names = JSON.parse(raw)
      } catch {
        return Response.json({ error: 'Failed to parse names.' }, { status: 500, headers: corsHeaders })
      }

      // Step 2: Check domain availability in parallel
      const results = await Promise.all(
        names.map(async (n) => {
          const available = await checkDomain(n.domain)
          return { ...n, available }
        })
      )

      return Response.json({ names: results }, { status: 200, headers: corsHeaders })
    } catch (err) {
      console.error('Error:', err)
      return Response.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
  },
} satisfies ExportedHandler<Env>
