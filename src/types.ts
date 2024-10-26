import type { VNode } from 'preact'

/**
 * Context type used by Fresh framework.
 */
export interface FreshContext<State = unknown> {
  req: Request // The incoming request object
  url: URL // The parsed URL of the request
  state: State & { [key: string]: unknown } // The state of the context
  next: () => Promise<Response> // Function to call the next middleware
  redirect(path: string, status?: number): Response // Redirect to a specified path
  render(vnode: VNode, init?: ResponseInit): Response | Promise<Response> // Render a VNode to a response
}

/**
 * Type for middleware function in Fresh.
 */
export type MiddlewareFn<State> = (
  ctx: FreshContext<State>,
) => Response | Promise<Response>

/**
 * State for translation management.
 */
export interface TranslationState {
  locale: string // Current locale
  translations: { [namespace: string]: { [key: string]: string } } // Translations by namespace
}
