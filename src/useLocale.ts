import { currentLocale } from '@/src/store.ts'

/**
 * Provides access to the current locale and a function to change the locale.
 *
 * @returns An object containing the current locale and a function to change the locale.
 */
export function useLocale(): {
  locale: string
  changeLanguage: (newLocale: string) => void
} {
  const changeLanguage = (newLocale: string) => {
    if (newLocale === currentLocale.get()) return

    currentLocale.set(newLocale)
    const currentPath = globalThis.location.pathname.split('/').filter(Boolean)
    const updatedPath = `/${newLocale}/${currentPath.slice(1).join('/')}`

    globalThis.location.href =
      `${globalThis.location.origin}${updatedPath}${globalThis.location.search}`
  }

  return { locale: currentLocale.get(), changeLanguage }
}
