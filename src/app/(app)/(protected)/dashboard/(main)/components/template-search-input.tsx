'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { useSearchTemplateStore } from './use-search-template-store'

export const TemplateSearchInput = ({ className }: { className?: string }) => {
  const { setSearch, search } = useSearchTemplateStore()
  return (
    <div className={cn('relative w-full max-w-lg', className)}>
      <label htmlFor="template-search">
        <SearchIcon className="absolute left-2.5 top-2 text-primary" />
      </label>
      <Input
        id="template-search"
        className="pl-10"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}
