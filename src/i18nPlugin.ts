import { type I18nOptions, initI18n } from './initI18n.ts'
import { setInitialLocale } from './useLocale.ts'
import type { MiddlewareFn } from './types.ts'

interface TranslationState {
  locale: string
  translations: { [namespace: string]: { [key: string]: string } }
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

    // ロケールの初期化
    setInitialLocale(locale)

    // 名前空間ごとの翻訳データをロード
    const namespaces = ['common', 'homepage']
    const translations = await i18n.loadNamespaceTranslations(
      locale,
      namespaces,
    )

    ctx.state.locale = locale
    ctx.state.translations = translations

    return ctx.next()
  }
}
