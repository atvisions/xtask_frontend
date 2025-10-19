import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Link2, Zap, Users, Shield } from 'lucide-react'

export default function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    {
      icon: Link2,
      title: 'Diverse Tasks',
      description: 'Multiple Twitter task types including follow, like, retweet, comment, and quote. Earn USDT rewards with simple actions',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      icon: Zap,
      title: 'Instant Rewards',
      description: 'Get USDT rewards immediately after task verification. Funds are automatically distributed by smart contracts, secure and transparent',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      icon: Users,
      title: 'Active Community',
      description: 'Join the global KOL community, grow with like-minded creators, and promote quality projects together',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built on blockchain smart contracts for guaranteed fund security. All transactions are publicly transparent and traceable',
      iconBg: 'bg-orange-500/10',
      iconColor: 'text-orange-500',
    },
  ]

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span>✨</span>
            <span>Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              KOL.Network
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the platform that connects KOLs with brands and helps you earn rewards effortlessly
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-background border border-border/40 p-6 hover:border-border/60 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-xl ${feature.iconBg}`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

