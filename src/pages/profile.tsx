import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import mockApi from '@/services/mockApi'
import toast from 'react-hot-toast'
import {
  User,
  Wallet,
  CheckCircle2,
  XCircle,
  Coins,
  ArrowUpRight,
  Copy,
  ExternalLink,
  TrendingUp,
  Award,
  Clock,
  Twitter,
  AlertCircle,
  Loader2,
  ArrowLeftRight,
  RefreshCw,
  Users,
  UserPlus,
  MessageSquare,
  Calendar,
  Heart,
  Repeat2,
  MessageCircle,
  Quote,
  ShieldCheck
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface WithdrawHistory {
  id: string
  amount: number
  status: 'success' | 'failed' | 'pending'
  txHash: string
  createdAt: string
}

interface UserStats {
  totalEarned: number
  tasksCompleted: number
  tasksPublished: number
  successRate: number
}

interface EarningsHistory {
  id: string
  taskId: string
  taskTitle: string
  taskType: 'follow' | 'like' | 'retweet' | 'comment' | 'quote'
  amount: number
  status: 'paid' | 'pending' | 'reviewing'
  completedAt: string
  paidAt: string | null
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated, user, connectWallet, disconnectWallet, updateTwitterData } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistory[]>([])
  const [earningsHistory, setEarningsHistory] = useState<EarningsHistory[]>([])
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [withdrawHistoryModalOpen, setWithdrawHistoryModalOpen] = useState(false)
  const [connectWalletModalOpen, setConnectWalletModalOpen] = useState(false)
  const [changeWalletModalOpen, setChangeWalletModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState(false)
  const [refreshingTwitterData, setRefreshingTwitterData] = useState(false)
  const [userStats, setUserStats] = useState<UserStats>({
    totalEarned: 0,
    tasksCompleted: 0,
    tasksPublished: 0,
    successRate: 0
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    loadData()
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      setLoading(true)
      // Load withdraw history
      const historyResponse = await mockApi.profile.getWithdrawHistory()
      if (historyResponse.success) {
        setWithdrawHistory(historyResponse.data)
      }

      // Load earnings history
      const earningsResponse = await mockApi.profile.getEarningsHistory()
      if (earningsResponse.success) {
        setEarningsHistory(earningsResponse.data)
      }

      // Load user stats (mock data)
      setUserStats({
        totalEarned: 25.5,
        tasksCompleted: 42,
        tasksPublished: 5,
        successRate: 95.2
      })
    } catch (error) {
      console.error('Failed to load profile data:', error)
      toast.error(t('errors.loadFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleCopyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress)
      toast.success(t('common.copied'))
    }
  }

  const handleConnectWallet = async () => {
    try {
      setConnectingWallet(true)

      // Simulate MetaMask connection
      toast.loading(t('verify.walletConnecting'))
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock wallet address
      const mockWalletAddress = '0x' + Math.random().toString(16).substring(2, 42)

      // Update user with wallet address
      connectWallet(mockWalletAddress)

      toast.dismiss()
      toast.success(t('verify.walletConnected'))
      setConnectWalletModalOpen(false)

      // Reload data
      loadData()
    } catch (error) {
      console.error('Wallet connection failed:', error)
      toast.dismiss()
      toast.error('Failed to connect wallet')
    } finally {
      setConnectingWallet(false)
    }
  }

  const handleChangeWallet = async () => {
    try {
      setConnectingWallet(true)

      // Simulate MetaMask connection
      toast.loading('Connecting new wallet...')
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock new wallet address
      const mockWalletAddress = '0x' + Math.random().toString(16).substring(2, 42)

      // Disconnect old wallet and connect new one
      disconnectWallet()
      connectWallet(mockWalletAddress)

      toast.dismiss()
      toast.success('Wallet changed successfully')
      setChangeWalletModalOpen(false)

      // Reload data
      loadData()
    } catch (error) {
      console.error('Wallet change failed:', error)
      toast.dismiss()
      toast.error('Failed to change wallet')
    } finally {
      setConnectingWallet(false)
    }
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)

    if (!amount || amount <= 0) {
      toast.error(t('profile.validation.amountInvalid'))
      return
    }

    if (amount > (user?.balance || 0)) {
      toast.error(t('profile.validation.amountExceed'))
      return
    }

    try {
      setWithdrawing(true)
      const response = await mockApi.profile.withdraw(amount)
      if (response.success) {
        toast.success(t('profile.withdrawSuccess'))
        setWithdrawModalOpen(false)
        setWithdrawAmount('')
        loadData()
      }
    } catch (error) {
      console.error('Withdraw failed:', error)
      toast.error(t('profile.withdrawFailed'))
    } finally {
      setWithdrawing(false)
    }
  }

  const handleRefreshTwitterData = async () => {
    try {
      setRefreshingTwitterData(true)
      toast.loading(t('profile.refreshing'))

      const response = await mockApi.profile.refreshTwitterData()

      if (response.success) {
        updateTwitterData(response.data)
        toast.dismiss()
        toast.success(t('profile.refreshSuccess'))
      }
    } catch (error) {
      console.error('Failed to refresh Twitter data:', error)
      toast.dismiss()
      toast.error(t('profile.refreshFailed'))
    } finally {
      setRefreshingTwitterData(false)
    }
  }

  const calculateAccountAge = (createdAt: string | null) => {
    if (!createdAt) return null
    const created = new Date(createdAt)
    const now = new Date()
    const years = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365)
    return years.toFixed(1)
  }

  const formatNumber = (num: number | undefined) => {
    if (!num && num !== 0) return '0'
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const shortenTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
      failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="inline-flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {t(`profile.withdrawStatus.${status}`)}
      </Badge>
    )
  }

  const getTaskTypeIcon = (type: string) => {
    const iconClass = "w-4 h-4"
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

  const getEarningStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { variant: 'default' as const, icon: CheckCircle2, text: t('profile.earningStatusPaid'), color: 'bg-green-100 text-green-700 border-green-200' },
      pending: { variant: 'secondary' as const, icon: Clock, text: t('profile.earningStatusPending'), color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
      reviewing: { variant: 'secondary' as const, icon: Clock, text: t('profile.earningStatusReviewing'), color: 'bg-blue-100 text-blue-700 border-blue-200' }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-muted rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-muted rounded-2xl"></div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <TooltipProvider>
      <Layout>
        <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('profile.subtitle')}</p>
        </div>

        {/* Wallet Not Connected Alert */}
        {!user.walletAddress && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  {t('profile.pleaseConnectWallet')}
                </h3>
                <p className="text-sm text-blue-700">
                  {t('profile.connectWalletDesc')}
                </p>
              </div>
              <Button
                onClick={() => setConnectWalletModalOpen(true)}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <Wallet className="w-4 h-4" />
                {t('profile.connectWallet')}
              </Button>
            </div>
          </div>
        )}

        {/* Verification Alert */}
        {user.walletAddress && !user.isVerified && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-1">
                  {t('profile.accountNotVerified')}
                </h3>
                <p className="text-sm text-orange-700">
                  {t('profile.verificationRequired')}
                </p>
              </div>
              <Button
                onClick={() => router.push('/verify')}
                className="flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white"
              >
                {t('profile.completeVerification')}
              </Button>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-border/40 p-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
            {/* Left: Avatar + User Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {/* Avatar with Refresh Button */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {user.twitterUsername?.[1]?.toUpperCase() || 'U'}
                  </div>
                  {user.twitterDataUpdatedAt && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={handleRefreshTwitterData}
                          disabled={refreshingTwitterData}
                          className="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-background border-2 border-primary/10 rounded-full flex items-center justify-center hover:bg-foreground hover:border-foreground transition-colors disabled:opacity-50 shadow-md group"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-background ${refreshingTwitterData ? 'animate-spin' : ''}`} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('profile.dataUpdated')} {formatDate(user.twitterDataUpdatedAt)}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* User Details */}
                <div className="flex-1 space-y-2">
                  {/* Title Row with Verified Badge */}
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">{user.twitterUsername}</h2>
                    {user.isVerified && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex items-center justify-center w-5 h-5 cursor-default">
                            <ShieldCheck className="w-5 h-5 text-blue-600 fill-blue-100" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('profile.verified')}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>

                  {/* Wallet Address */}
                  {user.walletAddress ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-border/40">
                      <span className="text-sm font-mono text-muted-foreground">{shortenAddress(user.walletAddress)}</span>
                      <button
                        onClick={handleCopyAddress}
                        className="p-1 hover:bg-muted/50 rounded transition-colors"
                        title="Copy address"
                      >
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => setChangeWalletModalOpen(true)}
                        className="p-1 hover:bg-muted/50 rounded transition-colors"
                        title={t('profile.changeWallet')}
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-600">{t('profile.walletNotConnected')}</span>
                    </div>
                  )}

                  {/* Twitter Stats - Inline with dots */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{formatNumber(user.tasksCompleted || 0)}</span>
                      <span className="text-muted-foreground">{t('profile.tasksCompleted')}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{formatNumber(user.followersCount || 0)}</span>
                      <span className="text-muted-foreground">{t('profile.followers')}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{formatNumber(user.tweetsCount || 0)}</span>
                      <span className="text-muted-foreground">{t('profile.tweets')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(user.walletAddress && !user.isVerified) || !user.walletAddress ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {user.walletAddress && !user.isVerified && (
                        <Button
                          onClick={() => router.push('/verify')}
                          size="sm"
                          className="gap-2 bg-orange-600 hover:bg-orange-700"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {t('profile.completeVerification')}
                        </Button>
                      )}

                      {!user.walletAddress && (
                        <Button
                          onClick={() => setConnectWalletModalOpen(true)}
                          size="sm"
                          className="gap-2"
                        >
                          <Wallet className="w-4 h-4" />
                          {t('profile.connectWallet')}
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right: Balance Card */}
            {user.walletAddress && (
              <div className="lg:w-96 bg-background/80 backdrop-blur-sm rounded-xl p-5 border border-border/40 shadow-lg">
                <p className="text-sm text-muted-foreground mb-1">{t('profile.balance')}</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-green-600">{user.balance}</span>
                  <span className="text-lg text-muted-foreground">USDT</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setWithdrawModalOpen(true)}
                    disabled={!user.balance || user.balance <= 0}
                    className="flex-1 gap-2"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    {t('profile.withdraw')}
                  </Button>
                  <Button
                    onClick={() => setWithdrawHistoryModalOpen(true)}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    {t('profile.withdrawHistory')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background border border-border/40 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Coins className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t('profile.totalEarned')}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{userStats.totalEarned} USDT</p>
          </div>

          <div className="bg-background border border-border/40 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t('profile.tasksCompleted')}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{userStats.tasksCompleted}</p>
          </div>

          <div className="bg-background border border-border/40 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t('profile.tasksPublished')}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{userStats.tasksPublished}</p>
          </div>

          <div className="bg-background border border-border/40 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{t('profile.successRate')}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{userStats.successRate}%</p>
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="bg-background border border-border/40 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40">
            <h3 className="text-lg font-semibold text-foreground">{t('profile.recentEarnings')}</h3>
          </div>

          {earningsHistory.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t('profile.noEarningsHistory')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.taskName')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.earnedAmount')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.earningStatus')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.completedTime')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {earningsHistory.slice(0, 5).map((record) => (
                    <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 text-muted-foreground">
                            {getTaskTypeIcon(record.taskType)}
                          </div>
                          <span className="text-sm font-medium text-foreground">{record.taskTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">+{record.amount} USDT</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEarningStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(record.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.withdrawTitle')}</DialogTitle>
            <DialogDescription>
              {t('profile.withdrawDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t('profile.availableBalance')}</p>
              <p className="text-2xl font-bold text-green-600">{user.balance} USDT</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">{t('profile.withdrawAmount')}</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                min="0"
                max={user.balance}
                placeholder={t('profile.withdrawAmountPlaceholder')}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('profile.withdrawAddress')}</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/40">
                <Wallet className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-mono flex-1 truncate">{user.walletAddress}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleWithdraw} disabled={withdrawing || !withdrawAmount}>
              {withdrawing ? t('profile.withdrawing') : t('profile.confirmWithdraw')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw History Modal */}
      <Dialog open={withdrawHistoryModalOpen} onOpenChange={setWithdrawHistoryModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('profile.withdrawHistoryTitle')}</DialogTitle>
            <DialogDescription>
              {t('profile.withdrawDescription')}
            </DialogDescription>
          </DialogHeader>

          {withdrawHistory.length === 0 ? (
            <div className="text-center py-12">
              <Coins className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t('profile.noWithdrawHistory')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.amount')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.status')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.txHash')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {t('profile.time')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {withdrawHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-foreground">{record.amount} USDT</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a
                          href={`https://bscscan.com/tx/${record.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-mono"
                        >
                          {shortenTxHash(record.txHash)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(record.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Connect Wallet Modal */}
      <Dialog open={connectWalletModalOpen} onOpenChange={setConnectWalletModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.connectWallet')}</DialogTitle>
            <DialogDescription>
              {t('profile.connectWalletDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 mb-2">{t('verify.connectWalletNotice')}</p>
                  <p className="text-sm text-orange-700 whitespace-pre-line">{t('verify.connectWalletNoticeItems')}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConnectWalletModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConnectWallet} disabled={connectingWallet} className="gap-2">
              {connectingWallet ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  {t('verify.walletConnecting')}
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  {t('verify.connectMetaMask')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Wallet Modal */}
      <Dialog open={changeWalletModalOpen} onOpenChange={setChangeWalletModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.changeWallet')}</DialogTitle>
            <DialogDescription>
              {t('profile.changeWalletDesc')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Wallet */}
            {user?.walletAddress && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/40">
                <p className="text-xs text-muted-foreground mb-2">{t('profile.currentWallet')}</p>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{user.walletAddress}</span>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">{t('profile.changeWalletNotice')}</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>{t('profile.changeWalletWarning1')}</li>
                    <li>{t('profile.changeWalletWarning2')}</li>
                    <li>{t('profile.changeWalletWarning3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeWalletModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleChangeWallet} disabled={connectingWallet} className="gap-2">
              {connectingWallet ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  {t('profile.connecting')}
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  {t('profile.connectNewWallet')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </Layout>
    </TooltipProvider>
  )
}

