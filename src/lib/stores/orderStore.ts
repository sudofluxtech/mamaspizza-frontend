import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface OrderState {
  canOrder: boolean
  setCanOrder: (canOrder: boolean) => void
  resetOrderState: () => void
  // Optional: Add timestamp for when the order state was set
  lastUpdated?: number
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      canOrder: false,
      lastUpdated: undefined,
      setCanOrder: (canOrder: boolean) => set({ 
        canOrder, 
        lastUpdated: Date.now() 
      }),
      resetOrderState: () => set({ 
        canOrder: false, 
        lastUpdated: undefined 
      }),
    }),
    {
      name: 'mamas-pizza-order-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // explicitly use localStorage
      // Optional: Add version for future migrations
      version: 1,
      // Optional: Add migration function for future updates
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1 if needed
          return persistedState
        }
        return persistedState
      },
    }
  )
)

// Utility function to check if the order state is still valid
export const isOrderStateValid = (maxAgeHours: number = 24): boolean => {
  const state = useOrderStore.getState()
  if (!state.lastUpdated) return false
  
  const now = Date.now()
  const maxAge = maxAgeHours * 60 * 60 * 1000 // Convert hours to milliseconds
  return (now - state.lastUpdated) < maxAge
}

// Utility function to get the order state with validation
export const getValidatedOrderState = (maxAgeHours: number = 24) => {
  const state = useOrderStore.getState()
  const isValid = isOrderStateValid(maxAgeHours)
  
  return {
    canOrder: isValid ? state.canOrder : false,
    isValid,
    lastUpdated: state.lastUpdated
  }
}
