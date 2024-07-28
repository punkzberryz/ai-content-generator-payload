import { create } from 'zustand'

interface SearchTemplateStore {
  search: string
  setSearch: (search: string) => void
}

export const useSearchTemplateStore = create<SearchTemplateStore>((set) => ({
  search: '',
  setSearch: (search) => set({ search }),
}))
