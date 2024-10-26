import { translationData } from '@/src/store.ts'

/**
 * Provides access to translation strings within a specified namespace.
 *
 * @param namespace - The namespace of translations to retrieve (e.g., 'common', 'company').
 * @returns An object containing a function to fetch translations by key within the given namespace.
 */
export function useTranslation(namespace: string) {
  /**
   * Fetches the translation for a specific key within the namespace.
   *
   * @param key - The translation key to retrieve (e.g., 'title', 'welcome').
   * @returns The translated string, or the key itself if no translation is found.
   */
  const translate = (key: string): string => {
    return translationData.value[namespace]?.[key] ?? key
  }

  return { t: translate }
}
