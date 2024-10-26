import { translationData } from '@/src/store.ts'

/**
 * Provides access to translation strings with support for deeply nested keys.
 *
 * @returns An object containing a function to fetch translations by deeply nested key.
 */
export function useTranslation(): { t: (key: string) => string } {
  const translate = (key: string): string => {
    const keys = key.split('.') // Split the key by dot
    let value: unknown = translationData.value // Get the value from translationData

    console.log('Translation Data:', translationData.value) // Check translation data

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k] // Retrieve the nested key
      } else {
        return key // Return the key if not found
      }
    }

    return typeof value === 'string' ? value : key // Return value if it's a string, otherwise return the key
  }

  return { t: translate } // Return the translation function
}
