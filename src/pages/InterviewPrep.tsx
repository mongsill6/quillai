import ToolLayout from '../components/ToolLayout'

export default function InterviewPrep() {
  return (
    <ToolLayout
      toolKey="interview-prep"
      title="AI Interview Question Generator"
      subtitle="Get realistic interview questions with expert sample answers for any job role. Practice and ace your next interview."
      seoDescription="Free AI interview prep tool. Get realistic interview questions and sample answers for any job role. Practice behavioral, technical, and situational questions."
      path="/interview-prep"
      outputLabel="Interview Questions & Answers"
      emptyMessage="Your interview questions and sample answers will appear here."
      buttonLabel="Generate Questions"
      fields={[
        {
          name: 'jobTitle',
          label: 'Job Title',
          placeholder: 'e.g. Data Scientist at Meta',
          type: 'text',
        },
        {
          name: 'details',
          label: 'Additional Context (Optional)',
          placeholder: 'Paste the job description, or describe what you want to focus on.\n\nExample:\nEntry-level position. They mentioned SQL, Python, and machine learning in the requirements. I have 1 year of internship experience.',
          type: 'textarea',
        },
        {
          name: 'questionType',
          label: 'Question Type',
          placeholder: '',
          type: 'select',
          options: [
            { value: 'mixed', label: 'Mixed (Behavioral + Technical)' },
            { value: 'behavioral', label: 'Behavioral (STAR Method)' },
            { value: 'technical', label: 'Technical Questions' },
            { value: 'situational', label: 'Situational / Case Study' },
          ],
        },
      ]}
    />
  )
}
