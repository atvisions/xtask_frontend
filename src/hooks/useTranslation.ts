import { useRouter } from 'next/router'
import zhTranslations from '@/locales/zh.json'
import enTranslations from '@/locales/en.json'

type TranslationKey = string

const translations = {
  zh: zhTranslations,
  en: enTranslations,
}

export function useTranslation() {
  const router = useRouter()
  const { locale = 'zh' } = router

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations[locale as keyof typeof translations]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }

    let result = typeof value === 'string' ? value : key

    // Replace interpolation placeholders
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        result = result.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(params[paramKey]))
      })
    }

    return result
  }

  const changeLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return { t, locale, changeLanguage }
}

