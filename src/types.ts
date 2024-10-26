/**
 * Represents the context passed to every middleware function.
 *
 * @template State - The type of state held in the context.
 * @property req - The original incoming `Request` object.
 * @property state - The current translation, path, and locale state.
 * @property next - Function to invoke the next middleware in the chain.
 */
export interface FreshContext<State> {
  req: Request
  state: State
  next: () => Promise<Response | void>
}

/**
 * Type definition for a middleware function in Fresh.
 * Accepts at least `ctx` and `next` as arguments.
 *
 * @template State - The state type for the middleware.
 * @param ctx - The FreshContext with the current request and state.
 * @returns A promise resolving to a `Response` or void.
 */
export type MiddlewareFn<State = TranslationState> = (
  ctx: FreshContext<State>,
) => Promise<Response | void>

/**
 * Represents the state of translations, the base path, and locale within the app.
 *
 * @property t - Object holding translation data for different namespaces.
 * @property path - The base path of the URL without the language prefix.
 * @property locale - The current locale code, used for translations.
 */
export interface TranslationState {
  t: Record<string, Record<string, string>>
  path: string
  locale: string
}
