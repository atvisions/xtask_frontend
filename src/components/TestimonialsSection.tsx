import React from 'react'
import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Crypto Influencer',
      avatar: '/users/design-papa@2x.3e76d186.webp',
      content: 'KOL.Network has transformed how I monetize my social media presence. The tasks are genuine and the rewards are instant!',
      rating: 5,
      earnings: '$12,450',
    },
    {
      name: 'Jake Morrison',
      role: 'Tech Reviewer',
      avatar: '/users/jake-mor@2x.30505b7a.webp',
      content: 'Finally, a platform that values quality content creators. I\'ve completed over 200 tasks and the experience has been seamless.',
      rating: 5,
      earnings: '$8,920',
    },
    {
      name: 'Mark Johnson',
      role: 'Gaming Streamer',
      avatar: '/users/mark-johnson@2x.d988645b.webp',
      content: 'The verification process is quick and the task variety keeps things interesting. Highly recommend for any content creator!',
      rating: 5,
      earnings: '$15,680',
    },
    {
      name: 'Josh Williams',
      role: 'Lifestyle Blogger',
      avatar: '/users/josh@2x.9d9f1a6b.webp',
      content: 'Best decision I made this year. The community is supportive and the platform is incredibly user-friendly.',
      rating: 5,
      earnings: '$9,340',
    },
    {
      name: 'Shahed Khan',
      role: 'DeFi Analyst',
      avatar: '/users/shahed-khan@2x.09ee0b4c.webp',
      content: 'Transparent, reliable, and rewarding. KOL.Network sets the standard for creator monetization platforms.',
      rating: 5,
      earnings: '$18,750',
    },
    {
      name: 'Emma Davis',
      role: 'Fashion Influencer',
      avatar: '/users/design-papa@2x.3e76d186.webp',
      content: 'Love how easy it is to find tasks that align with my brand. The payment system is fast and secure.',
      rating: 5,
      earnings: '$11,200',
    },
  ]

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Creators Worldwide
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied creators who are earning rewards daily
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-background border border-border/40 p-8 hover:border-border/60 hover:shadow-lg transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              {/* Earnings Badge */}
              <div className="mt-4 pt-4 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total Earned</span>
                  <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {testimonial.earnings}
                  </span>
                </div>
              </div>

              {/* Decorative Gradient */}
              <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br from-primary to-purple-600 opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-300 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

