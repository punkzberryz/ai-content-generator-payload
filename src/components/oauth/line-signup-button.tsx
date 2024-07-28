'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'

export const OAuthLineLoginButton2 = () => {
  const handleSubmit = () => {
    const email = inputRef.current?.value
    if (email) {
      fetch(`/api/users/oauth/authorize?email=${email}`)
    }
  }
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Line Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>โปรดระบุอีเมล</DialogTitle>
          <DialogDescription>โปรดระบุอีเมลเพื่อใช้งานบริการ</DialogDescription>
        </DialogHeader>
        <Input ref={inputRef} type="email" />
        <Button onClick={handleSubmit}>Sign up</Button>
      </DialogContent>
    </Dialog>
  )
}
