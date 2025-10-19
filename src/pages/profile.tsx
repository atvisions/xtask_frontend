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
  AlertCircle
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
  amount: number
  status: 'paid' | 'pending' | 'reviewing'
  completedAt: string
  paidAt: string | null
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawHistory[]>([])
  const [earningsHistory, setEarningsHistory] = useState<EarningsHistory[]>([])
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [withdrawHistoryModalOpen, setWithdrawHistoryModalOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
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
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('profile.subtitle')}</p>
        </div>

        {/* Verification Alert */}
        {!user.isVerified && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-1">
                  {t('verify.verificationRequired')}
                </h3>
                <p className="text-sm text-orange-700">
                  {t('verify.benefit1Desc')}
                </p>
              </div>
              <Button
                onClick={() => router.push('/verify')}
                className="flex-shrink-0 bg-orange-600 hover:bg-orange-700 text-white"
              >
                {t('verify.goToVerify')}
              </Button>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-border/40 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg flex-shrink-0">
              {user.twitterUsername?.[1]?.toUpperCase() || 'U'}
            </div>

            {/* User Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{user.twitterUsername}</h2>
                  {user.isVerified && (
                    <Badge variant="default" className="inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('profile.verified')}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('profile.memberSince')} {formatDate(user.createdAt)}
                </p>
              </div>

              {/* Wallet Info */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/40">
                  <Twitter className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">{user.twitterUsername}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/40">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{shortenAddress(user.walletAddress)}</span>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-muted/50 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="w-full md:w-auto bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-border/40 shadow-lg">
              <p className="text-sm text-muted-foreground mb-1">{t('profile.balance')}</p>
              <div className="flex items-baseline gap-2 mb-4">
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
                  className="gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {t('profile.withdrawHistory')}
                </Button>
              </div>
            </div>
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
                        <span className="text-sm font-medium text-foreground">{record.taskTitle}</span>
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
    </Layout>
  )
}

