import type { h } from 'preact'
import { currentLocale } from '@/src/store.ts'
import type { JSX } from 'preact'

/**
 * Props for the Link component.
 *
 * @property href - The target path for the link.
 * @property children - The content to display inside the link.
 */
type LinkProps = JSX.IntrinsicElements['a'] & {
  href: string
}

/**
 * A locale-aware link component that preserves the current locale in the URL.
 *
 * @param props - The properties for the Link component.
 * @returns A link component with the current locale prefixed to the href.
 */
export function Link({ href, children, ...props }: LinkProps): h.JSX.Element {
  const localizedHref = `/${currentLocale.get()}${
    href.startsWith('/') ? href : `/${href}`
  }`

  return (
    <a href={localizedHref} {...props}>
      {children}
    </a>
  )
}
