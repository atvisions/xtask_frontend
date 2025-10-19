import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  twitterUsername: string
  twitterId: string
  walletAddress: string
  isVerified: boolean
  balance: number
  createdAt: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  updateBalance: (balance: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) =>
        set({
          isAuthenticated: true,
          user,
          token,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        }),
      updateBalance: (balance) =>
        set((state) => ({
          user: state.user ? { ...state.user, balance } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

