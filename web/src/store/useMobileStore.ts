import { create } from "zustand"

type MobileState = {
  isMobile: boolean
  setIsMobile: (val: boolean) => void
}

export const useMobileStore = create<MobileState>((set) => ({
  isMobile: window.innerWidth < 768,
  setIsMobile: (val) => set({ isMobile: val }),
}))
