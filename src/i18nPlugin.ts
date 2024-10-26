import { type I18nOptions, initI18n } from './initI18n.ts'
import { setInitialLocale } from './useLocale.ts'
import type { MiddlewareFn } from './types.ts'

interface TranslationState {
  locale: string
  translations: { [namespace: string]: { [key: string]: string } }
  loadNamespaceTranslations: (
    namespace: string,
  ) => Promise<{ [key: string]: string }>
}

export function i18nPlugin<T>(
  options: I18nOptions,
): MiddlewareFn<T & TranslationState> {
  const i18n = initI18n(options)

  return async function (ctx) {
    const langFromUrl = ctx.url.searchParams.get('lang')
    const langFromHeader = ctx.req.headers.get('accept-language')
    const lang = langFromUrl || langFromHeader?.split(',')[0] ||
      options.defaultLanguage

    const locale = options.languages.includes(lang)
      ? lang
      : options.defaultLanguage

    setInitialLocale(locale)

    ctx.state.locale = locale
    ctx.state.translations = {}

    ctx.state.loadNamespaceTranslations = async (namespace: string) => {
      if (!ctx.state.translations[namespace]) {
        const translations = await i18n.loadNamespaceTranslations(locale, [
          namespace,
        ])
        ctx.state.translations[namespace] = translations[namespace]
      }
      return ctx.state.translations[namespace]
    }

    return ctx.next()
  }
}
