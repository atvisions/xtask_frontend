import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import mockApi from '@/services/mockApi'
import {
  AlertCircle,
  DollarSign,
  Hash,
  FileText,
  CheckSquare,
  ArrowRight,
  Loader2,
  Link as LinkIcon,
  UserPlus,
  Heart,
  Repeat2,
  MessageCircle,
  Quote
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TaskFormData {
  title: string
  description: string
  type: string  // Changed from types[] to type (single selection)
  targetUrl: string  // New field for target URL
  reward: string
  quantity: string
}

export default function PublishTaskPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuthStore()

  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    type: '',  // Changed from types[] to type
    targetUrl: '',  // New field
    reward: '',
    quantity: '',
  })

  const [errors, setErrors] = useState<Partial<TaskFormData>>({})
  const [loading, setLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const getTaskTypeIcon = (value: string) => {
    const iconClass = "w-5 h-5"
    switch (value) {
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

  const taskTypes = [
    {
      value: 'follow',
      label: t('tasks.taskTypes.follow'),
      placeholder: 'https://twitter.com/username',
      urlLabel: t('publishTask.targetAccount')
    },
    {
      value: 'like',
      label: t('tasks.taskTypes.like'),
      placeholder: 'https://twitter.com/username/status/123456789',
      urlLabel: t('publishTask.targetTweet')
    },
    {
      value: 'retweet',
      label: t('tasks.taskTypes.retweet'),
      placeholder: 'https://twitter.com/username/status/123456789',
      urlLabel: t('publishTask.targetTweet')
    },
    {
      value: 'comment',
      label: t('tasks.taskTypes.comment'),
      placeholder: 'https://twitter.com/username/status/123456789',
      urlLabel: t('publishTask.targetTweet')
    },
    {
      value: 'quote',
      label: t('tasks.taskTypes.quote'),
      placeholder: 'https://twitter.com/username/status/123456789',
      urlLabel: t('publishTask.targetTweet')
    },
  ]

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleTypeSelect = (type: string) => {
    handleInputChange('type', type)
    // Clear targetUrl when changing type
    if (formData.type !== type) {
      handleInputChange('targetUrl', '')
    }
  }

  const getSelectedTypeInfo = () => {
    return taskTypes.find(t => t.value === formData.type)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = t('publishTask.validation.titleRequired')
    } else if (formData.title.length > 200) {
      newErrors.title = t('publishTask.validation.titleTooLong')
    }

    if (!formData.description.trim()) {
      newErrors.description = t('publishTask.validation.descriptionRequired')
    }

    if (!formData.type) {
      newErrors.type = t('publishTask.validation.typeRequired')
    }

    if (!formData.targetUrl.trim()) {
      newErrors.targetUrl = t('publishTask.validation.targetUrlRequired')
    } else if (!formData.targetUrl.startsWith('https://twitter.com/') && !formData.targetUrl.startsWith('https://x.com/')) {
      newErrors.targetUrl = t('publishTask.validation.targetUrlInvalid')
    }

    const rewardNum = parseFloat(formData.reward)
    if (!formData.reward || isNaN(rewardNum)) {
      newErrors.reward = t('publishTask.validation.rewardRequired')
    } else if (rewardNum < 0.1) {
      newErrors.reward = t('publishTask.validation.rewardMin')
    }

    const quantityNum = parseInt(formData.quantity)
    if (!formData.quantity || isNaN(quantityNum)) {
      newErrors.quantity = t('publishTask.validation.quantityRequired')
    } else if (quantityNum < 1) {
      newErrors.quantity = t('publishTask.validation.quantityMin')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotalCost = () => {
    const reward = parseFloat(formData.reward) || 0
    const quantity = parseInt(formData.quantity) || 0
    const subtotal = reward * quantity
    const platformFee = subtotal * 0.05 // 5% platform fee
    const total = subtotal + platformFee
    return { subtotal, platformFee, total }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowConfirmModal(true)
    }
  }

  const handleConfirmPublish = async () => {
    setLoading(true)
    try {
      const { total } = calculateTotalCost()

      // Step 1: Create task
      const taskResponse = await mockApi.tasks.create({
        ...formData,
        reward: parseFloat(formData.reward),
        totalQuantity: parseInt(formData.quantity),
        publisher: user?.twitterUsername || '@Unknown',
        publisherId: user?.id || 'unknown',
      })

      if (!taskResponse.success) {
        throw new Error('Failed to create task')
      }

      // Step 2: Initiate payment to smart contract
      // TODO: Integrate with actual smart contract
      // For now, we'll simulate the payment
      toast.loading(t('publishTask.processingPayment'), { duration: 2000 })
      
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful payment
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66)
      
      toast.success(t('publishTask.publishSuccess'))
      setShowConfirmModal(false)
      
      // Redirect to my tasks
      setTimeout(() => {
        router.push('/my-tasks?tab=published')
      }, 1500)
    } catch (error) {
      console.error('Failed to publish task:', error)
      toast.error(t('publishTask.publishFailed'))
    } finally {
      setLoading(false)
    }
  }

  const { subtotal, platformFee, total } = calculateTotalCost()

  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('publishTask.title')}
          </h1>
          <p className="text-muted-foreground">{t('publishTask.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="bg-background border border-border/40 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <FileText className="w-5 h-5 text-primary" />
              {t('publishTask.taskTitle')}
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('publishTask.titlePlaceholder')}
              className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                errors.title ? 'border-destructive' : 'border-border/40'
              }`}
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.title.length} / 200 {t('publishTask.characters')}
            </p>
          </div>

          {/* Task Description */}
          <div className="bg-background border border-border/40 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <FileText className="w-5 h-5 text-primary" />
              {t('publishTask.taskDescription')}
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t('publishTask.descriptionPlaceholder')}
              rows={5}
              className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${
                errors.description ? 'border-destructive' : 'border-border/40'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Task Type - Single Selection */}
          <div className="bg-background border border-border/40 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckSquare className="w-5 h-5 text-primary" />
              {t('publishTask.taskType')}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {taskTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeSelect(type.value)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    formData.type === type.value
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border/40 text-muted-foreground hover:border-border/60'
                  }`}
                >
                  {getTaskTypeIcon(type.value)}
                  <span className="text-sm font-medium">{type.label}</span>
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.type}
              </p>
            )}
          </div>

          {/* Target URL - Only show when type is selected */}
          {formData.type && (
            <div className="bg-background border border-border/40 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <LinkIcon className="w-5 h-5 text-primary" />
                {getSelectedTypeInfo()?.urlLabel || t('publishTask.targetUrl')}
              </div>
              <input
                type="url"
                value={formData.targetUrl}
                onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                placeholder={getSelectedTypeInfo()?.placeholder || 'https://twitter.com/...'}
                className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  errors.targetUrl ? 'border-destructive' : 'border-border/40'
                }`}
              />
              {errors.targetUrl && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.targetUrl}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.type === 'follow'
                  ? t('publishTask.targetUrlHintFollow')
                  : t('publishTask.targetUrlHint')
                }
              </p>
            </div>
          )}

          {/* Reward and Quantity */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reward */}
            <div className="bg-background border border-border/40 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <DollarSign className="w-5 h-5 text-primary" />
                {t('publishTask.rewardPerTask')}
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.reward}
                  onChange={(e) => handleInputChange('reward', e.target.value)}
                  placeholder="0.5"
                  className={`w-full pl-4 pr-16 py-3 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    errors.reward ? 'border-destructive' : 'border-border/40'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  USDT
                </span>
              </div>
              {errors.reward && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.reward}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="bg-background border border-border/40 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Hash className="w-5 h-5 text-primary" />
                {t('publishTask.taskQuantity')}
              </div>
              <input
                type="number"
                step="1"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="100"
                className={`w-full px-4 py-3 text-sm bg-background border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  errors.quantity ? 'border-destructive' : 'border-border/40'
                }`}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.quantity}
                </p>
              )}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('publishTask.costSummary')}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('publishTask.taskRewards')}</span>
                <span className="font-medium text-foreground">{subtotal.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('publishTask.platformFee')} (5%)</span>
                <span className="font-medium text-foreground">{platformFee.toFixed(2)} USDT</span>
              </div>
              <div className="h-px bg-border/40 my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">{t('publishTask.totalCost')}</span>
                <span className="text-primary">{total.toFixed(2)} USDT</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl text-base font-semibold hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('common.processing')}
              </>
            ) : (
              <>
                {t('publishTask.publishAndPay')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmPublishModal
          formData={formData}
          costSummary={{ subtotal, platformFee, total }}
          onConfirm={handleConfirmPublish}
          onCancel={() => setShowConfirmModal(false)}
          loading={loading}
        />
      )}
    </Layout>
  )
}

