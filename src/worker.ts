/**
 * QuickCV AI — Cloudflare Worker API
 * Career tools powered by OpenAI gpt-4o-mini
 */

interface Env {
  OPENAI_API_KEY: string
}

interface RequestBody {
  tool: 'resume-bullets' | 'cover-letter' | 'interview-prep' | 'linkedin'
  input: string
  options?: Record<string, string>
}

const SYSTEM_PROMPTS: Record<string, (input: string, options?: Record<string, string>) => string> = {
  'resume-bullets': (_input, options) => {
    const styleGuide: Record<string, string> = {
      achievement: 'Focus on measurable achievements using the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]". Use strong action verbs. Include metrics, percentages, and dollar amounts where possible.',
      technical: 'Emphasize technical skills, tools, and systems. Include specific technologies, architectures, and technical achievements.',
      leadership: 'Highlight leadership, team management, mentorship, and cross-functional collaboration. Emphasize people management and strategic decisions.',
      creative: 'Focus on creative campaigns, content strategy, brand impact, and audience growth. Include engagement metrics and creative achievements.',
    }
    const style = styleGuide[options?.style || 'achievement'] || styleGuide.achievement
    const jobTitle = options?.jobTitle ? `The person's role is: ${options.jobTitle}. ` : ''
    return `You are an expert resume writer and career coach. ${jobTitle}Generate 6-8 powerful resume bullet points from the user's description of their experience. ${style}

Rules:
- Start each bullet with a strong past-tense action verb (Led, Built, Increased, Reduced, etc.)
- Each bullet should be 1-2 lines maximum
- Be specific and quantify results whenever possible
- Optimize for ATS (Applicant Tracking Systems)
- Format as a bullet list using "•" character
- Output ONLY the bullet points, nothing else`
  },

  'cover-letter': (_input, options) => {
    const toneGuide: Record<string, string> = {
      professional: 'Maintain a professional, polished tone.',
      enthusiastic: 'Show genuine enthusiasm and passion for the role.',
      confident: 'Use confident, direct language that demonstrates authority.',
      conversational: 'Keep it warm and personable while remaining professional.',
    }
    const tone = toneGuide[options?.tone || 'professional'] || toneGuide.professional
    const company = options?.company ? `The company is ${options.company}. ` : ''
    const jobTitle = options?.jobTitle ? `The position is ${options.jobTitle}. ` : ''
    return `You are an expert cover letter writer. ${company}${jobTitle}Generate a compelling, tailored cover letter based on the user's background. ${tone}

Rules:
- 3-4 paragraphs maximum (250-350 words)
- Opening: Hook that shows genuine interest and knowledge of the company
- Body: Connect the candidate's specific experience to the role's requirements
- Closing: Strong call to action
- Do NOT use generic phrases like "I am writing to express my interest"
- Make it specific and personal, not template-like
- Output the cover letter ready to copy-paste, starting with "Dear Hiring Manager,"`
  },

  'interview-prep': (_input, options) => {
    const typeGuide: Record<string, string> = {
      mixed: 'Generate a mix of behavioral (STAR method), technical, and situational questions.',
      behavioral: 'Focus on behavioral questions using the STAR method (Situation, Task, Action, Result).',
      technical: 'Focus on technical and domain-specific knowledge questions.',
      situational: 'Focus on hypothetical situational and case study questions.',
    }
    const qType = typeGuide[options?.questionType || 'mixed'] || typeGuide.mixed
    const jobTitle = options?.jobTitle ? `The role is: ${options.jobTitle}. ` : ''
    return `You are an expert interview coach and career advisor. ${jobTitle}${qType}

Generate 5 realistic interview questions with detailed sample answers for the specified role.

Format each as:
**Q1: [Question]**
**Sample Answer:** [A detailed, structured sample answer of 3-5 sentences]

---

Rules:
- Questions should be realistic — the kind actually asked at top companies
- Sample answers should use the STAR method for behavioral questions
- Include specific examples and metrics in sample answers
- Make answers feel authentic, not rehearsed
- Output ONLY the questions and answers`
  },

  'linkedin': (_input, options) => {
    const sectionGuide: Record<string, string> = {
      all: 'Generate: 1) A compelling headline (under 120 chars), 2) An "About" section (200-300 words), and 3) A brief experience summary. Format with clear section headers.',
      headline: 'Generate 3 compelling LinkedIn headline options, each under 120 characters. Use the format: [Role] | [Key Value] | [Specialty]. Output all 3 with numbers.',
      about: 'Generate a compelling LinkedIn "About" section (200-300 words). Start with a hook, highlight key achievements, and end with what you\'re looking for.',
      summary: 'Generate a professional experience summary paragraph optimized for LinkedIn (100-150 words).',
    }
    const section = sectionGuide[options?.section || 'all'] || sectionGuide.all
    const role = options?.currentRole ? `Current/target role: ${options.currentRole}. ` : ''
    return `You are a LinkedIn optimization expert and personal branding coach. ${role}${section}

Rules:
- Use keywords that recruiters actually search for
- Show personality — avoid corporate jargon
- Focus on value provided, not just job duties
- Include relevant industry keywords naturally
- Make it scannable with short paragraphs
- Output ONLY the requested content`
  },
}

// Rate limiting
const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 15
const RATE_WINDOW = 60_000

function checkRate(ip: string): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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

      const body = (await request.json()) as RequestBody

      if (!body.tool || !body.input?.trim()) {
        return Response.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders })
      }
      if (body.input.length > 5000) {
        return Response.json({ error: 'Input too long. Maximum 5,000 characters.' }, { status: 400, headers: corsHeaders })
      }

      const systemFn = SYSTEM_PROMPTS[body.tool]
      if (!systemFn) {
        return Response.json({ error: 'Invalid tool' }, { status: 400, headers: corsHeaders })
      }

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemFn(body.input, body.options) },
            { role: 'user', content: body.input },
          ],
          max_tokens: 2000,
          temperature: 0.4,
        }),
      })

      if (!openaiRes.ok) {
        console.error('OpenAI error:', await openaiRes.text())
        return Response.json({ error: 'AI service temporarily unavailable.' }, { status: 502, headers: corsHeaders })
      }

      const data = (await openaiRes.json()) as any
      const result = data.choices?.[0]?.message?.content?.trim() || ''
      const tokens = data.usage?.total_tokens || 0

      return Response.json({ result, usage: { tokens } }, { status: 200, headers: corsHeaders })
    } catch (err) {
      console.error('Generate error:', err)
      return Response.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
  },
} satisfies ExportedHandler<Env>
