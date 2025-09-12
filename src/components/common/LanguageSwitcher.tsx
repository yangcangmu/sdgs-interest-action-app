'use client';

import React from 'react';
import { Locale } from '@/types';
import { useTranslation } from '@/lib/i18n';
import { Globe, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  className?: string;
}

export default function LanguageSwitcher({ 
  locale, 
  onLocaleChange, 
  className = '' 
}: LanguageSwitcherProps) {
  // const { t } = useTranslation(locale);
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: 'ja' as Locale, name: '日本語', flag: '🇯🇵' },
    { code: 'en' as Locale, name: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  const handleLanguageSelect = (selectedLocale: Locale) => {
    onLocaleChange(selectedLocale);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
      </button>

      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* ドロップダウンメニュー */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    locale === language.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <span className="font-medium">{language.name}</span>
                  </div>
                  {locale === language.code && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
