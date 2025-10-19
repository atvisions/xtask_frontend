import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import Button from './Button'
import LanguageSwitcher from './LanguageSwitcher'
import { LogIn, Menu, X, User, Search } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
}

export default function Navbar({ searchQuery = '', onSearchChange, showSearch = false }: NavbarProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.taskHall'), path: '/tasks' },
    { label: t('nav.myTasks'), path: '/my-tasks', requireAuth: true },
  ]

  const isActive = (path: string) => {
    return router.pathname === path
  }

  const handleNavClick = (path: string, requireAuth: boolean) => {
    if (requireAuth && !isAuthenticated) {
      router.push('/login')
      return
    }
    router.push(path)
    setMobileMenuOpen(false)
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <nav className="sticky top-0 z-50 pt-4 px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/40 rounded-2xl shadow-sm">
        <div className="flex items-center h-16 px-6">
          {/* Left Side: Logo + Navigation */}
          <div className="flex items-center space-x-8 flex-1">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-semibold text-foreground">
                {t('common.appName')}
              </span>
            </Link>

            {/* Desktop Navigation - 紧跟 Logo */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path, item.requireAuth || false)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-foreground bg-muted/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Search Bar - Show on tasks and my-tasks pages */}
            {(showSearch || router.pathname === '/tasks' || router.pathname === '/my-tasks') && (
              <div className="hidden lg:flex flex-1 max-w-xs mx-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('tasks.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-transparent rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background focus:border-border/40 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold text-xs">
                      {user.twitterUsername?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user.twitterUsername}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={handleLogin}
                className="inline-flex items-center gap-3 pl-4 pr-2 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {t('auth.login')}
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-background">
                  <svg
                    className="w-3.5 h-3.5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted/50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 mx-6 bg-background/95 backdrop-blur-md border border-border/40 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path, item.requireAuth || false)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-border/40 space-y-2">
              <div className="px-3">
                <LanguageSwitcher />
              </div>
              {!isAuthenticated && (
                <button
                  onClick={handleLogin}
                  className="w-full inline-flex items-center justify-center gap-3 pl-4 pr-2 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {t('auth.login')}
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-background">
                    <svg
                      className="w-3.5 h-3.5 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

