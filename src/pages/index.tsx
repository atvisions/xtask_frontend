import React from 'react'
import Layout from '@/components/Layout'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import FAQSection from '@/components/FAQSection'

export default function Home() {
  return (
    <>
      {/* Looper Pattern SVG Background - Full Page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/looper-pattern.svg"
          alt=""
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <Layout fullWidth showNewsletter={true}>
        {/* Hero Section */}
        <div className="relative z-10">
          <HeroSection />
        </div>

        {/* Features Section */}
        <div className="relative z-10">
          <FeaturesSection />
        </div>

        {/* Testimonials Section */}
        <div className="relative z-10">
          <TestimonialsSection />
        </div>

        {/* FAQ Section */}
        <div className="relative z-10">
          <FAQSection />
        </div>
      </Layout>
    </>
  )
}

