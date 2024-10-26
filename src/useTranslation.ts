import { useSignal } from '@preact/signals'
import { useLocale } from './useLocale.ts'

export function useTranslation(namespace: string) {
  const { locale } = useLocale()
  const translations = useSignal<{ [key: string]: string }>({})

  async function loadTranslations() {
    try {
      const response = await fetch(`/locales/${locale}/${namespace}.json`)
      const data: { [key: string]: string } = await response.json()
      translations.value = data
    } catch (error) {
      console.error(`Error loading translations for ${namespace}:`, error)
    }
  }

  function t(key: string): string {
    return translations.value[key] || key
  }

  return { t, loadTranslations }
}
