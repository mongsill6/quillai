import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'

const tools = [
  {
    path: '/resume-bullets',
    icon: '📄',
    iconBg: '#ecfdf5',
    title: 'AI Resume Bullet Points',
    desc: 'Turn your job experience into powerful, achievement-focused bullet points that pass ATS systems.',
    tag: 'Free — No Sign-up',
  },
  {
    path: '/cover-letter',
    icon: '✉️',
    iconBg: '#fef3c7',
    title: 'AI Cover Letter Writer',
    desc: 'Generate a tailored cover letter in seconds. Just paste the job description and your experience.',
    tag: 'Free — No Sign-up',
  },
  {
    path: '/interview-prep',
    icon: '🎯',
    iconBg: '#ede9fe',
    title: 'AI Interview Prep',
    desc: 'Get realistic interview questions for any role with expert-level sample answers to practice.',
    tag: 'Free — No Sign-up',
  },
  {
    path: '/linkedin-optimizer',
    icon: '💼',
    iconBg: '#dbeafe',
    title: 'LinkedIn Profile Optimizer',
    desc: 'Optimize your LinkedIn headline, summary, and About section to attract more recruiters.',
    tag: 'Free — No Sign-up',
  },
]

export default function Home() {
  return (
    <>
      <SEOHead
        title="Free AI Resume Builder & Career Tools"
        description="QuickCV AI — Build your resume, write cover letters, prep for interviews, and optimize your LinkedIn profile with AI. 100% free, no sign-up required."
        path="/"
      />

      <section className="hero container">
        <span className="hero-badge">100% Free — No Sign-Up Required</span>
        <h1>Land Your Dream Job<br />with AI</h1>
        <p>
          Build powerful resumes, write tailored cover letters, and ace interviews — all powered by AI, all completely free.
        </p>
        <div className="hero-cta">
          <Link to="/resume-bullets" className="cta-btn">Build My Resume Free →</Link>
        </div>
        <p className="hero-sub" style={{ marginTop: 12 }}>No credit card. No sign-up. Just results.</p>
      </section>

      <section className="competitor-strip container">
        <p>Others charge a premium. We don't.</p>
        <div className="prices">
          <div className="price-item">
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Resume.io</span>
            <span className="old-price">$24.95/mo</span>
          </div>
          <div className="price-item">
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Zety</span>
            <span className="old-price">$25.95/mo</span>
          </div>
          <div className="price-item">
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Rezi</span>
            <span className="old-price">$29/mo</span>
          </div>
          <div className="price-item">
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>QuickCV AI</span>
            <span className="our-price">$0 Free</span>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="tools-grid">
          {tools.map((tool) => (
            <Link key={tool.path} to={tool.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="tool-card">
                <div className="tool-icon" style={{ background: tool.iconBg }}>{tool.icon}</div>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
                <span className="tool-tag">{tool.tag}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="how-section container">
        <h2>How It Works</h2>
        <div className="how-steps">
          <div className="how-step">
            <div className="step-num">1</div>
            <h3>Describe Your Experience</h3>
            <p>Paste your job title, responsibilities, or the job posting you're applying for.</p>
          </div>
          <div className="how-step">
            <div className="step-num">2</div>
            <h3>AI Generates Content</h3>
            <p>Our AI creates professional, ATS-optimized content tailored to your specific situation.</p>
          </div>
          <div className="how-step">
            <div className="step-num">3</div>
            <h3>Copy & Apply</h3>
            <p>Copy the results directly into your resume, cover letter, or LinkedIn profile.</p>
          </div>
        </div>
      </section>

      <div className="ad-slot container">Ad Space — Google AdSense</div>
    </>
  )
}
