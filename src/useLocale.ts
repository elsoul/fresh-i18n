import { currentLocale } from '@/src/store.ts'
import { useAtom } from 'fresh-atom'

/**
 * Provides access to the current locale and a function to change the locale.
 *
 * @returns An object containing the current locale and a function to change the locale.
 */
export function useLocale(): {
  locale: string
  changeLanguage: (newLocale: string) => void
} {
  const [currentLocaleFromAtom] = useAtom(currentLocale)
  const changeLanguage = (newLocale: string) => {
    if (newLocale === currentLocaleFromAtom) return

    currentLocale.set(newLocale)
    const currentPath = globalThis.location.pathname.split('/').filter(Boolean)
    const updatedPath = `/${newLocale}/${currentPath.slice(1).join('/')}`

    globalThis.location.href =
      `${globalThis.location.origin}${updatedPath}${globalThis.location.search}`
  }

  return { locale: currentLocaleFromAtom, changeLanguage }
}
