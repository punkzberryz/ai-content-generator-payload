import { Footer } from '@/components/footer'
import { SideNav } from '@/components/navbar/side-nav'
import { ReactNode } from 'react'

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen bg-slate-100">
      <div className="fixed left-0 top-0 z-20 w-64 -translate-x-full transition-all duration-300 ease-in-out md:translate-x-0">
        <SideNav />
      </div>
      <div className="min-h-[calc(100vh-56px)] transition-[margin-left] duration-300 ease-in-out md:ml-64">
        {/* <Header /> */}
        {children}
      </div>

      <Footer className="min-h-[56px] bg-white transition-[margin-left] duration-300 ease-in-out md:ml-64" />
    </div>
  )
}

export default ProtectedLayout
