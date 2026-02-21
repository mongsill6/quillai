import ToolLayout from '../components/ToolLayout'

export default function CoverLetter() {
  return (
    <ToolLayout
      toolKey="cover-letter"
      title="AI Cover Letter Generator"
      subtitle="Generate a tailored, professional cover letter in seconds. Just provide the job details and your background."
      seoDescription="Free AI cover letter generator. Create personalized, professional cover letters tailored to any job posting. No sign-up required."
      path="/cover-letter"
      outputLabel="Generated Cover Letter"
      emptyMessage="Your AI-generated cover letter will appear here."
      buttonLabel="Write Cover Letter"
      fields={[
        {
          name: 'jobTitle',
          label: 'Job Title You\'re Applying For',
          placeholder: 'e.g. Product Manager at Google',
          type: 'text',
        },
        {
          name: 'company',
          label: 'Company Name',
          placeholder: 'e.g. Google',
          type: 'text',
        },
        {
          name: 'experience',
          label: 'Your Background & Key Qualifications',
          placeholder: 'Briefly describe your relevant experience and skills.\n\nExample:\n5 years of product management experience at tech startups. Led launch of a B2B SaaS product from 0 to $2M ARR. Strong background in data analysis and user research. Previously worked as a software engineer for 3 years.',
          type: 'textarea',
        },
        {
          name: 'tone',
          label: 'Tone',
          placeholder: '',
          type: 'select',
          options: [
            { value: 'professional', label: 'Professional (Recommended)' },
            { value: 'enthusiastic', label: 'Enthusiastic & Passionate' },
            { value: 'confident', label: 'Confident & Direct' },
            { value: 'conversational', label: 'Conversational & Warm' },
          ],
        },
      ]}
    />
  )
}
