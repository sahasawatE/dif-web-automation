// const asset = `${process.env.URL}`.split('-')[1]
// const asset_name = asset[0].toUpperCase() + asset.slice(1)

// const RPconfig = {
//   token: '258f1ffa-5e99-43f7-a39f-b6f1d96d8e02',
//   endpoint: 'https://reporttools-pttep.msappproxy.net/api/v1',
//   project: 'idca-offshore',
//   launch: process.env.LAUNCH, //process.env.LAUNCH
//   description: 'idca-offshore automate testing',
//   attributes: [
//     {
//       key: 'tag',
//       value: process.env.ENV, //process.env.ENV
//     },
//     {
//       key: 'asset',
//       value: asset_name
//     }
//   ],
// }

const config = {
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    // screenshot: 'only-on-failure',
  },
  // retries: 2,
  workers: 1,
  timeout: 900000,
  // reporter: [['@reportportal/agent-js-playwright', RPconfig]],
}

module.exports = config
