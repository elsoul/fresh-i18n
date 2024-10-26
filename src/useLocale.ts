import { useSignal } from '@preact/signals'
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

interface LocaleContextProps {
  locale: string // Current locale
  setLocale: (locale: string) => void // Function to set a new locale
  loadNamespaceTranslations: (
    namespace: string,
  ) => Promise<{ [key: string]: string }> // Function to load translations for a given namespace
}

const LocaleContext = createContext<LocaleContextProps>({
  locale: 'en',
  setLocale: () => {},
  loadNamespaceTranslations: async () => ({}),
})

const localeSignal = useSignal('en')

/**
 * Sets the initial locale for the application.
 *
 * @param locale - The locale to set as the initial value.
 */
export function setInitialLocale(locale: string) {
  localeSignal.value = locale
}

/**
 * Custom hook to access and manage the locale context.
 *
 * @returns An object containing the current locale, a function to set the locale, and a function to load translations.
 */
export function useLocale(): LocaleContextProps {
  const context = useContext(LocaleContext)
  return {
    locale: localeSignal.value,
    setLocale: (newLocale: string) => {
      localeSignal.value = newLocale
      context.setLocale(newLocale)
    },
    loadNamespaceTranslations: context.loadNamespaceTranslations,
  }
}
