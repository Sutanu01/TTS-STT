'use client'

import ReactMarkdown from 'react-markdown'

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert text-gray-100">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}
