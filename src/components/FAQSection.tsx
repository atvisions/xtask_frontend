import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'What is KOL.Network?',
      answer: 'KOL.Network is a platform that connects Key Opinion Leaders (KOLs) and content creators with brands. You can complete tasks like social media engagement, content creation, and reviews to earn rewards in cryptocurrency.',
    },
    {
      question: 'How do I start earning?',
      answer: 'Simply sign up for a free account, complete your profile verification, browse available tasks, and start completing them. Once verified, you\'ll receive your rewards directly to your wallet.',
    },
    {
      question: 'What types of tasks are available?',
      answer: 'We offer various tasks including social media posts, Twitter/X engagement, content creation, product reviews, community participation, and more. Tasks are categorized by difficulty and reward amount.',
    },
    {
      question: 'How and when do I get paid?',
      answer: 'Payments are processed in USDT and sent directly to your connected wallet. Most tasks are verified and paid within 24-48 hours of completion. Instant payment tasks are available for verified users.',
    },
    {
      question: 'Is there a minimum withdrawal amount?',
      answer: 'Yes, the minimum withdrawal amount is 10 USDT. This helps us minimize transaction fees and ensure efficient processing of payments.',
    },
    {
      question: 'How do I verify my account?',
      answer: 'Account verification involves connecting your social media accounts and completing a simple KYC process. This helps us ensure quality and prevent fraud. Verification typically takes 1-2 business days.',
    },
    {
      question: 'Can I complete tasks from any country?',
      answer: 'Yes! KOL.Network is available globally. However, some tasks may be region-specific based on the brand\'s requirements. You\'ll see available tasks based on your location.',
    },
    {
      question: 'What if a task is rejected?',
      answer: 'If a task is rejected, you\'ll receive detailed feedback explaining why. You can resubmit the task after making corrections, or contact our support team for assistance.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about KOL.Network
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/40 overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors"
              >
                <span className="font-semibold text-lg pr-8 group-hover:text-primary transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/20">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  )
}

