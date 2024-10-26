import { signal } from '@preact/signals'

/**
 * Signal to hold translation data globally across the app.
 * Updated by the i18n plugin during SSR and accessible on the client-side.
 */
export const translationData = signal<Record<string, Record<string, string>>>(
  {},
)

/**
 * Signal to hold the pathname without language prefix.
 * Set by the i18n plugin during SSR and accessible on the client-side.
 */
export const pathname = signal<string>('')

/**
 * Signal to hold the current locale across the app.
 * This should be updated by the plugin during SSR and by the user for client-side changes.
 */
export const currentLocale = signal<string>('') // Added currentLocale signal