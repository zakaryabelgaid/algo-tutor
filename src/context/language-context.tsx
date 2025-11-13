'use client';

import { createContext, useState, useEffect, ReactNode, useContext, useCallback } from 'react';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

const translations: Record<string, any> = { en, fr };

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

const LANGUAGE_STORAGE_KEY = 'algo-tutor-language';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'fr')) {
        setLanguageState(storedLanguage);
      }
    } catch (error) {
      console.error("Failed to parse language from localStorage", error);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setLanguageState(lang);
    } catch (error) {
        console.error("Failed to save language to localStorage", error);
    }
  };
  
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations.en;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if(fallbackResult === undefined) return key;
        }
        result = fallbackResult;
        break;
      }
    }

    if (typeof result === 'string' && params) {
      return Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(`{${key}}`, String(value));
      }, result);
    }
    
    return result || key;
  }, [language]);


  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if(context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
}
