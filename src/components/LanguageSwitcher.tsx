import React from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe, Check } from 'lucide-react'
import { Button } from './Button'

interface Language {
  code: string
  name: string
  flag: string
  nativeName: string
}

const languages: Language[] = [
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '简体中文',
    flag: '🇨🇳',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  // 预留其他语言
  // {
  //   code: 'ja',
  //   name: 'Japanese',
  //   nativeName: '日本語',
  //   flag: '🇯🇵',
  // },
  // {
  //   code: 'ko',
  //   name: 'Korean',
  //   nativeName: '한국어',
  //   flag: '🇰🇷',
  // },
]

export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useTranslation()

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <span className="text-xl">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <Globe className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="cursor-pointer"
          >
            <span className="text-xl mr-3">{language.flag}</span>
            <span className="flex-1">{language.nativeName}</span>
            {locale === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

