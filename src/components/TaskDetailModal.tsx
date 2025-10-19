import React from 'react'
import Button from './Button'
import { useTranslation } from '@/hooks/useTranslation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Badge } from './ui/badge'
import { Coins, User, Package, TrendingUp } from 'lucide-react'

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
}

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onClaim: () => void
  claimed?: boolean
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onClaim,
  claimed = false,
}: TaskDetailModalProps) {
  const { t } = useTranslation()

  if (!task) return null

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('tasks.taskDetails')}</DialogTitle>
          <DialogDescription>
            {t('tasks.taskDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Publisher Info */}
          <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {task.publisherAvatar ? (
                <img src={task.publisherAvatar} alt={task.publisher} className="w-full h-full rounded-full object-cover" />
              ) : (
                getPublisherInitial()
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('tasks.publisher')}</p>
              <p className="text-lg font-semibold">{task.publisher}</p>
            </div>
          </div>

          {/* Task Title */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Package className="w-4 h-4" />
              {t('tasks.taskTitle')}
            </h4>
            <p className="text-xl font-bold">{task.title}</p>
          </div>

          {/* Task Description */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              {t('tasks.taskDescription')}
            </h4>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed bg-accent/50 p-4 rounded-lg">
              {task.description}
            </p>
          </div>

          {/* Task Types */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {t('tasks.taskType')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {task.types.map((type) => (
                <Badge key={type} variant={getTypeColor(type) as any} className="text-sm px-3 py-1">
                  {getTypeLabel(type)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Task Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Reward */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-700">{t('tasks.taskReward')}</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{task.reward} USDT</p>
            </div>

            {/* Remaining */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-700">{t('tasks.remainingQuantity')}</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{remaining}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('tasks.progress')}</span>
              <span className="font-medium">
                {task.completedQuantity} / {task.totalQuantity}
              </span>
            </div>
            <div className="relative w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${(task.completedQuantity / task.totalQuantity) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={() => {
              onClaim()
              onClose()
            }}
            disabled={claimed || remaining === 0}
            className="gap-2"
          >
            {claimed
              ? t('tasks.claimed')
              : remaining === 0
              ? t('tasks.taskFull')
              : t('tasks.claimTask')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

