'use client'

import { cn } from '@/lib/utils'
import { FileClock, Home, LucideIcon, Settings, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const NavLinks = () => {
  const path = usePathname()
  return (
    <nav>
      {links.map((link, index) => (
        <NavLinkItem key={index} {...link} currentPath={path} />
      ))}
    </nav>
  )
}
const NavLinkItem = ({
  name,
  icon: Icon,
  href,
  currentPath,
}: NavLinkProps & { currentPath: string }) => {
  return (
    <Link
      className={cn(
        'mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-3 duration-300 ease-in-out hover:bg-primary hover:text-white',
        href === currentPath ? 'bg-primary text-white' : '',
      )}
      href={href}
    >
      <Icon className="h-6 w-6" />
      <h2 className="text-lg">{name}</h2>
    </Link>
  )
}
interface NavLinkProps {
  name: string
  icon: LucideIcon
  href: string
}
const links: NavLinkProps[] = [
  {
    name: 'Home',
    icon: Home,
    href: '/dashboard',
  },
  {
    name: 'History',
    icon: FileClock,
    href: '/dashboard/history',
  },
  {
    name: 'Billing',
    icon: WalletCards,
    href: '/dashboard/billing',
  },
  {
    name: 'Setting',
    icon: Settings,
    href: '/dashboard/setting',
  },
]
