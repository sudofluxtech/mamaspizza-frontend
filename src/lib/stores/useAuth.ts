import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DeliveryAddress } from "@/hooks/delivery-address.hook";

export interface User {
  id: number;
  name: string;
  delivery_address?: {
    id?: number;
    user_id?: number;
    address_line_1: string;
    address_line_2: string;
    city: string;
    post_code: string;
    details: string;
    created_at?: string;
    updated_at?: string;
  } | null;
  email: string;
  phone?: string | null;
  role: "admin" | "staff" | "user";
  user_image?: string | null;
  created_at: string;
  updated_at: string;
  // Allow additional fields from API
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthActions {
  setUser: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  updateDeliveryAddress: (deliveryAddress: DeliveryAddress) => void;
  clearDeliveryAddress: () => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Actions
      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      updateDeliveryAddress: (deliveryAddress: DeliveryAddress) => {
        set((state) => {
          if (!state.user) return state;

          // Preserve all existing user data and update the delivery_address object
          const updatedUser = {
            ...state.user,
            delivery_address: {
              id: deliveryAddress.id,
              user_id: deliveryAddress.user_id,
              address_line_1: deliveryAddress.address_line_1,
              address_line_2: deliveryAddress.address_line_2,
              city: deliveryAddress.city,
              post_code: deliveryAddress.post_code,
              details: deliveryAddress.details,
              created_at: deliveryAddress.created_at,
              updated_at: deliveryAddress.updated_at,
            },
          };

          return {
            user: updatedUser,
          };
        });
      },

      clearDeliveryAddress: () => {
        set((state) => {
          if (!state.user) return state;

          // Preserve all existing user data and clear the delivery_address
          const updatedUser = {
            ...state.user,
            delivery_address: null,
          };

          return {
            user: updatedUser,
          };
        });
      },

      clearUser: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
