import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import mockApi from '@/services/mockApi'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  Coins, 
  Calendar, 
  TrendingUp, 
  Clock,
  UserPlus,
  Heart,
  Repeat2,
  MessageCircle,
  Quote,
  CheckCircle2,
  AlertCircle,
  Share2,
  ExternalLink
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Task {
  id: string
  title: string
  description: string
  types: string[]
  reward: number
  totalQuantity: number
  completedQuantity: number
  publisher: string
  publisherId: string
  publisherAvatar?: string
  status: string
  createdAt: string
  expiresAt?: string
}

export default function TaskDetailPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated } = useAuthStore()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    if (id) {
      loadTask()
    }
  }, [id])

  const loadTask = async () => {
    try {
      setLoading(true)
      const response = await mockApi.tasks.getAll()
      if (response.success) {
        const foundTask = response.data.find((t: Task) => t.id === id)
        if (foundTask) {
          setTask(foundTask)
        } else {
          toast.error(t('tasks.taskNotFound'))
          router.push('/tasks')
        }
      }
    } catch (error) {
      console.error('Failed to load task:', error)
      toast.error(t('errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleClaimTask = async () => {
    if (!isAuthenticated) {
      toast.error(t('auth.loginRequired'))
      router.push('/login')
      return
    }

    // Check if user is verified
    const { user } = useAuthStore.getState()
    if (!user?.isVerified) {
      toast.error(t('verify.verificationRequired'))
      setTimeout(() => {
        router.push('/verify')
      }, 1500)
      return
    }

    try {
      setClaiming(true)
      const response = await mockApi.tasks.claim(task!.id)
      if (response.success) {
        toast.success(t('tasks.claimSuccess'))
        setClaimed(true)
        setTimeout(() => {
          router.push('/my-tasks')
        }, 1500)
      }
    } catch (error) {
      console.error('Failed to claim task:', error)
      toast.error(t('tasks.claimFailed'))
    } finally {
      setClaiming(false)
    }
  }

  const getTypeIcon = (type: string) => {
    const iconClass = "w-5 h-5"
    switch (type) {
      case 'follow':
        return <UserPlus className={iconClass} />
      case 'like':
        return <Heart className={iconClass} />
      case 'retweet':
        return <Repeat2 className={iconClass} />
      case 'comment':
        return <MessageCircle className={iconClass} />
      case 'quote':
        return <Quote className={iconClass} />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    return t(`tasks.taskTypes.${type}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null
    
    const now = new Date().getTime()
    const expiry = new Date(expiresAt).getTime()
    const diff = expiry - now
    
    if (diff <= 0) return { text: t('tasks.expired'), color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 3) {
      return { 
        text: `${days} ${t('myTasks.daysRemaining')}`, 
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    } else if (days >= 1) {
      return { 
        text: `${days} ${t('myTasks.daysRemaining')} ${hours} ${t('myTasks.hoursRemaining')}`, 
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    } else {
      return { 
        text: `${hours} ${t('myTasks.hoursRemaining')}`, 
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!task) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('tasks.taskNotFound')}</h2>
          <p className="text-muted-foreground mb-6">{t('tasks.taskNotFoundDesc')}</p>
          <Link href="/tasks">
            <Button>{t('tasks.backToTaskHall')}</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  const remaining = task.totalQuantity - task.completedQuantity
  const progress = (task.completedQuantity / task.totalQuantity) * 100
  const timeRemaining = getTimeRemaining(task.expiresAt)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Link 
          href="/tasks"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('tasks.backToTaskHall')}
        </Link>

        {/* Main Content Card */}
        <div className="bg-background border border-border/40 rounded-2xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 p-8 border-b border-border/40">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-3">{task.title}</h1>
                
                {/* Task Types */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {task.types.map((type) => (
                    <Badge 
                      key={type} 
                      variant="secondary"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
                    >
                      {getTypeIcon(type)}
                      {getTypeLabel(type)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share Button */}
              <button className="p-2 rounded-lg hover:bg-background/50 transition-colors">
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Reward */}
              <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-muted-foreground">{t('tasks.taskReward')}</p>
                </div>
                <p className="text-2xl font-bold text-green-600">{task.reward} USDT</p>
              </div>

              {/* Remaining */}
              <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <p className="text-sm font-medium text-muted-foreground">{t('tasks.remainingQuantity')}</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{remaining}</p>
              </div>

              {/* Time Remaining */}
              {timeRemaining && (
                <div className={`bg-background/80 backdrop-blur-sm rounded-xl p-4 border ${timeRemaining.borderColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className={`w-5 h-5 ${timeRemaining.color}`} />
                    <p className="text-sm font-medium text-muted-foreground">{t('tasks.timeRemaining')}</p>
                  </div>
                  <p className={`text-xl font-bold ${timeRemaining.color}`}>{timeRemaining.text}</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Publisher Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {t('tasks.publisher')}
              </h3>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/40">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                  {task.publisherAvatar ? (
                    <img 
                      src={task.publisherAvatar} 
                      alt={task.publisher} 
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    task.publisher?.[1]?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-foreground">{task.publisher}</p>
                  <p className="text-sm text-muted-foreground">{t('tasks.verifiedPublisher')}</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  {t('tasks.viewProfile')}
                </button>
              </div>
            </div>

            {/* Task Description */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {t('tasks.taskDescription')}
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-6 rounded-xl border border-border/40">
                  {task.description}
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                {t('tasks.progress')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('tasks.completedQuantity')}</span>
                  <span className="font-semibold text-foreground">
                    {task.completedQuantity} / {task.totalQuantity}
                  </span>
                </div>
                <div className="relative w-full bg-muted rounded-full h-4 overflow-hidden border border-border/40">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {progress.toFixed(1)}% {t('tasks.completed')}
                </p>
              </div>
            </div>

            {/* Task Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/40">
                <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('tasks.publishedAt')}</p>
                  <p className="text-sm font-medium text-foreground">{formatDate(task.createdAt)}</p>
                </div>
              </div>
              
              {task.expiresAt && (
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/40">
                  <Clock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{t('tasks.expiresAt')}</p>
                    <p className="text-sm font-medium text-foreground">{formatDate(task.expiresAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-muted/30 px-8 py-6 border-t border-border/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p>{t('tasks.claimNotice')}</p>
              </div>
              
              <Button
                onClick={handleClaimTask}
                disabled={claimed || remaining === 0 || claiming}
                size="lg"
                className="w-full sm:w-auto min-w-[200px]"
              >
                {claiming
                  ? t('tasks.claiming')
                  : claimed
                  ? t('tasks.claimed')
                  : remaining === 0
                  ? t('tasks.taskFull')
                  : t('tasks.claimTask')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

