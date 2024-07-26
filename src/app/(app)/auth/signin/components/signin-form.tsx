'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FieldErrors, useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { EmailField } from './email-field'
import { PasswordField } from './password-fields'
import { signInSchema, SignInSchema } from '@/app/schema/auth'
import { LoadingBars } from '@/components/ui/loading-bars'

import { toast } from 'react-toastify'
import { login, SignInErrorResponse } from '@/lib/query/auth'

export const SignInForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleFormSubmit = async (data: SignInSchema) => {
    setIsLoading(true)
    // const { error, user } = await signinAction({ data })
    const { error, user } = await login({ body: data })

    setIsLoading(false)
    if (error || !user) {
      if (error?.message === SignInErrorResponse.passwordOrEmailIsNotMatch) {
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
        return
      }
      toast.error('เกิดข้อผิดพลาด')
      return
    }
    toast.success('เข้าสู่ระบบสำเร็จ')
    router.refresh()
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit, handleFormError)}
        className="flex flex-col space-y-4"
      >
        <EmailField form={form} />
        <PasswordField form={form} />
        <div className="flex flex-col pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingBars /> : 'เข้าสู่ระบบ'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
const handleFormError = (error: FieldErrors<SignInSchema>) => {}
