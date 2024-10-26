import { currentLocale } from '@/src/store.ts'

/**
 * Provides access to the current locale and a function to change the locale.
 *
 * @returns An object containing the current locale and a function to change the locale.
 */
export function useLocale() {
  /**
   * Updates the current locale and redirects to the new URL with updated locale in the path.
   *
   * @param newLocale - The new locale to set (e.g., 'en', 'ja').
   */
  const changeLanguage = (newLocale: string) => {
    if (newLocale === currentLocale.value) return

    currentLocale.value = newLocale
    const currentPath = globalThis.location.pathname.split('/').filter(Boolean)
    const updatedPath = `/${newLocale}/${currentPath.slice(1).join('/')}`

    // Redirect to the new path with the updated locale
    globalThis.location.href =
      `${globalThis.location.origin}${updatedPath}${globalThis.location.search}`
  }

  return { locale: currentLocale.value, changeLanguage }
}
