const API_BASE = '/api'

export interface GenerateRequest {
  tool: 'resume-bullets' | 'cover-letter' | 'interview-prep' | 'linkedin'
  input: string
  options?: Record<string, string>
}

export interface GenerateResponse {
  result: string
  usage?: { tokens: number }
}

export async function generate(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}
