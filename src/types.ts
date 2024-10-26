/**
 * Represents the context passed to every middleware function.
 *
 * @template State - The type of state held in the context.
 * @property req - The original incoming `Request` object.
 * @property state - The current translation and path state.
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
 * @param next - Function to call the next middleware.
 * @returns A promise resolving to a `Response` or void.
 */
export type MiddlewareFn<State = TranslationState> = (
  ctx: FreshContext<State>,
  next: () => Promise<Response | void>,
) => Promise<Response | void>

/**
 * Represents the state of translations and the base path within the app.
 *
 * @property t - Object holding translation data for different namespaces.
 * @property path - The base path of the URL without the language prefix.
 */
export interface TranslationState {
  t: Record<string, Record<string, string>>
  path: string
}
