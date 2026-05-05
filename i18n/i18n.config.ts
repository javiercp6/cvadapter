import en from './locales/en.json'
import es from './locales/es.json'
import pt from './locales/pt.json'

// You can use `defineI18nConfig` to get type inferences for ozhions to pass to vue-i18n.
export default defineI18nConfig(() => {
  return {
    legacy: false,
    fallbackLocale: 'en',
    locale: 'en',
    messages: {
      en,
      es,
      pt,
    },
  }
})
