import { useState, useCallback } from 'react'
import SEOHead from './SEOHead'
import { generate, copyToClipboard } from '../utils/api'
import type { GenerateRequest } from '../utils/api'

interface FieldConfig {
  name: string
  label: string
  placeholder: string
  type: 'text' | 'textarea' | 'select'
  options?: { value: string; label: string }[]
}

interface ToolLayoutProps {
  toolKey: GenerateRequest['tool']
  title: string
  subtitle: string
  seoDescription: string
  path: string
  fields: FieldConfig[]
  outputLabel: string
  emptyMessage: string
  buttonLabel?: string
}

export default function ToolLayout({
  toolKey, title, subtitle, seoDescription, path,
  fields, outputLabel, emptyMessage, buttonLabel = 'Generate',
}: ToolLayoutProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    fields.forEach(f => { init[f.name] = f.type === 'select' ? (f.options?.[0]?.value || '') : '' })
    return init
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const mainField = fields.find(f => f.type === 'textarea')
  const hasInput = mainField ? values[mainField.name]?.trim() : Object.values(values).some(v => v.trim())

  const handleGenerate = useCallback(async () => {
    if (!hasInput || loading) return
    setLoading(true)
    setResult('')
    try {
      const mainInput = mainField ? values[mainField.name] : Object.values(values).filter(v => v.trim()).join('\n')
      const options: Record<string, string> = {}
      fields.forEach(f => { if (f.name !== mainField?.name && values[f.name]) options[f.name] = values[f.name] })
      const res = await generate({ tool: toolKey, input: mainInput.trim(), options })
      setResult(res.result)
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Something went wrong.'}`)
    } finally {
      setLoading(false)
    }
  }, [values, loading, toolKey, fields, mainField, hasInput])

  const handleCopy = useCallback(async () => {
    if (!result) return
    await copyToClipboard(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
  }, [handleGenerate])

  const updateField = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <SEOHead title={title} description={seoDescription} path={path} />
      <div className="tool-page container">
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
        <div className="tool-layout">
          <div className="tool-panel">
            {fields.map(field => (
              <div key={field.name} className="field-group">
                <label>{field.label}</label>
                {field.type === 'textarea' ? (
                  <>
                    <textarea
                      value={values[field.name]}
                      onChange={e => updateField(field.name, e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={field.placeholder}
                      maxLength={3000}
                    />
                    <div className="char-count">{values[field.name].length} / 3,000</div>
                  </>
                ) : field.type === 'select' ? (
                  <select value={values[field.name]} onChange={e => updateField(field.name, e.target.value)}>
                    {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={values[field.name]}
                    onChange={e => updateField(field.name, e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            <div className="tool-actions">
              <button className="generate-btn" onClick={handleGenerate} disabled={!hasInput || loading}>
                {loading ? <span className="spinner" /> : null}
                {loading ? 'Processing...' : `${buttonLabel} ⌘↵`}
              </button>
            </div>
          </div>
          <div className="tool-panel">
            <label>{outputLabel}</label>
            <div className={`result-area ${!result && !loading ? 'empty' : ''} ${loading ? 'loading' : ''}`}>
              {loading ? <span className="spinner" /> : result ? result : emptyMessage}
            </div>
            {result && (
              <div className="tool-actions" style={{ justifyContent: 'flex-end' }}>
                <button className="copy-btn" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy to Clipboard'}</button>
              </div>
            )}
          </div>
        </div>
        <div className="ad-slot">Ad Space — Google AdSense</div>
      </div>
    </>
  )
}
