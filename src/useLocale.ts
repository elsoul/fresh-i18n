import { useSignal } from '@preact/signals'
import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

interface LocaleContextProps {
  locale: string
  setLocale: (locale: string) => void
  loadNamespaceTranslations: (
    namespace: string,
  ) => Promise<{ [key: string]: string }>
}

const LocaleContext = createContext<LocaleContextProps>({
  locale: 'en',
  setLocale: () => {},
  loadNamespaceTranslations: async () => ({}),
})

const localeSignal = useSignal('en')

export function setInitialLocale(locale: string) {
  localeSignal.value = locale
}

export function useLocale() {
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
