# `@elsoul/fresh-i18n`

`@elsoul/fresh-i18n` is an efficient and adaptable internationalization (i18n)
plugin designed specifically for Deno's Fresh v2 framework. It enables easy
language management within your Fresh app, providing JSON-based translations,
automatic locale detection, and optimized data loading for an edge-native
experience.

## Features

- **Automatic Locale Detection**: Seamlessly detects the user's language from
  URL parameters, defaulting to a specified language when needed.
- **Modular Translation Loading**: Organize translations by namespaces for
  structured, optimized JSON loading.
- **Intuitive API**: Fetch translations via `useTranslation()` and access or
  switch locales with `useLocale()`.
- **Optimized for Deno Edge**: Designed to work efficiently in edge
  environments, leveraging Deno's performance.
- **Dynamic Language Switching**: Allows for real-time language changes within
  components without a page reload.

## Installation

### Install via JSR

```typescript
import { i18nPlugin } from 'jsr:@elsoul/fresh-i18n'
```

### Install via Deno Land

```typescript
import { i18nPlugin } from 'https://deno.land/x/fresh_i18n/mod.ts'
```

## Usage

### Step 1: Register the Plugin

In your `main.ts`, initialize the plugin with available languages, default
locale, and translation directory. This setup automatically detects the
preferred locale based on the URL.

```typescript
import { App, fsRoutes, staticFiles, trailingSlashes } from 'fresh'
import { i18nPlugin } from 'fresh-i18n'
import type { ExtendedState } from '@/utils/state.ts'

export const app = new App<ExtendedState>({
  root: import.meta.url,
})
  .use(staticFiles())
  .use(trailingSlashes('never'))
  .use(i18nPlugin({
    languages: ['en', 'ja'],
    defaultLanguage: 'en',
    localesDir: './locales',
  }))

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
})

if (import.meta.main) {
  await app.listen()
}
```

#### Define an Extended State with TranslationState

If you are managing additional global state in your Fresh app, such as metadata
or theme settings, you can extend TranslationState to include your own
properties. This extended state can then be used across your app, with
translation data (t) accessible directly in request handlers, enabling
Server-Side Rendering (SSR) with fully localized content.

##### Example

In the following example, TranslationState from @elsoul/fresh-i18n is combined
with a custom State interface to create ExtendedState. This ExtendedState
includes both translation data and other application-specific properties, making
it convenient for global state management.

ExtendedState can then be used in request handlers to access translation data
directly via ctx.state.t, enabling SSR with localized data.

```typescript
import { createDefine } from 'fresh'
import type { TranslationState } from '@elsoul/fresh-i18n'

interface State {
  title?: string
  theme?: string
  description?: string
  ogImage?: string
  noIndex?: boolean
}

// Combine TranslationState with custom State properties
export type ExtendedState = State & TranslationState

// Define the extended state for use in your Fresh app
export const define = createDefine<ExtendedState>()
```

### Step 2: Create Locale JSON Files

Inside the `locales` directory, create subfolders for each locale and organize
translation keys in namespace files. These files are loaded dynamically based on
the URL structure.

For example, if the URL is `https://example.com/en/company/profile`, the plugin
will load the following files (if they exist):

- `./locales/en/common.json` (always loaded as the base translation)
- `./locales/en/company.json`
- `./locales/en/profile.json`

Each of these files corresponds to a "namespace" in the translation data. If a
file does not exist, it is skipped without an error, ensuring flexibility.

#### Example: `locales/en/common.json`

```json
{
  "welcome": "Welcome",
  "title": "Home"
}
```

#### Example: `locales/ja/common.json`

```json
{
  "welcome": "ようこそ",
  "title": "ホーム"
}
```

### Step 3: Use Translations in Components

Leverage `useTranslation()` and `useLocale()` hooks in components to access
translations and handle language switching dynamically.

```tsx
import { useLocale, useTranslation } from '@elsoul/fresh-i18n'

export default function IslandsComponent() {
  const { t } = useTranslation()
  const { locale, changeLanguage } = useLocale()

  return (
    <div>
      <h1>{t('common.title')}</h1> {/* Outputs "Home" or "ホーム" */}
      <p>{t('common.welcome')}</p> {/* Outputs "Welcome" or "ようこそ" */}
      <p>Current language: {locale}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
    </div>
  )
}
```

```tsx
// Example usage in a route handler for SSR
export const handler = define.handlers({
  GET(ctx) {
    console.log('ctx', ctx.state.t) // Access translation data directly
    return page()
  },
})
```

### API Reference

#### `i18nPlugin(options)`

Registers the i18n middleware for handling translation loading and locale
management.

- **Options**:
  - `languages` (string[]): An array of supported languages (e.g.,
    `['en', 'ja']`).
  - `defaultLanguage` (string): The default language code, used if no locale is
    detected.
  - `localesDir` (string): Path to the directory containing locale files.

#### `useTranslation(namespace: string)`

Hook to access translation strings within a specified namespace.

- **Parameters**:
  - `namespace` (string): Namespace identifier to load relevant translations.

#### `useLocale()`

Hook to retrieve and change the current locale.

- **Returns**:
  - `locale` (string): Current locale code.
  - `changeLanguage` (function): Function to update the locale.

#### `Link` Component

A custom `Link` component that maintains the current locale in app-internal
links for consistent navigation.

```tsx
import { Link } from '@elsoul/fresh-i18n';

<Link href="/about">About Us</Link> {/* Locale-aware navigation */}
```

## Contributing

Contributions are welcome! Please submit any issues or pull requests via
[GitHub](https://github.com/elsoul/fresh-i18n).

## License

This package is open-source, available under the
[Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
