import React from 'react'

export default function BackgroundPattern() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[500px] opacity-30 pointer-events-none">
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 2260 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pattern-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="30%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="pattern-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            <stop offset="30%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="pattern-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
            <stop offset="30%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="70%" stopColor="hsl(var(--primary))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Complex flowing curved lines inspired by looper pattern */}
        {/* Layer 1 - Most prominent */}
        <path
          d="M0,400 Q400,300 800,400 T1600,400 T2260,400"
          stroke="url(#pattern-gradient-1)"
          strokeWidth="3"
          fill="none"
          opacity="0.9"
        />
        <path
          d="M0,450 Q450,350 900,450 T1800,450 T2260,450"
          stroke="url(#pattern-gradient-1)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.7"
        />

        {/* Layer 2 - Medium prominence */}
        <path
          d="M0,500 Q500,400 1000,500 T2000,500 T2260,500"
          stroke="url(#pattern-gradient-2)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M0,550 Q550,450 1100,550 T2200,550 T2260,550"
          stroke="url(#pattern-gradient-2)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />

        {/* Layer 3 - Subtle background */}
        <path
          d="M0,600 Q600,500 1200,600 T2260,600"
          stroke="url(#pattern-gradient-3)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0,650 Q650,550 1300,650 T2260,650"
          stroke="url(#pattern-gradient-3)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M0,700 Q700,600 1400,700 T2260,700"
          stroke="url(#pattern-gradient-3)"
          strokeWidth="1"
          fill="none"
          opacity="0.2"
        />
        <path
          d="M0,750 Q750,650 1500,750 T2260,750"
          stroke="url(#pattern-gradient-3)"
          strokeWidth="1"
          fill="none"
          opacity="0.15"
        />
      </svg>
    </div>
  )
}

