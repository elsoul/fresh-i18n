/**
 * Retrieves a translation value from a nested translation object.
 *
 * @param translations - The translations object (e.g., ctx.state.translationData).
 * @returns A function `t` that takes a translation key in dot notation and returns the translated string.
 */
export function createTranslator(
  translations: Record<string, Record<string, string>>,
) {
  /**
   * Translates a key string like 'common.title' or 'common.titlerow.title.example'
   * by traversing the nested structure of `translations`.
   *
   * @param key - The translation key in dot notation (e.g., 'common.title').
   * @returns The translated string, or an empty string if the key is not found.
   */
  const t = (key: string): string => {
    const keys = key.split('.')
    let result: unknown = translations

    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in result) {
        result = (result as Record<string, unknown>)[k]
      } else {
        return '' // Return empty string if key is not found
      }
    }

    return typeof result === 'string' ? result : ''
  }

  return t
}
