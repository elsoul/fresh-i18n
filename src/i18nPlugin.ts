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
 * Middleware function to initialize internationalization (i18n) support.
 * This plugin detects the user's language based on the URL, loads the necessary
 * translation files dynamically, and saves the translations, locale, and base path as
 * global signals for both client-side and server-side access.
 *
 * @param options - Configuration options for the i18n plugin.
 * @returns A middleware function that handles language detection and translation loading.
 */
export const i18nPlugin = (
  { languages, defaultLanguage, localesDir }: I18nOptions,
): MiddlewareFn<TranslationState> => {
  return async (ctx) => {
    const url = new URL(ctx.req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const lang = languages.includes(pathSegments[0])
      ? pathSegments[0]
      : defaultLanguage

    const rootPath = lang === pathSegments[0]
      ? '/' + pathSegments.slice(1).join('/')
      : url.pathname

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

    await loadTranslation('common')
    await loadTranslation('error')
    await loadTranslation('metadata')
    for (
      const segment of pathSegments.slice(lang === pathSegments[0] ? 1 : 0)
    ) {
      await loadTranslation(segment)
    }

    ctx.state.translationData = translationData

    const response = await ctx.next() as Response
    return response
  }
}
