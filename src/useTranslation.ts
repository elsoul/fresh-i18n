import { useLocale } from './useLocale.ts'
import { useEffect, useState } from 'preact/hooks'

export function useTranslation(
  namespace: string,
): { t: (key: string) => string } {
  const { loadNamespaceTranslations } = useLocale()
  const [translations, setTranslations] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadTranslations = async () => {
      const loadedTranslations = await loadNamespaceTranslations(namespace)
      setTranslations(loadedTranslations)
    }
    loadTranslations()
  }, [namespace])

  const t = (key: string): string => {
    return translations[key] || key
  }

  return { t }
}
