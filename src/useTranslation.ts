import { translationData } from '@/src/store.ts'

/**
 * Provides access to translation strings with support for deeply nested keys.
 *
 * @returns An object containing a function to fetch translations by deeply nested key.
 */
export function useTranslation(): { t: (key: string) => string } {
  const translate = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = translationData.value

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        return key // Fallback to the key if the path is not found
      }
    }

    return typeof value === 'string' ? value : key
  }

  return { t: translate }
}
