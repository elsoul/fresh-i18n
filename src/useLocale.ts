import { useSignal } from '@preact/signals'

const localeSignal = useSignal<string | undefined>(undefined)

export function setInitialLocale(initialLocale: string) {
  if (localeSignal.value === undefined) {
    localeSignal.value = initialLocale
  }
}

export function useLocale() {
  if (localeSignal.value === undefined) {
    throw new Error(
      'Initial locale is not set. Make sure to initialize the locale with i18nPlugin.',
    )
  }

  return {
    locale: localeSignal.value,
    setLocale: (newLocale: string) => {
      localeSignal.value = newLocale
    },
  }
}
