'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const SignoutButton = () => {
  const [loading, setloading] = useState(false)
  const router = useRouter()
  const handleSignOut = async () => {
    setloading(true)

    const resp = await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setloading(false)
    if (!resp.ok) {
      console.error('Failed to sign out')
      return
    }
    router.refresh()
  }
  return <Button onClick={handleSignOut}>Sign out</Button>
}
