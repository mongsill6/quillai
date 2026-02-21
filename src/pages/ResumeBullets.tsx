import ToolLayout from '../components/ToolLayout'

export default function ResumeBullets() {
  return (
    <ToolLayout
      toolKey="resume-bullets"
      title="AI Resume Bullet Point Generator"
      subtitle="Transform your work experience into powerful, achievement-focused bullet points that beat ATS systems."
      seoDescription="Free AI resume bullet point generator. Create ATS-optimized, achievement-focused resume bullet points from your job experience. No sign-up required."
      path="/resume-bullets"
      outputLabel="Generated Bullet Points"
      emptyMessage="Your AI-generated resume bullet points will appear here."
      buttonLabel="Generate Bullets"
      fields={[
        {
          name: 'jobTitle',
          label: 'Job Title',
          placeholder: 'e.g. Senior Software Engineer',
          type: 'text',
        },
        {
          name: 'experience',
          label: 'Describe Your Experience',
          placeholder: 'What did you do in this role? Describe your key responsibilities, projects, and achievements. The more detail you provide, the better the results.\n\nExample:\nBuilt the company\'s main web app using React. Led a team of 3 developers. Improved page load speed. Implemented CI/CD pipeline. Worked with product team on new features.',
          type: 'textarea',
        },
        {
          name: 'style',
          label: 'Style',
          placeholder: '',
          type: 'select',
          options: [
            { value: 'achievement', label: 'Achievement-Focused (Recommended)' },
            { value: 'technical', label: 'Technical / Engineering' },
            { value: 'leadership', label: 'Leadership / Management' },
            { value: 'creative', label: 'Creative / Marketing' },
          ],
        },
      ]}
    />
  )
}
