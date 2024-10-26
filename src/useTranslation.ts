import { translationData } from '@/src/store.ts'

/**
 * Provides access to translation strings within a specified namespace.
 *
 * @param namespace - The namespace of translations to retrieve (e.g., 'common', 'company').
 * @returns An object containing a function to fetch translations by key within the given namespace.
 */
export function useTranslation(
  namespace: string,
): { t: (key: string) => string } {
  const translate = (key: string): string => {
    return translationData.value[namespace]?.[key] ?? key
  }

  return { t: translate }
}
