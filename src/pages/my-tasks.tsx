import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import SubmitTaskModal from '@/components/SubmitTaskModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import mockApi from '@/services/mockApi'
import { Clock, CheckCircle, XCircle, AlertCircle, Upload, ExternalLink, Plus, Search as SearchIcon, Briefcase, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

interface ClaimedTask {
  id: string
  taskId: string
  task: {
    title: string
    types: string[]
    reward: number
  }
  status: 'ongoing' | 'verifying' | 'completed' | 'failed' | 'expired'
  claimedAt: string
  expiresAt: string
  proof: {
    screenshot?: string
    tweetLink?: string
  } | null
  submittedAt: string | null
  completedAt: string | null
  failureReason: string | null
}

interface PublishedTask {
  id: string
  title: string
  description: string
  types: string[]
  reward: number
  totalQuantity: number
  completedQuantity: number
  status: string
  createdAt: string
}

export default function MyTasksPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'claimed' | 'published'>('claimed')
  const [claimedTasks, setClaimedTasks] = useState<ClaimedTask[]>([])
  const [publishedTasks, setPublishedTasks] = useState<PublishedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [submitModalOpen, setSubmitModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ClaimedTask | null>(null)
  const [claimedStatusFilter, setClaimedStatusFilter] = useState<string>('all')
  const [publishedStatusFilter, setPublishedStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadTasks()
  }, [isAuthenticated])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const [claimedResponse, publishedResponse] = await Promise.all([
        mockApi.myTasks.getClaimed(),
        mockApi.myTasks.getPublished(),
      ])

      if (claimedResponse.success) {
        setClaimedTasks(claimedResponse.data)
      }
      if (publishedResponse.success) {
        setPublishedTasks(publishedResponse.data)
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const handlePublishTask = () => {
    router.push('/publish-task')
  }

  const handleGoToTaskHall = () => {
    router.push('/tasks')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <Clock className="w-5 h-5 text-blue-600" />
      case 'verifying':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'expired':
        return <XCircle className="w-5 h-5 text-gray-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'verifying':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'expired':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()

    if (diff < 0) return t('myTasks.taskExpired')

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours} ${t('myTasks.hours')} ${minutes} ${t('myTasks.minutes')}`
    }
    return `${minutes} ${t('myTasks.minutes')}`
  }

  const handleSubmitTask = (task: ClaimedTask) => {
    setSelectedTask(task)
    setSubmitModalOpen(true)
  }

  const handleSubmitProof = async (proof: { screenshot?: File; tweetLink?: string }) => {
    try {
      // TODO: Upload screenshot and submit proof
      toast.success(t('myTasks.submitSuccess'))
      setSubmitModalOpen(false)
      setSelectedTask(null)
      // Reload tasks
      loadTasks()
    } catch (error) {
      console.error('Failed to submit proof:', error)
      toast.error(t('myTasks.submitFailed'))
    }
  }

  // Filter claimed tasks by status and search query
  const filteredClaimedTasks = claimedTasks.filter((task) => {
    const matchesStatus = claimedStatusFilter === 'all' || task.status === claimedStatusFilter
    const matchesSearch = !searchQuery || task.task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Filter published tasks by status and search query
  const filteredPublishedTasks = publishedTasks.filter((task) => {
    const matchesStatus = publishedStatusFilter === 'all' || task.status === publishedStatusFilter
    const matchesSearch = !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Status options for claimed tasks
  const claimedStatusOptions = [
    { value: 'all', label: t('tasks.filter.all') },
    { value: 'ongoing', label: t('myTasks.status.ongoing') },
    { value: 'verifying', label: t('myTasks.status.verifying') },
    { value: 'completed', label: t('myTasks.status.completed') },
    { value: 'failed', label: t('myTasks.status.failed') },
    { value: 'expired', label: t('myTasks.status.expired') },
  ]

  // Status options for published tasks
  const publishedStatusOptions = [
    { value: 'all', label: t('tasks.filter.all') },
    { value: 'active', label: t('tasks.status.active') },
    { value: 'paused', label: t('tasks.status.paused') },
    { value: 'completed', label: t('tasks.status.completed') },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t('myTasks.title')}</h1>
        </div>

        {/* Tabs */}
        <div className="inline-flex p-1 bg-muted/30 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('claimed')}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'claimed'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            {t('myTasks.claimedTasks')}
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'published'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            {t('myTasks.publishedTasks')}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-muted-foreground">{t('common.loading')}</div>
          </div>
        ) : (
          <>
            {/* Claimed Tasks */}
            {activeTab === 'claimed' && (
              <div className="space-y-6">
                {/* Status Filter */}
                <div className="flex items-center justify-between gap-4 min-h-[42px]">
                  <div className="flex flex-wrap gap-2">
                    {claimedStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setClaimedStatusFilter(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          claimedStatusFilter === option.value
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-background border border-border/40 text-muted-foreground hover:border-border/60 hover:text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {/* Empty space to maintain consistent height */}
                  <div className="w-[140px]" />
                </div>

                {/* Tasks List */}
                {filteredClaimedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <SearchIcon className="w-12 h-12 text-primary/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {claimedTasks.length === 0 ? t('myTasks.noClaimedTasks') : t('myTasks.noMatchingTasks')}
                    </h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      {claimedTasks.length === 0
                        ? t('myTasks.noClaimedTasksDesc')
                        : t('myTasks.noMatchingTasksDesc')
                      }
                    </p>
                    {claimedTasks.length === 0 && (
                      <button
                        onClick={handleGoToTaskHall}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <SearchIcon className="w-5 h-5" />
                        {t('myTasks.browseTaskHall')}
                      </button>
                    )}
                  </div>
                ) : (
                  filteredClaimedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-background border border-border/40 rounded-2xl p-6 hover:border-border/60 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusIcon(task.status)}
                            <h3 className="text-lg font-semibold text-foreground">
                              {task.task.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {task.task.types.map((type) => (
                              <span
                                key={type}
                                className="px-2.5 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full"
                              >
                                {t(`tasks.taskTypes.${type}`)}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-600">
                                {task.task.reward} USDT
                              </span>
                            </div>
                            {task.status === 'ongoing' && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{formatTimeRemaining(task.expiresAt)}</span>
                              </div>
                            )}
                            {task.completedAt && (
                              <div>
                                {t('myTasks.completedTime')}: {new Date(task.completedAt).toLocaleString()}
                              </div>
                            )}
                          </div>

                          {task.failureReason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-700">
                                <span className="font-medium">{t('myTasks.failureReason')}: </span>
                                {task.failureReason}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <span
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {t(`myTasks.status.${task.status}`)}
                          </span>

                          {task.status === 'ongoing' && (
                            <button
                              onClick={() => handleSubmitTask(task)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                              <Upload className="w-4 h-4" />
                              {t('myTasks.submitTask')}
                            </button>
                          )}

                          {task.proof?.tweetLink && (
                            <a
                              href={task.proof.tweetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                              {t('myTasks.tweetLink')}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Published Tasks */}
            {activeTab === 'published' && (
              <div className="space-y-6">
                {/* Status Filter and Publish Button */}
                <div className="flex items-center justify-between gap-4 min-h-[42px]">
                  <div className="flex flex-wrap gap-2">
                    {publishedStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPublishedStatusFilter(option.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          publishedStatusFilter === option.value
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-background border border-border/40 text-muted-foreground hover:border-border/60 hover:text-foreground'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handlePublishTask}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    {t('tasks.publishTask')}
                  </button>
                </div>

                {/* Tasks List */}
                {filteredPublishedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      <Plus className="w-12 h-12 text-primary/60" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {publishedTasks.length === 0 ? t('myTasks.noPublishedTasks') : t('myTasks.noMatchingTasks')}
                    </h3>
                    <p className="text-muted-foreground text-center mb-6 max-w-md">
                      {publishedTasks.length === 0
                        ? t('myTasks.noPublishedTasksDesc')
                        : t('myTasks.noMatchingTasksDesc')
                      }
                    </p>
                    {publishedTasks.length === 0 && (
                      <button
                        onClick={handlePublishTask}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                        {t('tasks.publishTask')}
                      </button>
                    )}
                  </div>
                ) : (
                  filteredPublishedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-background border border-border/40 rounded-2xl p-6 hover:border-border/60 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {task.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {task.types.map((type) => (
                              <span
                                key={type}
                                className="px-2.5 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full"
                              >
                                {t(`tasks.taskTypes.${type}`)}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium text-green-600">{task.reward} USDT</span>
                              {' × '}
                              {task.totalQuantity}
                            </div>
                            <div>
                              {t('tasks.progress')}: {task.completedQuantity} / {task.totalQuantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Submit Task Modal */}
      <SubmitTaskModal
        isOpen={submitModalOpen}
        onClose={() => {
          setSubmitModalOpen(false)
          setSelectedTask(null)
        }}
        taskTitle={selectedTask?.task.title || ''}
        onSubmit={handleSubmitProof}
      />
    </Layout>
  )
}

