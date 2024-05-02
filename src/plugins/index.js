import router from '@/router'
import store from '@/store'
import vuetify from './vuetify'
import { msal } from './msal'

export function registerPlugins(app) {
  app
    .config.globalProperties.$msal = msal;
    app
      .use(vuetify)
      .use(router)
      .use(store)
}
