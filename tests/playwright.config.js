const default_use = {
  // browserName: 'webkit',
  browserName: 'firefox',
  // browserName: 'chromium',
  viewport: { width: 1280, height: 720 },
  // screenshot: 'only-on-failure',
}
const default_config = {
  workers: 1,
  timeout: 900000,
}

const config = {
  dev: {
    ...default_config,
    use: {
      ...default_use,
      headless: false,
    },
  },
  production: {
    ...default_config,
    use: {
      ...default_use,
      headless: true,
    },
    // retries: 2,
  }
}

module.exports = config.dev
