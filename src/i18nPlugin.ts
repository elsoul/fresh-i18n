import { join } from '@std/path'
import { pathname, translationData } from '@/src/store.ts'
import type { MiddlewareFn } from '@/src/types.ts'

export interface I18nOptions {
  languages: string[]
  defaultLanguage: string
  localesDir: string
}

async function readJsonFile(filePath: string): Promise<Record<string, string>> {
  const content = await Deno.readTextFile(filePath)
  try {
    return JSON.parse(content) as Record<string, string>
  } catch {
    return {}
  }
}

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

    const rootPath = lang === pathSegments[0]
      ? '/' + pathSegments.slice(1).join('/')
      : url.pathname

    ctx.state.path = rootPath
    pathname.value = rootPath

    const translationDataSSR: Record<string, Record<string, string>> = {}

    const loadTranslation = async (namespace: string) => {
      try {
        const filePath = join(localesDir, lang, `${namespace}.json`)
        const data = await readJsonFile(filePath)
        translationDataSSR[namespace] = data
      } catch {
        // Ignore if the translation file does not exist
      }
    }

    await loadTranslation('common')
    for (
      const segment of pathSegments.slice(lang === pathSegments[0] ? 1 : 0)
    ) {
      await loadTranslation(segment)
    }

    ctx.state.t = translationDataSSR
    translationData.value = translationDataSSR

    // Ensure `ctx.next()` returns a response and handle the response in the middleware chain.
    const response = await ctx.next()
    return response ?? new Response(null, { status: 204 })
  }
}
