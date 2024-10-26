import { pathname } from '@/src/store.ts'
import { useAtom } from 'fresh-atom'

/**
 * Hook to access the root path of the current URL without the language prefix.
 *
 * @returns The current pathname without the locale prefix.
 */
export function usePathname(): string {
  const [currentPath] = useAtom(pathname)
  return currentPath
}
