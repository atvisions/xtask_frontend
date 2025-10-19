import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import mockApi from '@/services/mockApi'
import { Twitter, ArrowRight, TestTube } from 'lucide-react'
import verifiedUserData from '../../mock-data/user.json'
import unverifiedUserData from '../../mock-data/unverified-user.json'
import twitterOnlyUserData from '../../mock-data/twitter-only-user.json'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTwitterLogin = async () => {
    setLoading(true)
    setError('')

    try {
      // Step 1: Twitter OAuth (mock)
      const twitterResponse = await mockApi.auth.twitterLogin()

      if (!twitterResponse.success) {
        throw new Error('Twitter login failed')
      }

      // Step 2: Connect wallet (mock - in real app this would trigger MetaMask)
      const mockWalletAddress = '0x' + Math.random().toString(16).substring(2, 42)
      const walletResponse = await mockApi.auth.connectWallet(mockWalletAddress)

      if (!walletResponse.success) {
        throw new Error('Wallet connection failed')
      }

      // Step 3: Verify signature (mock)
      const mockSignature = '0x' + Math.random().toString(16).substring(2, 130)
      const verifyResponse = await mockApi.auth.verifySignature(mockWalletAddress, mockSignature)

      if (!verifyResponse.success) {
        throw new Error('Signature verification failed')
      }

      // Login successful
      login(verifyResponse.data.user, verifyResponse.data.token)

      // Redirect to tasks page
      router.push('/tasks')
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Test login functions
  const handleTestLoginVerified = () => {
    login(verifiedUserData as any, 'mock-token-verified')
    router.push('/tasks')
  }

  const handleTestLoginUnverified = () => {
    login(unverifiedUserData as any, 'mock-token-unverified')
    router.push('/verify')
  }

  const handleTestLoginTwitterOnly = () => {
    login(twitterOnlyUserData as any, 'mock-token-twitter-only')
    router.push('/verify')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/looper-pattern.svg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-background/80 backdrop-blur-xl border border-border/40 rounded-3xl p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="KOL.Network"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                KOL.Network
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Connect with Twitter to start earning rewards
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Twitter Login Button */}
          <button
            onClick={handleTwitterLogin}
            disabled={loading}
            className="group relative w-full inline-flex items-center justify-center gap-3 px-6 py-4 text-base font-semibold text-white bg-[#1DA1F2] rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#1DA1F2]/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Twitter className="w-5 h-5" />
            <span className="flex-1">
              {loading ? 'Connecting...' : 'Continue with Twitter'}
            </span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Test Login Buttons (Development Only) */}
          <div className="mt-6 pt-6 border-t border-border/40">
            <div className="flex items-center gap-2 mb-3">
              <TestTube className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Test Login (Dev Only)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleTestLoginVerified}
                className="px-3 py-2 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                ✓ Verified
              </button>
              <button
                onClick={handleTestLoginUnverified}
                className="px-3 py-2 text-xs font-medium bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                ⚠ Has Wallet
              </button>
              <button
                onClick={handleTestLoginTwitterOnly}
                className="px-3 py-2 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                🐦 Twitter Only
              </button>
            </div>
          </div>

          {/* Info Text */}
          <div className="mt-8 text-xs text-center text-muted-foreground leading-relaxed">
            <div>By continuing, you agree to our</div>
            <div>
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

