import { join } from '@std/path'
import { pathname, translationData } from '@/src/store.ts'
import type { MiddlewareFn } from '@/src/types.ts'

/**
 * Configuration options for the i18n plugin.
 *
 * @property languages - An array of supported language codes (e.g., ['en', 'ja']).
 * @property defaultLanguage - The default language code to use when no language is detected.
 * @property localesDir - The directory path where translation JSON files are stored.
 */
export interface I18nOptions {
  languages: string[]
  defaultLanguage: string
  localesDir: string
}

/**
 * Reads a JSON file and parses its contents.
 *
 * @param filePath - The path to the JSON file.
 * @returns Parsed JSON object as Record<string, string>, or an empty object if parsing fails.
 */
async function readJsonFile(filePath: string): Promise<Record<string, string>> {
  const content = await Deno.readTextFile(filePath)
  try {
    return JSON.parse(content) as Record<string, string>
  } catch {
    return {}
  }
}

/**
 * Middleware function to initialize internationalization (i18n) support.
 * This plugin detects the user's language based on the URL, loads the necessary
 * translation files dynamically, and saves the translations and base path as
 * global signals for both client-side and server-side access.
 *
 * @param options - Configuration options for the i18n plugin.
 * @returns A middleware function that handles language detection and translation loading.
 */
export const i18nPlugin = (
  { languages, defaultLanguage, localesDir }: I18nOptions,
): MiddlewareFn<
  { t: Record<string, Record<string, string>>; path: string }
> => {
  return async (ctx) => {
    const url = new URL(ctx.req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const lang = languages.includes(pathSegments[0])
      ? pathSegments[0]
      : defaultLanguage

    // Sets the root path without the language prefix for client-side navigation.
    const rootPath = lang === pathSegments[0]
      ? '/' + pathSegments.slice(1).join('/')
      : url.pathname

    ctx.state.path = rootPath
    pathname.value = rootPath

    const translationDataSSR: Record<string, Record<string, string>> = {}

    /**
     * Loads a translation namespace by reading the corresponding JSON file from `localesDir`.
     * If the file does not exist, it is ignored.
     *
     * @param namespace - The namespace of the translation file to load (e.g., 'common').
     */
    const loadTranslation = async (namespace: string) => {
      try {
        const filePath = join(localesDir, lang, `${namespace}.json`)
        const data = await readJsonFile(filePath)
        translationDataSSR[namespace] = data
      } catch {
        // Ignore if the translation file does not exist
      }
    }

    // Load the common namespace and additional namespaces based on the URL path.
    await loadTranslation('common')
    for (
      const segment of pathSegments.slice(lang === pathSegments[0] ? 1 : 0)
    ) {
      await loadTranslation(segment)
    }

    ctx.state.t = translationDataSSR
    translationData.value = translationDataSSR

    // Call `ctx.next()` to continue to the next middleware in the chain.
    await ctx.next()
  }
}
