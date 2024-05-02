// Styles
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

// Composables
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      defaultFont: 'Roboto',
      themes: {
        light: {
            primary: '#1976D2',
        },
        dark: {
            primary: '#2196F3',
        },
    },
    },
  })
