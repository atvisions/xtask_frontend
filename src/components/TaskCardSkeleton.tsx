import React from 'react'

export default function TaskCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-background border border-border/40 p-6 animate-pulse">
      {/* Publisher Info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-muted/50 flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-muted/50 rounded w-3/4" />
          <div className="h-3 bg-muted/50 rounded w-1/2" />
        </div>
      </div>

      {/* Task Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-muted/50 rounded w-full" />
        <div className="h-3 bg-muted/50 rounded w-5/6" />
      </div>

      {/* Task Types and Expiry */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Task Types */}
        <div className="flex gap-1.5 flex-1">
          <div className="h-6 bg-muted/50 rounded-full w-16" />
          <div className="h-6 bg-muted/50 rounded-full w-16" />
        </div>

        {/* Expiry Time */}
        <div className="h-6 bg-muted/50 rounded w-16 flex-shrink-0" />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 bg-muted/50 rounded w-16" />
          <div className="h-3 bg-muted/50 rounded w-12" />
        </div>
        <div className="h-2 bg-muted/50 rounded-full" />
      </div>

      {/* Reward and Action */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted/50 rounded" />
          <div className="h-5 bg-muted/50 rounded w-20" />
        </div>
        <div className="h-9 bg-muted/50 rounded-full w-24" />
      </div>
    </div>
  )
}

