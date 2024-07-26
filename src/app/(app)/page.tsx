import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import React from 'react'

const Page = () => {
  redirect('/auth/signin')
  return <></>
}

export default Page
