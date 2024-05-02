import msalPlugin from "vue-msal-browser";

export const msal = new msalPlugin({
    auth: {
      clientId: process.env.VUE_APP_HUB_CLIENT_ID,
      authority: 'https://login.microsoftonline.com/organizations/',
      redirectUri: process.env.VUE_APP_HUB_REDIRECT_URI,

      tenantId: process.env.VUE_APP_HUB_TENANT_ID,
      requireAuthOnInitialize: true,
      navigateToRequestUrl: true,
      autoRefreshToken: true,
    },
    cache: {
      cacheLocation: 'localStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
      secureCookies: false,
    },
    request: {
      scopes: [
        'user.read',
        'api://' + process.env.VUE_APP_HUB_CLIENT_ID + '/HubTMAPI',
      ],
    },
    framework: {
      globalMixin: true,
    },
    mode: 'redirect',
  });