import { create } from 'zustand'

interface UseAiGeneratorStore {
  loading: boolean
  setLoading: (loading: boolean) => void
  aiResponse: string | null
  setAiResponse: (aiResponse: string | null) => void
}

export const useAiGeneratorStore = create<UseAiGeneratorStore>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  aiResponse: null,
  setAiResponse: (aiResponse) => set({ aiResponse }),
}))