// Confirmation Modal Component
interface ConfirmPublishModalProps {
  formData: TaskFormData
  costSummary: { subtotal: number; platformFee: number; total: number }
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}

function ConfirmPublishModal({
  formData,
  costSummary,
  onConfirm,
  onCancel,
  loading,
}: ConfirmPublishModalProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/40">
          <h2 className="text-xl font-bold text-foreground">{t('publishTask.confirmPublish')}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('publishTask.taskTitle')}</p>
            <p className="font-medium text-foreground">{formData.title}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">{t('publishTask.taskTypes')}</p>
            <div className="flex flex-wrap gap-2">
              {formData.types.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {t(`tasks.taskTypes.${type}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('publishTask.rewardPerTask')}</p>
              <p className="font-medium text-foreground">{formData.reward} USDT</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{t('publishTask.taskQuantity')}</p>
              <p className="font-medium text-foreground">{formData.quantity}</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('publishTask.taskRewards')}</span>
              <span className="font-medium">{costSummary.subtotal.toFixed(2)} USDT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('publishTask.platformFee')}</span>
              <span className="font-medium">{costSummary.platformFee.toFixed(2)} USDT</span>
            </div>
            <div className="h-px bg-border/40" />
            <div className="flex justify-between text-lg font-bold">
              <span>{t('publishTask.totalCost')}</span>
              <span className="text-primary">{costSummary.total.toFixed(2)} USDT</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {t('publishTask.paymentNotice')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border/40 bg-muted/20">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('common.processing')}
              </>
            ) : (
              <>
                {t('publishTask.confirmAndPay')}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

