import Image from 'next/image'
import { Separator } from '../ui/separator'
import { NavLinks } from './nav-links'

export const SideNav = () => {
  return (
    <nav className="h-screen border bg-white p-5 shadow-sm">
      <div className="flex justify-center">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
      </div>
      <Separator className="my-6 border" />
      <NavLinks />
    </nav>
  )
}
