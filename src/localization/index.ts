import { use } from 'i18next'
import { initReactI18next } from 'react-i18next'

import resources from '@/localization/resources'

const STORAGE_KEY = 'rarimo-dashboard-app-locale'
const DEFAULT_LOCALE = 'en-US'

const locale = localStorage?.getItem(STORAGE_KEY) ?? DEFAULT_LOCALE

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
  }
}

// for all options read: https://www.i18next.com/overview/configuration-options
const i18n = use(initReactI18next).init({
  fallbackLng: locale,
  returnNull: false,
  lng: locale,
  resources,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
})

export default i18n
export * from './localizers'
