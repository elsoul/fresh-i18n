export interface I18nOptions {
  languages: string[]
  defaultLanguage: string
  localesDir: string
}

export function initI18n(options: I18nOptions) {
  return {
    async loadNamespaceTranslations(
      locale: string,
      namespaces: string[],
    ): Promise<{ [namespace: string]: { [key: string]: string } }> {
      const translations: { [namespace: string]: { [key: string]: string } } =
        {}

      for (const namespace of namespaces) {
        const path = `${options.localesDir}/${locale}/${namespace}.json`

        try {
          const module = await import(path)
          translations[namespace] = module.default || {}
        } catch (error) {
          console.error(
            `Could not load translations for ${locale}/${namespace}`,
            error,
          )
          translations[namespace] = {}
        }
      }

      return translations
    },
  }
}
