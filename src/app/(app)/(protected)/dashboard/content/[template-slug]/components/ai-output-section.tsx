'use client'
import { Button } from '@/components/ui/button'

import { Copy } from 'lucide-react'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import { useEffect, useRef } from 'react'
import { useAiGeneratorStore } from './use-ai-generator-store'
import { toast } from 'react-toastify'
export const AiOutputSection = () => {
  const editorRef = useRef<Editor | null>(null)
  const { aiResponse } = useAiGeneratorStore()

  useEffect(() => {
    if (!editorRef.current) return
    const editorInstance = editorRef.current.getInstance()
    editorInstance.setMarkdown(aiResponse || '')
  }, [aiResponse, editorRef])
  return (
    <div className="rounded-lg border bg-white shadow-lg">
      <div className="flex items-center justify-between p-5">
        <h2 className="text-lg font-medium">Your Result</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            if (!editorRef.current) return
            const instance = editorRef.current.getInstance()
            const text = instance.getMarkdown()
            navigator.clipboard.writeText(text)
            toast.success('Copied to clipboard')
          }}
        >
          <Copy className="h-4 w-4" /> Copy
        </Button>
      </div>
      <Editor
        ref={editorRef}
        initialValue="Your result will be displayed here"
        initialEditType="wysiwyg"
        height="600px"
        useCommandShortcut={true}
        onChange={() => {}}
      />
    </div>
  )
}
