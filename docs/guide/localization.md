# Localization / i18n

# Translations <Badge text="v3.13.0+" />

There are a number of strings used within the component that can all be translated. Out of the box,
Vue Select has translations for the following languages/locales that can be found
in [`src/locales`](https://github.com/sagalbot/vue-select/tree/master/src/locales):

- [English (default)](https://github.com/sagalbot/vue-select/tree/master/src/locales/en.js)
- [French](https://github.com/sagalbot/vue-select/tree/master/src/locales/fr.js)
- [Spanish](https://github.com/sagalbot/vue-select/tree/master/src/locales/es.js)

Translations can be set individually for each component instance, or globally for all instances in
your app. Both methods will use the `locale` prop to determine the text to be used throughout the
component.

**Locale Prop**

The `locale` prop accepts a function and should return an object of translated strings. The function
receives the default english translations for the component. This allows you to override the whole
object, or change just the values you need. The structure of the returned `locale` object is
described below.

**Locale Object**

The object returned from the locale prop requires specific keys to be set. Below is an example from
the english locale that ships with Vue Select:

<<< @/../src/locales/en.js

[View this file on GitHub ](https://github.com/sagalbot/vue-select/tree/master/src/locales/en.js)

# Examples
---

## Translate a Single Instance

Translating a single instance of Vue Select can be accomplished by setting the `locale` function to
return an object with the translations you need. In the example below, we use the french `locale`
object that ships with Vue Select.

<TranslationFrench />
<<< @/.vuepress/components/TranslationFrench.vue

**Modifying Specific Text**

You can also use the `locale` prop to override just the text that you'd like to change. In this
example, the text in the `no-options` slot is updated to say 'No Options found!!'.

<TranslationSingleKey />
<<< @/.vuepress/components/TranslationSingleKey.vue

## Translate all Instances

If you'd like to translate the text for **all** Vue Select instances in your app, you can override
the default prop when registering the component. In the example below, all instances of Vue Select
will be translated to Spanish.

<TranslationSpanish />
<<< @/.vuepress/components/TranslationSpanish.vue

## Right to Left

Vue Select supports RTL using the standard HTML API using the `dir` prop.

```vue

<v-select dir="rtl"></v-select>
```

The `dir` prop accepts the same values as
the [HTML spec](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir):

- `rtl`
- `ltr`
- `auto`

## Contributing Languages

If you'd like to see Vue Select translated to a new language, submit a PR with a new
`locale` file in the `src/locales` folder. The file name should match
the [ISO 639-1 code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for the language, and
export a `locale` object.
