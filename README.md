# `@elsoul/fresh-i18n`

`@elsoul/fresh-i18n` is a simple and flexible internationalization (i18n) plugin
for Deno's Fresh framework. It allows you to easily manage multiple languages in
your Fresh app using JSON-based translations and locale detection.

## Features

- **Automatic Locale Detection**: Automatically detects the user's language
  based on request headers or URL parameters.
- **Namespace Support**: Organize translations by namespaces in JSON files for
  efficient loading and modularization.
- **Simple Hooks API**: Use `useTranslation()` to fetch translations and
  `useLocale()` to get or change the current locale.
- **Edge-native**: Optimized for Deno's edge servers for high performance.
- **Dynamic Language Switching**: Enables dynamic language switching within your
  components.

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

### Step 1: Register the Plugin (Updated for Fresh v2)

In your `main.ts` file, register the plugin, specifying the available locales
and default language, along with any namespaces you wish to use.

```typescript
import { App, fsRoutes, staticFiles, trailingSlashes } from 'fresh'
import { i18nPlugin } from '@elsoul/fresh-i18n'

export const app = new App({
  root: import.meta.url,
})
  .use(staticFiles())
  .use(trailingSlashes('never'))
  .use(i18nPlugin({
    languages: ['en', 'ja'], // Supported languages
    defaultLocale: 'en', // Default language
    localesDir: './locales', // Directory path to JSON files
  }, ['common', 'homepage'])) // Example of namespace customization

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
})

if (import.meta.main) {
  await app.listen()
}
```

### Step 2: Create JSON Translation Files

In the `locales` directory, create folders for each locale and JSON files for
each namespace.

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

Use the `useTranslation()` and `useLocale()` hooks in your components to fetch
translations and switch between locales dynamically.

```tsx
import { useLocale, useTranslation } from '@elsoul/fresh-i18n'

export default function Home() {
  const { t } = useTranslation('common') // Use the "common" namespace
  const { locale, changeLanguage } = useLocale()

  return (
    <div>
      <h1>{t('title')}</h1> {/* Outputs 'Home' or 'ホーム' */}
      <p>{t('welcome')}</p> {/* Outputs 'Welcome' or 'ようこそ' */}
      <p>Current language: {locale}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
    </div>
  )
}
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on
[GitHub](https://github.com/elsoul/fresh-i18n).

## License

This package is open-source and available under the
[Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
