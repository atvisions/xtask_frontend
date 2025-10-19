import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  fullWidth?: boolean
  showSearch?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showNewsletter?: boolean
}

export default function Layout({
  children,
  fullWidth = false,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  showNewsletter = false
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <main className={`flex-1 w-full ${fullWidth ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {children}
      </main>
      <Footer showNewsletter={showNewsletter} />
    </div>
  )
}

