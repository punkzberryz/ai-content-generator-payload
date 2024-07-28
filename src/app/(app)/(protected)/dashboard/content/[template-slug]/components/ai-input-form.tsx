'use client'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TemplateType } from '../../../(main)/components/TEMPLATE'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2Icon } from 'lucide-react'
import { useAiGeneratorStore } from './use-ai-generator-store'
import { toast } from 'react-toastify'
import { generateAiOutputAction } from './generate-ai-action'
const aiInputSchema = z.object({
  niche: z.string().optional(),
  outline: z.string().optional(),
  topic: z.string().optional(),
  keywords: z.string().optional(),
  title: z.string().optional(),
  article: z.string().optional(),
  textToImprove: z.string().optional(),
  inputText: z.string().optional(),
  codeDesscripton: z.string().optional(),
  codeInput: z.string().optional(),
  productName: z.string().optional(),
})
type AiInputSchema = z.infer<typeof aiInputSchema>
export const AiInputForm = ({ template }: { template: TemplateType }) => {
  const { loading, setLoading, setAiResponse } = useAiGeneratorStore()
  const form = useForm<AiInputSchema>({
    resolver: zodResolver(aiInputSchema),
    defaultValues: {
      niche: '',
      outline: '',
      topic: '',
      keywords: '',
      title: '',
      article: '',
      textToImprove: '',
      inputText: '',
      codeDesscripton: '',
      codeInput: '',
      productName: '',
    },
  })
  const onSubmit = async (data: AiInputSchema) => {
    setLoading(true)

    //empty string will be removed
    const finalAiPrompt = JSON.stringify(data, filterEmptyString) + ', ' + template.aiPrompt
    const { error, aiResponse } = await generateAiOutputAction({
      prompt: finalAiPrompt,
      templateSlug: template.slug,
    })

    setLoading(false)
    if (error) {
      console.error({ error })
      toast.error('Failed to generate AI content')
      return
    }
    setAiResponse(aiResponse)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 flex flex-col space-y-8">
        {template.form.map((input, index) => (
          <FormField
            key={index}
            control={form.control}
            name={input.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">{input.label}</FormLabel>
                <FormControl>
                  {input.field === 'input' ? (
                    <Input {...field} required={input.required} name={input.name} />
                  ) : (
                    <Textarea {...field} required={input.required} name={input.name} />
                  )}
                </FormControl>
              </FormItem>
            )}
          />
        ))}
        <Button disabled={loading} className="w-full py-6">
          {loading && <Loader2Icon className="mr-4 animate-spin" />}
          Generate Content
        </Button>
      </form>
    </Form>
  )
}

function filterEmptyString(key: string, value: string | undefined) {
  if (value !== '') return value
}
