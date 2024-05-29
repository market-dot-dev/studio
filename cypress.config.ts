import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://app.gitwallet.local:3000',
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
