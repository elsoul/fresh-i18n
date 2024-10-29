import { join } from '@std/path'
import type { MiddlewareFn, TranslationState } from '@/src/types.ts'

/**
 * Configuration options for the i18n plugin.
 *
 * @property languages - Array of supported language codes (e.g., ['en', 'ja']).
 * @property defaultLanguage - Default language code used when no language is detected.
 * @property localesDir - Directory path where translation JSON files are stored.
 */
export interface I18nOptions {
  languages: string[]
  defaultLanguage: string
  localesDir: string
}

/**
 * Reads a JSON file and parses its contents.
 *
 * @param filePath - Path to the JSON file.
 * @returns Parsed JSON object as a record of key-value pairs.
 */
async function readJsonFile(filePath: string): Promise<Record<string, string>> {
  try {
    const content = await Deno.readTextFile(filePath)
    return JSON.parse(content) as Record<string, string>
  } catch {
    return {}
  }
}

/**
 * Parses the Accept-Language header to determine the user's preferred language.
 *
 * @param acceptLanguage - The value of the Accept-Language header.
 * @param supportedLanguages - Array of supported language codes.
 * @param defaultLanguage - The default language code.
 * @returns The matched language code or the default language.
 */
function getPreferredLanguage(
  acceptLanguage: string,
  supportedLanguages: string[],
  defaultLanguage: string,
): string {
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, qValue] = lang.trim().split(';q=')
      return {
        code: code.toLowerCase(),
        q: qValue ? parseFloat(qValue) : 1.0,
      }
    })
    .sort((a, b) => b.q - a.q)

  for (const lang of languages) {
    const code = lang.code.split('-')[0] // Handle regional variants like 'en-US'
    if (supportedLanguages.includes(code)) {
      return code
    }
  }

  return defaultLanguage
}

/**
 * Middleware function to initialize internationalization (i18n) support.
 * This plugin detects the user's language based on the URL and the Accept-Language header,
 * loads the necessary translation files dynamically, and saves the translations, locale,
 * and base path as global signals for both client-side and server-side access.
 *
 * If no language code is present in the URL, it redirects to the URL with the user's preferred language.
 *
 * @param options - Configuration options for the i18n plugin.
 * @returns A middleware function that handles language detection, translation loading, and redirects.
 */
export const i18nPlugin = (
  { languages, defaultLanguage, localesDir }: I18nOptions,
): MiddlewareFn<TranslationState> => {
  return async (ctx) => {
    const url = new URL(ctx.req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)

    // Detect the language from the first path segment
    let lang = languages.includes(pathSegments[0]) ? pathSegments[0] : null

    // If no language is detected in the URL, determine the user's preferred language
    if (!lang) {
      const acceptLanguage = ctx.req.headers.get('Accept-Language') || ''
      lang = getPreferredLanguage(acceptLanguage, languages, defaultLanguage)

      // Build the new URL by prepending the determined language
      const newPathname = `/${lang}${url.pathname}`
      const newUrl = new URL(url.toString())
      newUrl.pathname = newPathname

      // Return a 307 Temporary Redirect response
      return Response.redirect(newUrl.toString(), 307)
    }

    // Continue processing with the detected language
    const rootPath = '/' + pathSegments.slice(1).join('/')

    ctx.state.path = rootPath
    ctx.state.locale = lang

    const translationData: Record<string, Record<string, string>> = {}

    /**
     * Loads a translation namespace by reading the corresponding JSON file from `localesDir`.
     * If the file does not exist, it is ignored.
     *
     * @param namespace - The namespace of the translation file to load (e.g., 'common').
     */
    const loadTranslation = async (namespace: string) => {
      const filePath = join(localesDir, lang, `${namespace}.json`)
      const data = await readJsonFile(filePath)
      if (Object.keys(data).length > 0) {
        translationData[namespace] = data
      }
    }

    // Load common translations and other namespaces
    await loadTranslation('common')
    await loadTranslation('error')
    await loadTranslation('metadata')
    for (const segment of pathSegments.slice(1)) {
      await loadTranslation(segment)
    }

    ctx.state.translationData = translationData

    const response = await ctx.next() as Response
    return response
  }
}
