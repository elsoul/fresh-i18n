import { pathname } from '@/src/store.ts'

/**
 * Hook to access the root path of the current URL without the language prefix.
 *
 * @returns The current pathname without the locale prefix.
 */
export function usePathname(): string {
  return pathname.get()
}
