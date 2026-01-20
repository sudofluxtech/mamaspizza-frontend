import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CartState {
  itemCount: number
  setItemCount: (count: number) => void
  incrementItemCount: (increment?: number) => void
  decrementItemCount: (decrement?: number) => void
  resetCartCount: () => void
  clearCart: () => void
  lastUpdated?: number
  isHydrated: boolean
  setHydrated: (hydrated: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      itemCount: 0,
      lastUpdated: undefined,
      isHydrated: false,
      setItemCount: (count: number) => set({ 
        itemCount: Math.max(0, count), // Ensure count is never negative
        lastUpdated: Date.now() 
      }),
      incrementItemCount: (increment: number = 1) => set((state) => ({ 
        itemCount: state.itemCount + increment,
        lastUpdated: Date.now() 
      })),
      decrementItemCount: (decrement: number = 1) => set((state) => ({ 
        itemCount: Math.max(0, state.itemCount - decrement), // Ensure count is never negative
        lastUpdated: Date.now() 
      })),
      resetCartCount: () => set({ 
        itemCount: 0, 
        lastUpdated: Date.now() 
      }),
      clearCart: () => set({ 
        itemCount: 0, 
        lastUpdated: Date.now() 
      }),
      setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'mamas-pizza-cart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // explicitly use localStorage
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1 if needed
          return persistedState
        }
        return persistedState
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)

// Utility function to check if the cart state is still valid
export const isCartStateValid = (maxAgeHours: number = 24): boolean => {
  const state = useCartStore.getState()
  if (!state.lastUpdated) return false
  
  const now = Date.now()
  const maxAge = maxAgeHours * 60 * 60 * 1000 // Convert hours to milliseconds
  return (now - state.lastUpdated) < maxAge
}

// Utility function to get the cart state with validation
export const getValidatedCartState = (maxAgeHours: number = 24) => {
  const state = useCartStore.getState()
  const isValid = isCartStateValid(maxAgeHours)
  
  return {
    itemCount: isValid ? state.itemCount : 0,
    isValid,
    lastUpdated: state.lastUpdated
  }
}
