export interface I18nOptions {
  languages: string[]
  defaultLanguage: string
}

export function initI18n(options: I18nOptions) {
  return {
    async loadNamespaceTranslations(
      locale: string,
      namespaces: string[],
    ): Promise<{ [namespace: string]: { [key: string]: string } }> {
      const translations: { [namespace: string]: { [key: string]: string } } =
        {}

      const validLocale = options.languages.includes(locale)
        ? locale
        : options.defaultLanguage

      for (const namespace of namespaces) {
        try {
          const response = await fetch(
            `/locales/${validLocale}/${namespace}.json`,
          )
          if (!response.ok) {
            throw new Error(
              `Could not load translations for ${validLocale}/${namespace}`,
            )
          }
          translations[namespace] = await response.json()
        } catch (error) {
          console.error(error)
          translations[namespace] = {}
        }
      }

      return translations
    },
  }
}
