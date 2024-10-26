import { useLocale } from './useLocale.ts'
import { useEffect, useState } from 'preact/hooks'

export function useTranslation(namespace: string) {
  const { locale, loadNamespaceTranslations } = useLocale()
  const [translations, setTranslations] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadTranslations() {
      const namespaceTranslations = await loadNamespaceTranslations(namespace)
      setTranslations(namespaceTranslations)
    }
    loadTranslations()
  }, [namespace, locale])

  function t(key: string): string {
    return translations[key] || key
  }

  return { t }
}
