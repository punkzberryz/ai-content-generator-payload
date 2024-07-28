import { Skeleton } from '@/components/ui/skeleton'
import { headers } from 'next/headers'
import { ReactNode, Suspense } from 'react'
import { SignoutButton } from './signout-button'
import { apiPromise } from '@/lib/api'
import { redirect } from 'next/navigation'

export const FetchUser = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Suspense
        fallback={
          <>
            <Skeleton className="h-40" />
            <Skeleton className="h-14" />
          </>
        }
      >
        <FetchUserAsync>{children}</FetchUserAsync>
      </Suspense>
    </>
  )
}
const FetchUserAsync = async ({ children }: { children: ReactNode }) => {
  const api = await apiPromise
  const me = await api.auth({
    headers: headers(),
  })

  const user = me.user
  if (user) {
    redirect('/')
    return (
      <div className="flex flex-col space-y-4">
        <p className="text-center">คุณได้เข้าสู่ระบบแล้ว</p>
        <SignoutButton />
      </div>
    )
  }

  return <>{children}</>
}
