import ToolLayout from '../components/ToolLayout'

export default function LinkedInOptimizer() {
  return (
    <ToolLayout
      toolKey="linkedin"
      title="AI LinkedIn Profile Optimizer"
      subtitle="Optimize your LinkedIn headline, About section, and summary to attract more recruiters and job opportunities."
      seoDescription="Free AI LinkedIn profile optimizer. Generate compelling headlines, About sections, and summaries that attract recruiters. No sign-up required."
      path="/linkedin-optimizer"
      outputLabel="Optimized LinkedIn Content"
      emptyMessage="Your optimized LinkedIn content will appear here."
      buttonLabel="Optimize Profile"
      fields={[
        {
          name: 'currentRole',
          label: 'Current Role / Target Role',
          placeholder: 'e.g. Full Stack Developer looking for Senior roles',
          type: 'text',
        },
        {
          name: 'experience',
          label: 'Your Background & Skills',
          placeholder: 'Describe your experience, key skills, and career goals.\n\nExample:\n5 years of full stack development. React, Node.js, AWS. Built products used by 100K+ users. Looking to transition into a senior engineering role at a growth-stage startup. Passionate about developer tools and AI.',
          type: 'textarea',
        },
        {
          name: 'section',
          label: 'What to Generate',
          placeholder: '',
          type: 'select',
          options: [
            { value: 'all', label: 'Full Profile (Headline + About + Summary)' },
            { value: 'headline', label: 'Headline Only' },
            { value: 'about', label: 'About Section Only' },
            { value: 'summary', label: 'Experience Summary' },
          ],
        },
      ]}
    />
  )
}
