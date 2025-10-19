import React, { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { X, Upload, ExternalLink } from 'lucide-react'

interface SubmitTaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskTitle: string
  onSubmit: (proof: { screenshot?: File; tweetLink?: string }) => void
}

export default function SubmitTaskModal({
  isOpen,
  onClose,
  taskTitle,
  onSubmit,
}: SubmitTaskModalProps) {
  const { t } = useTranslation()
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [tweetLink, setTweetLink] = useState('')
  const [dragActive, setDragActive] = useState(false)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setScreenshot(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (!screenshot && !tweetLink) {
      return
    }

    onSubmit({
      screenshot: screenshot || undefined,
      tweetLink: tweetLink || undefined,
    })

    // Reset form
    setScreenshot(null)
    setTweetLink('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <h2 className="text-xl font-bold text-foreground">
            {t('myTasks.submitProof')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">{t('tasks.taskTitle')}</p>
            <p className="font-medium text-foreground">{taskTitle}</p>
          </div>

          {/* Upload Screenshot */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('myTasks.uploadScreenshot')}
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border/40 hover:border-border/60'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              {screenshot ? (
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {screenshot.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(screenshot.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-foreground mb-1">
                    {t('myTasks.uploadPlaceholder')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('myTasks.supportedFormats')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-sm text-muted-foreground">{t('myTasks.or')}</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Tweet Link */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('myTasks.tweetLink')}
            </label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={tweetLink}
                onChange={(e) => setTweetLink(e.target.value)}
                placeholder={t('myTasks.tweetLinkPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border/40 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Validation Message */}
          {!screenshot && !tweetLink && (
            <p className="text-xs text-muted-foreground">
              {t('myTasks.proofRequired')}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border/40 bg-muted/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!screenshot && !tweetLink}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              screenshot || tweetLink
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {t('common.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}

