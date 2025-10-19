import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, Sparkles, Coins, Users, Zap } from 'lucide-react'
import mockApi from '@/services/mockApi'
import { useAuthStore } from '@/store/authStore'

interface Stats {
  totalUsers: number
  totalTasks: number
  totalRewards: number
}

export default function HeroSection() {
  const router = useRouter()
  const { t } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  const [scrollY, setScrollY] = useState(0)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTasks: 0,
    totalRewards: 0,
  })
  const [loading, setLoading] = useState(true)

  // Load stats
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await mockApi.stats.getAll()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate background scale based on scroll
  const bgScale = Math.min(1 + scrollY / 500, 2)
  const bgOpacity = Math.max(1 - scrollY / 300, 0.3)

  const handleCTA = () => {
    if (isAuthenticated) {
      router.push('/tasks')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Subtle gradient orb */}
        <div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `scale(${bgScale})`,
            opacity: bgOpacity * 0.5,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {t('home.hero.badge')}
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight">
              {t('home.hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            {/* CTA Button - Fancy Design */}
            <div className="inline-flex">
              <button
                onClick={handleCTA}
                className="group relative inline-flex items-center gap-2 pl-6 pr-3 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* Text */}
                <span className="relative">{t('home.hero.cta')}</span>

                {/* Arrow Circle Button */}
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-primary transition-all duration-300 group-hover:border-primary group-hover:rotate-45">
                  <ArrowRight className="w-5 h-5 text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </button>
            </div>

            {/* Stats Section - Compact */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {/* Stat 1 - Users */}
              <div className="group relative overflow-hidden rounded-xl bg-white border border-border/40 p-4 hover:border-border/60 hover:shadow-md transition-all duration-300">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {loading ? '...' : `${stats.totalUsers.toLocaleString()}+`}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {t('home.stats.users')}
                  </div>
                </div>
              </div>

              {/* Stat 2 - Tasks */}
              <div className="group relative overflow-hidden rounded-xl bg-white border border-border/40 p-4 hover:border-border/60 hover:shadow-md transition-all duration-300">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {loading ? '...' : `${stats.totalTasks.toLocaleString()}+`}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {t('home.stats.tasks')}
                  </div>
                </div>
              </div>

              {/* Stat 3 - Rewards */}
              <div className="group relative overflow-hidden rounded-xl bg-white border border-border/40 p-4 hover:border-border/60 hover:shadow-md transition-all duration-300">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Coins className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {loading ? '...' : `$${stats.totalRewards.toLocaleString()}`}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {t('home.stats.rewards')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Task Cards Illustration */}
          <div className="relative h-[500px] hidden lg:block">
            {/* Task Card 1 - Back */}
            <div
              className="absolute top-0 right-0 w-80 bg-muted/30 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg p-6 transform rotate-6 hover:rotate-3 transition-transform duration-300"
              style={{ zIndex: 1 }}
            >
              <div className="flex items-start gap-4">
                <img
                  src="/users/design-papa@2x.3e76d186.webp"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-muted/50"
                />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                  <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-muted/50 rounded"></div>
                <div className="h-3 bg-muted/50 rounded w-5/6"></div>
              </div>
              {/* Progress Bar Placeholder */}
              <div className="mt-4">
                <div className="h-2 bg-muted/70 rounded-full w-full"></div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">50 USDT</span>
                </div>
                <div className="h-8 w-20 bg-muted/50 rounded-lg"></div>
              </div>
            </div>

            {/* Task Card 2 - Middle */}
            <div
              className="absolute top-12 right-8 w-80 bg-muted/40 backdrop-blur-sm border border-border/60 rounded-2xl shadow-xl p-6 transform rotate-3 hover:rotate-1 transition-transform duration-300"
              style={{ zIndex: 2 }}
            >
              <div className="flex items-start gap-4">
                <img
                  src="/users/jake-mor@2x.30505b7a.webp"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-muted/60"
                />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/60 rounded w-2/3"></div>
                  <div className="h-3 bg-muted/60 rounded w-1/3"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-muted/60 rounded"></div>
                <div className="h-3 bg-muted/60 rounded w-4/5"></div>
              </div>
              {/* Progress Bar Placeholder */}
              <div className="mt-4">
                <div className="h-2 bg-muted/75 rounded-full w-full"></div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-muted-foreground">100 USDT</span>
                </div>
                <div className="h-8 w-20 bg-muted/60 rounded-lg"></div>
              </div>
            </div>

            {/* Task Card 3 - Front (Featured) */}
            <div
              className="absolute top-24 right-16 w-80 bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-md border border-primary/20 rounded-2xl shadow-2xl p-6 hover:scale-105 transition-transform duration-300"
              style={{ zIndex: 3 }}
            >
              <div className="flex items-start gap-4">
                <img
                  src="/users/mark-johnson@2x.d988645b.webp"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-primary/30"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Follow @KOLNetwork</h3>
                  <p className="text-sm text-muted-foreground">Twitter Task</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Follow our official Twitter account and stay updated with the latest news
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span className="font-medium">1,234 / 10,000</span>
                </div>
                <div className="relative h-2 bg-muted/80 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: '12.34%' }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold text-primary">20 USDT</span>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Start Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

