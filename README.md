# `@elsoul/fresh-i18n`

`@elsoul/fresh-i18n` is a simple and flexible internationalization (i18n) plugin
for Deno's Fresh framework. It allows you to easily manage multiple languages in
your Fresh app using translations and locale detection.

## Features

- **Easy locale detection**: Automatically detects the user's language based on
  request headers.
- **JSON-based translations**: Organize your translations in JSON files, ready
  for use with namespaces.
- **Simple hooks API**: Use `useTranslation()` to fetch translations and
  `useLocale()` to get or change the current locale.
- **Edge-native**: Optimized for Deno's edge servers for high performance.
- **Dynamic language switching**: Enables dynamic language switching within your
  components.

## Installation

### Install via JSR

```ts
import { i18nPlugin } from 'jsr:@elsoul/fresh-i18n'
```

### Install via Deno Land

```ts
import { i18nPlugin } from 'https://deno.land/x/fresh_i18n/mod.ts'
```

## Usage

### Step 1: Register the Plugin

First, register the plugin in your `main.ts` file and provide the available
locales and JSON translations.

```ts
import { start } from '$fresh/server.ts'
import manifest from './fresh.gen.ts'
import { i18nPlugin } from '@elsoul/fresh-i18n'

await start(manifest, {
  plugins: [
    i18nPlugin({
      locales: ['en', 'ja'],
      defaultLocale: 'en',
      localesDir: './locales', // Path to the directory where JSON files are stored
    }),
  ],
})
```

### Step 2: Create JSON Translation Files

In the `locales` directory, create locale folders and JSON translation files for
each supported locale.

#### `locales/en/common.json`

```json
{
  "welcome": "Welcome",
  "title": "Home"
}
```

#### `locales/ja/common.json`

```json
{
  "welcome": "ようこそ",
  "title": "ホーム"
}
```

### Step 3: Use Translations in Components

Now you can use the `useTranslation()` and `useLocale()` hooks to fetch
translations and switch between locales in your components.

```tsx
import { useTranslation } from '@elsoul/fresh-i18n'
import { useLocale } from '@elsoul/fresh-i18n'

export default function Home() {
  const { t } = useTranslation()
  const { locale, changeLanguage } = useLocale()

  return (
    <div>
      <h1>{t('common.title')}</h1> {/* 'Home' or 'ホーム' */}
      <p>{t('common.welcome')}</p> {/* 'Welcome' or 'ようこそ' */}
      <p>Current language: {locale}</p>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
    </div>
  )
}
```

### Step 4: Change the Language

Use the `changeLanguage()` function from the `useLocale()` hook to dynamically
switch between languages.

```tsx
const { locale, changeLanguage } = useLocale()
changeLanguage('ja') // Switch to Japanese
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on
[GitHub](https://github.com/elsoul/fresh-i18n).

## License

This package is open-sourced under the
[Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).
