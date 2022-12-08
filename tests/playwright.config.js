const config = {
  dev: {
    use: {
      browserName: 'chromium',
      headless: false,
      viewport: { width: 1280, height: 720 },
      // screenshot: 'only-on-failure',
    },
    workers: 1,
    timeout: 900000,
  },
  production: {
    use: {
      browserName: 'chromium',
      headless: true,
      viewport: { width: 1280, height: 720 },
      // screenshot: 'only-on-failure',
    },
    // retries: 2,
    workers: 1,
    timeout: 900000,
  }
}

module.exports = config.production
