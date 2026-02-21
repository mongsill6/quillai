import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ResumeBullets from './pages/ResumeBullets'
import CoverLetter from './pages/CoverLetter'
import InterviewPrep from './pages/InterviewPrep'
import LinkedInOptimizer from './pages/LinkedInOptimizer'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume-bullets" element={<ResumeBullets />} />
        <Route path="/cover-letter" element={<CoverLetter />} />
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
      </Routes>
    </Layout>
  )
}
