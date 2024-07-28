'use server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { BadRequestError, UnauthorizedError } from '@/lib/error'
import { catchErrorForServerActionHelper } from '@/lib/error/catch-error-action-helper'
import { apiPromise } from '@/lib/api'
import { headers } from 'next/headers'
import { z } from 'zod'

const inputSchema = z.object({
  prompt: z.string().min(2),
  templateSlug: z.string().min(1),
})

export const generateAiOutputAction = async ({
  prompt,
  templateSlug,
}: z.infer<typeof inputSchema>) => {
  try {
    //validate input
    const parse = inputSchema.safeParse({ prompt, templateSlug })
    if (!parse.success) throw new BadRequestError()
    //validate user
    const api = await apiPromise
    const auth = await api.auth({
      headers: headers(),
    })
    if (!auth.user) {
      throw new UnauthorizedError()
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      throw new BadRequestError()
    }

    const genAi = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
    const model = genAi.getGenerativeModel({
      model: 'gemini-1.5-flash',
    })
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    }
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    })
    const result = await chatSession.sendMessage(prompt)
    const aiResponse = result.response.text()
    //save to db
    await api.create({
      collection: 'ai-output',
      data: {
        prompt,
        templateSlug,
        createdBy: auth.user.id,
        output: aiResponse,
      },
    })
    return { aiResponse }
  } catch (err) {
    const error = catchErrorForServerActionHelper(err)
    return { error }
  }
}
