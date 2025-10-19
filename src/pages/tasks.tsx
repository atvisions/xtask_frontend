import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import TaskCard from '@/components/TaskCard'
import TaskCardSkeleton from '@/components/TaskCardSkeleton'
import TaskDetailModal from '@/components/TaskDetailModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import mockApi from '@/services/mockApi'
import toast from 'react-hot-toast'
import { Filter, ArrowUpDown, Plus, UserPlus, Heart, Repeat2, MessageCircle, Quote, ChevronDown, Layers } from 'lucide-react'

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
  status: string
  createdAt: string
}

export default function TasksPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [claimedTasks, setClaimedTasks] = useState<Set<string>>(new Set())

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const response = await mockApi.tasks.getAll()
      if (response.success) {
        setTasks(response.data)
      }
    } catch (error) {
      console.error('Failed to load tasks:', error)
      toast.error(t('errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task)
    setDetailModalOpen(true)
  }

  const handleClaimTask = async (taskId: string) => {
    if (!isAuthenticated) {
      toast.error(t('auth.loginRequired'))
      // TODO: Open login modal
      return
    }

    try {
      const response = await mockApi.tasks.claim(taskId)
      if (response.success) {
        toast.success(t('tasks.claimSuccess'))
        setClaimedTasks(new Set([...claimedTasks, taskId]))
        // Optionally navigate to my tasks
        setTimeout(() => {
          router.push('/my-tasks')
        }, 1500)
      }
    } catch (error) {
      console.error('Failed to claim task:', error)
      toast.error(t('tasks.claimFailed'))
    }
  }

  const handlePublishTask = () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    // TODO: Open publish task modal
    alert('Open publish task modal')
  }

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Category filter
      if (selectedCategory !== 'all' && !task.types.includes(selectedCategory)) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'reward-high':
          return b.reward - a.reward
        case 'reward-low':
          return a.reward - b.reward
        case 'expiring-soon':
          // Sort by expiry date (earliest first)
          if (!a.expiresAt && !b.expiresAt) return 0
          if (!a.expiresAt) return 1
          if (!b.expiresAt) return -1
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
        case 'latest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const getCategoryIcon = (value: string) => {
    const iconClass = "w-4 h-4"
    switch (value) {
      case 'all':
        return <Layers className={iconClass} />
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

  const categories = [
    { value: 'all', label: t('tasks.categories.all'), icon: 'all' },
    { value: 'follow', label: t('tasks.taskTypes.follow'), icon: 'follow' },
    { value: 'like', label: t('tasks.taskTypes.like'), icon: 'like' },
    { value: 'retweet', label: t('tasks.taskTypes.retweet'), icon: 'retweet' },
    { value: 'comment', label: t('tasks.taskTypes.comment'), icon: 'comment' },
    { value: 'quote', label: t('tasks.taskTypes.quote'), icon: 'quote' },
  ]

  const sortOptions = [
    { value: 'latest', label: t('tasks.sort.latest') },
    { value: 'expiring-soon', label: t('tasks.sort.expiringSoon') },
    { value: 'reward-high', label: t('tasks.sort.rewardHigh') },
    { value: 'reward-low', label: t('tasks.sort.rewardLow') },
  ]

  return (
    <Layout
      showSearch={true}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t('tasks.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('tasks.subtitle')}</p>
          </div>
          <button
            onClick={handlePublishTask}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            {t('tasks.publishTask')}
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-5">
          {/* Category and Sort Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-background border border-border/40 text-muted-foreground hover:border-border/60 hover:text-foreground'
                  }`}
                >
                  {getCategoryIcon(category.value)}
                  {category.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="inline-flex items-center justify-between gap-3 w-full sm:w-auto sm:min-w-[200px] px-4 py-2.5 bg-background border border-border/40 rounded-lg text-sm text-foreground hover:border-border/60 transition-all"
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {sortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-full sm:min-w-[200px] bg-background border border-border/40 rounded-lg shadow-lg overflow-hidden z-20">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setSortDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          sortBy === option.value
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Results Count - Always show to prevent layout shift */}
        <div className="text-sm text-muted-foreground min-h-[20px]">
          {loading ? (
            // Placeholder during loading
            <span className="opacity-0">
              {t('tasks.showingResults', { count: 0, total: 1247 })}
            </span>
          ) : filteredTasks.length > 0 ? (
            t('tasks.showingResults', { count: filteredTasks.length, total: 1247 })
          ) : null}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 mb-4">{t('tasks.noTasks')}</p>
            <Button onClick={handlePublishTask}>{t('tasks.publishTask')}</Button>
          </div>
        )}

        {/* Task Grid */}
        {!loading && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={() => handleViewDetails(task)}
                onClaim={() => handleClaimTask(task.id)}
                claimed={claimedTasks.has(task.id)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-muted-foreground mb-2">{t('tasks.noResults')}</p>
            <p className="text-sm text-muted-foreground">{t('tasks.tryDifferentFilters')}</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onClaim={() => selectedTask && handleClaimTask(selectedTask.id)}
        claimed={selectedTask ? claimedTasks.has(selectedTask.id) : false}
      />
    </Layout>
  )
}

