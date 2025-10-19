import React from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { Coins, Clock } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  types: string[]
  reward: number
  totalQuantity: number
  completedQuantity: number
  publisher: string
  publisherAvatar?: string
  expiresAt?: string
}

interface TaskCardProps {
  task: Task
  onViewDetails: () => void
  onClaim: () => void
  claimed?: boolean
}

export default function TaskCard({
  task,
  onViewDetails,
  onClaim,
  claimed = false,
}: TaskCardProps) {
  const { t } = useTranslation()

  const getTypeLabel = (type: string) => {
    return t(`tasks.taskTypes.${type}`)
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      follow: 'default',
      like: 'secondary',
      retweet: 'outline',
      comment: 'default',
      quote: 'secondary',
    }
    return colors[type] || 'default'
  }

  const remaining = task.totalQuantity - task.completedQuantity
  const progress = (task.completedQuantity / task.totalQuantity) * 100

  // Generate avatar from publisher name
  const getPublisherInitial = () => {
    return task.publisher?.[1]?.toUpperCase() || 'U'
  }

  // Generate color from publisher name
  const getAvatarColor = () => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
    ]
    const index = task.publisher?.charCodeAt(0) % colors.length || 0
    return colors[index]
  }

  // Format expiry time
  const getExpiryInfo = () => {
    if (!task.expiresAt) return null

    const now = new Date()
    const expiryDate = new Date(task.expiresAt)
    const diffMs = expiryDate.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffMs < 0) {
      return { text: t('tasks.expired'), color: 'text-red-600', urgent: true }
    } else if (diffHours < 24) {
      return { text: `${diffHours}${t('tasks.hoursLeft')}`, color: 'text-red-600', urgent: true }
    } else if (diffDays < 3) {
      return { text: `${diffDays}${t('tasks.daysLeft')}`, color: 'text-orange-600', urgent: true }
    } else {
      return { text: `${diffDays}${t('tasks.daysLeft')}`, color: 'text-muted-foreground', urgent: false }
    }
  }

  const expiryInfo = getExpiryInfo()

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-background border border-border/40 hover:border-border/60 hover:shadow-lg transition-all duration-300">
      {/* Task Type Badge - Top Right Corner */}
      {task.types.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 text-xs font-medium bg-muted/80 backdrop-blur-sm text-muted-foreground rounded-full border border-border/40">
            {getTypeLabel(task.types[0])}
          </span>
        </div>
      )}

      {/* Clickable Card Area */}
      <Link href={`/task/${task.id}`} className="block p-6">
        {/* Publisher Info */}
        <div className="flex items-start gap-3 mb-3 pr-16">
        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
          {task.publisherAvatar ? (
            <img
              src={task.publisherAvatar}
              alt={task.publisher}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-semibold text-sm`}>
              {getPublisherInitial()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">{task.publisher}</p>
        </div>
      </div>

      {/* Task Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
        {task.description}
      </p>

      {/* Progress */}
      <div className="mb-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{t('tasks.progress')}</span>
          <span className="font-medium">
            {task.completedQuantity} / {task.totalQuantity}
          </span>
        </div>
        <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

        {/* Reward and Expiry Time */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-green-600" />
            <span className="text-lg font-bold text-green-600">
              {task.reward} USDT
            </span>
          </div>

          {/* Expiry Time */}
          {expiryInfo && (
            <div className={`flex items-center gap-1 text-xs font-medium ${expiryInfo.color} flex-shrink-0 whitespace-nowrap`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{expiryInfo.text}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Claim Button - Outside Link to prevent nested interaction */}
      <div className="px-6 pb-6">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClaim()
          }}
          disabled={claimed || remaining === 0}
          className={`w-full px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            claimed || remaining === 0
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90'
          }`}
        >
          {claimed
            ? t('tasks.claimed')
            : remaining === 0
            ? t('tasks.taskFull')
            : t('tasks.claimTask')}
        </button>
      </div>
    </div>
  )
}
