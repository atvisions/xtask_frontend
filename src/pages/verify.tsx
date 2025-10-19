import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import Button from '@/components/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStore } from '@/store/authStore'
import mockApi from '@/services/mockApi'
import toast from 'react-hot-toast'
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Twitter,
  ArrowRight,
  Loader2,
  Info,
  Coins,
  Lock,
  Unlock,
  Check
} from 'lucide-react'

type VerifyStep = 'connect-wallet' | 'payment' | 'processing' | 'success'

export default function VerifyPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const { isAuthenticated, user, connectWallet, updateVerification } = useAuthStore()
  const [step, setStep] = useState<VerifyStep>('connect-wallet')
  const [txHash, setTxHash] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // If already verified, redirect to tasks
    if (user?.isVerified) {
      router.push('/tasks')
      return
    }

    // Determine initial step based on wallet connection
    if (user?.walletAddress) {
      setStep('payment')
    } else {
      setStep('connect-wallet')
    }
  }, [isAuthenticated, user])

  const handleConnectWallet = async () => {
    try {
      setConnecting(true)

      // Simulate MetaMask connection
      toast.loading(t('verify.walletConnecting'))
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock wallet address
      const mockWalletAddress = '0x' + Math.random().toString(16).substring(2, 42)

      // Update user with wallet address
      connectWallet(mockWalletAddress)

      toast.dismiss()
      toast.success(t('verify.walletConnected'))

      // Move to payment step
      setStep('payment')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      toast.dismiss()
      toast.error('Failed to connect wallet')
    } finally {
      setConnecting(false)
    }
  }

  const handleSkipForNow = () => {
    router.push('/tasks')
  }

  const handlePayVerification = async () => {
    try {
      setVerifying(true)
      setStep('processing')

      // Simulate MetaMask payment
      toast.loading(t('verify.connectingWallet'))
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock transaction hash
      const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66)
      setTxHash(mockTxHash)

      toast.dismiss()
      toast.loading(t('verify.processingPayment'))

      // Call API to verify payment
      const response = await mockApi.auth.payVerificationFee(mockTxHash)

      if (response.success) {
        // Update user verification status
        updateVerification(mockTxHash)

        setStep('success')
        toast.dismiss()
        toast.success(t('verify.verificationSuccess'))

        // Redirect to tasks after 2 seconds
        setTimeout(() => {
          router.push('/tasks')
        }, 2000)
      }
    } catch (error) {
      console.error('Verification payment failed:', error)
      toast.dismiss()
      toast.error(t('verify.verificationFailed'))
      setStep('payment')
    } finally {
      setVerifying(false)
    }
  }

  if (!user) {
    return null
  }

  const getStepNumber = (stepName: VerifyStep) => {
    const steps: VerifyStep[] = ['connect-wallet', 'payment', 'processing', 'success']
    return steps.indexOf(stepName) + 1
  }

  const currentStepNumber = getStepNumber(step)

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header with User Info */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('verify.title')}</h1>
          <p className="text-muted-foreground mb-6">{t('verify.subtitle')}</p>

          {/* User Status */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Twitter className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">{user.twitterUsername}</span>
              <Check className="w-4 h-4 text-green-600" />
            </div>
            {user.walletAddress && (
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-mono">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
                <Check className="w-4 h-4 text-green-600" />
              </div>
            )}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {/* Step 1: Connect Wallet */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStepNumber === 1
                  ? 'bg-primary text-primary-foreground'
                  : currentStepNumber > 1
                  ? 'bg-green-100 text-green-600'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStepNumber > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {t('verify.step1')}
              </span>
            </div>

            <div className={`w-12 h-0.5 ${currentStepNumber > 1 ? 'bg-green-300' : 'bg-border'}`}></div>

            {/* Step 2: Pay Fee */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStepNumber === 2 || currentStepNumber === 3
                  ? 'bg-primary text-primary-foreground'
                  : currentStepNumber > 3
                  ? 'bg-green-100 text-green-600'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStepNumber > 3 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {t('verify.step2')}
              </span>
            </div>

            <div className={`w-12 h-0.5 ${currentStepNumber > 3 ? 'bg-green-300' : 'bg-border'}`}></div>

            {/* Step 3: Complete */}
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStepNumber === 4
                  ? 'bg-green-100 text-green-600'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {currentStepNumber === 4 ? <CheckCircle2 className="w-5 h-5" /> : '3'}
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:inline">
                {t('verify.step3')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-background border border-border/40 rounded-2xl shadow-lg overflow-hidden">
          {/* Connect Wallet Step */}
          {step === 'connect-wallet' && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/10 to-yellow-500/10 p-8 text-center border-b border-border/40">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('verify.connectWalletTitle')}
                </h2>
                <p className="text-muted-foreground">
                  {t('verify.connectWalletDesc')}
                </p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Important Notice */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900 mb-2">{t('verify.connectWalletNotice')}</p>
                      <p className="text-sm text-orange-700 whitespace-pre-line">{t('verify.connectWalletNoticeItems')}</p>
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <div className="text-center py-8">
                  <Button
                    onClick={handleConnectWallet}
                    disabled={connecting}
                    className="gap-2 px-8 py-6 text-lg"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('verify.walletConnecting')}
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        {t('verify.connectMetaMask')}
                      </>
                    )}
                  </Button>
                </div>

                {/* Skip Option */}
                <div className="text-center">
                  <button
                    onClick={handleSkipForNow}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('verify.skipForNow')}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 p-8 text-center border-b border-border/40">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
                  <Coins className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {t('verify.verificationFee')}
                </h2>
                <p className="text-muted-foreground">
                  {t('verify.feeDescription')}
                </p>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Why Verify */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    {t('verify.whyVerify')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <Unlock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900">{t('verify.benefit1Title')}</p>
                        <p className="text-sm text-green-700">{t('verify.benefit1Desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">{t('verify.benefit2Title')}</p>
                        <p className="text-sm text-blue-700">{t('verify.benefit2Desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <Coins className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-900">{t('verify.benefit3Title')}</p>
                        <p className="text-sm text-purple-700">{t('verify.benefit3Desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Fee */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{t('verify.verificationFee')}</p>
                      <p className="text-3xl font-bold text-primary">1 USDT</p>
                    </div>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Coins className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('verify.feeDescription')}
                  </p>
                </div>

                {/* Important Notice */}
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium mb-1">{t('verify.importantNotice')}</p>
                    <p>{t('verify.noticeDescription')}</p>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handlePayVerification}
                  size="lg"
                  className="w-full gap-2"
                >
                  {t('verify.payAndVerify')}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('verify.securePayment')}
                </p>
              </div>
            </>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t('verify.processingPayment')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('verify.pleaseWait')}
              </p>
              {txHash && (
                <div className="inline-block px-4 py-2 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{t('verify.transactionHash')}</p>
                  <p className="text-sm font-mono text-foreground">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t('verify.verificationSuccess')}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t('verify.successDescription')}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium">
                <CheckCircle2 className="w-5 h-5" />
                {t('verify.verified')}
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                {t('verify.redirecting')}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

