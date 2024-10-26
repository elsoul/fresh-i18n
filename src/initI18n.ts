/**
 * Interface for configuring internationalization options.
 */
export interface I18nOptions {
  languages: string[] // Supported languages
  defaultLanguage: string // Default language
  localesDir: string // Directory containing translation files
}

/**
 * Initializes the i18n functionality with the given options.
 *
 * @param options - The configuration options for the i18n.
 * @returns An object containing the function to load namespace translations.
 */
export function initI18n(options: I18nOptions) {
  return {
    /**
     * Loads translations for the specified namespaces in the given locale.
     *
     * @param locale - The locale for which to load translations.
     * @param namespaces - The array of namespace identifiers.
     * @returns A promise that resolves to an object mapping namespaces to their translations.
     */
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
