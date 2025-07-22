import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translation_en from './en'

const resources = {
  en: {
    translation: translation_en,
  },
}

const language = JSON.parse(localStorage.getItem('setting'))?.state?.language

i18n.use(initReactI18next).init({
  resources,
  lng: language ? language : 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
