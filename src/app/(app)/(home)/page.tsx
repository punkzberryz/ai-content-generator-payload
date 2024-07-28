import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = () => {
  redirect('/dashboard')
  return <div>Home page</div>
}

export default Page
