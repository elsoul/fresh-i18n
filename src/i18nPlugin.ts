import { join } from 'jsr:@std/path'
import { pathname, translationData } from '@/src/store.ts'
import type { MiddlewareFn } from '@/src/types.ts'

/**
 * Options for configuring the i18n plugin.
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
 * Reads a JSON file and parses its contents, ensuring all values are strings.
 *
 * @param filePath - Path to the JSON file.
 * @returns Parsed JSON object as Record<string, string>, or an empty object if invalid.
 */
async function readJsonFile(filePath: string): Promise<Record<string, string>> {
  const content = await Deno.readTextFile(filePath)
  try {
    const data = JSON.parse(content)
    return isStringRecord(data) ? data : {}
  } catch {
    return {}
  }
}

/**
 * Type guard to check if an object is Record<string, string>.
 *
 * @param data - The data to validate.
 * @returns True if data is Record<string, string>, otherwise false.
 */
function isStringRecord(data: unknown): data is Record<string, string> {
  return typeof data === 'object' && data !== null &&
    Object.values(data).every((value) => typeof value === 'string')
}

/**
 * Middleware function to initialize internationalization (i18n) support.
 * This plugin detects the user's language based on the URL, loads the necessary
 * translation files dynamically, and saves the translations and base path as global
 * signals for client-side and server-side access.
 *
 * @param options - Configuration options for the i18n plugin.
 * @returns A middleware function that handles language detection and translation loading.
 */
export const i18nPlugin = (
  { languages, defaultLanguage, localesDir }: I18nOptions,
): MiddlewareFn<
  { t: Record<string, Record<string, string>>; path: string }
> => {
  return async (ctx, next) => {
    const url = new URL(ctx.req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const lang = languages.includes(pathSegments[0])
      ? pathSegments[0]
      : defaultLanguage

    // Set the root path without language prefix for use in client-side navigation
    const rootPath = lang === pathSegments[0]
      ? '/' + pathSegments.slice(1).join('/')
      : url.pathname

    ctx.state.path = rootPath // Server-side context
    pathname.value = rootPath // Global signal for client-side

    // Initialize translation data
    const translationDataSSR: Record<string, Record<string, string>> = {}

    /**
     * Loads a translation namespace by reading the corresponding JSON file from localesDir.
     * If the file does not exist, it is ignored.
     *
     * @param namespace - Namespace for the translation file to load (e.g., 'common').
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

    // Load common namespace and additional namespaces based on the URL path
    await loadTranslation('common')
    for (
      const segment of pathSegments.slice(lang === pathSegments[0] ? 1 : 0)
    ) {
      await loadTranslation(segment)
    }

    // Set translation data in both server context and client-side global signal
    ctx.state.t = translationDataSSR
    translationData.value = translationDataSSR

    await next()
  }
}
