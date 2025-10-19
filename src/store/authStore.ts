import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  twitterUsername: string
  twitterId: string
  avatar: string
  walletAddress: string | null
  walletConnectedAt: string | null
  isVerified: boolean
  verificationPaidAt: string | null
  verificationTxHash: string | null
  balance: number
  totalEarned: number
  tasksCompleted: number
  tasksPublished: number
  successRate: number
  createdAt: string
  // Twitter account data
  twitterCreatedAt?: string | null
  followersCount?: number
  followingCount?: number
  tweetsCount?: number
  twitterDataUpdatedAt?: string | null
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null

  // Computed states
  hasWallet: () => boolean
  needsVerification: () => boolean

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  updateBalance: (balance: number) => void
  connectWallet: (walletAddress: string) => void
  disconnectWallet: () => void
  updateVerification: (txHash: string) => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      // Computed states
      hasWallet: () => {
        const user = get().user
        return !!user?.walletAddress
      },

      needsVerification: () => {
        const user = get().user
        return !!user?.walletAddress && !user?.isVerified
      },

      // Actions
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

      connectWallet: (walletAddress) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                walletAddress,
                walletConnectedAt: new Date().toISOString(),
              }
            : null,
        })),

      disconnectWallet: () =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                walletAddress: null,
                walletConnectedAt: null,
                isVerified: false,
                verificationPaidAt: null,
                verificationTxHash: null,
              }
            : null,
        })),

      updateVerification: (txHash) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                isVerified: true,
                verificationPaidAt: new Date().toISOString(),
                verificationTxHash: txHash,
              }
            : null,
        })),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      updateTwitterData: (data) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                followersCount: data.followersCount ?? state.user.followersCount ?? 0,
                followingCount: data.followingCount ?? state.user.followingCount ?? 0,
                tweetsCount: data.tweetsCount ?? state.user.tweetsCount ?? 0,
                twitterCreatedAt: data.twitterCreatedAt || state.user.twitterCreatedAt || null,
                twitterDataUpdatedAt: new Date().toISOString(),
              }
            : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

