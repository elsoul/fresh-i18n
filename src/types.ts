import type { VNode } from 'preact'

export interface FreshContext<State = unknown> {
  req: Request
  url: URL
  state: State & { [key: string]: unknown }
  next: () => Promise<Response>
  redirect(path: string, status?: number): Response
  render(vnode: VNode, init?: ResponseInit): Response | Promise<Response>
}

export type MiddlewareFn<State> = (
  ctx: FreshContext<State>,
) => Response | Promise<Response>

export interface TranslationState {
  locale: string
  translations: { [namespace: string]: { [key: string]: string } }
}
