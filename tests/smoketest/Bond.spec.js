const { test, expect } = require('@playwright/test');
const log = require('../functions/Utilities/log')
const { Util, URL, getJSONKey } = require('../functions/Utilities/Util')
const dateFormat = require("dateformat");
const Bond = require('../functions/smoketest/Bond')

test.describe('Smoketest | Bond - Bond Project', () => {

  test('Should display BandProject Page properly', async ({ page }) => {
    var noti_data, noti_status

    const util = new Util(page)
    const bond = new Bond(page)

    page.on('response', async response => {
      if (response.url() === URL.api('api/notification/list')) {
        const { data, status } = await util.onResponse(response)
        noti_data = data['data'];
        noti_status = status
      }
    })

    await util.Login()

    // get notifications
    await page.locator('.ant-badge').click()
    await page.waitForTimeout(1000)
    const noti_list = await page.$$eval('//ul[@class="ant-list-items"]/li', nts => {
      return Array.from(nts, nt => {
        const nt_item = nt.textContent
        return {
          date_time: nt_item.slice(0, 17),
          noti_type: nt_item.split('] : ')[0].split('[')[1].split(']')[0],
        }
      })
    })
    await page.waitForTimeout(1000)
    await page.locator('.ant-drawer-close').click()

    // go to BondProject page
    await page.locator('//div[@role="menuitem"]/span[2]').click()
    await page.locator('//ul[@class="ant-menu ant-menu-sub ant-menu-inline"]/li[1]').click()

    const bondproject_header = await page.locator('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div[1]/div[1]/div/article').innerHTML()
    expect(bondproject_header).toBe('Bond Project')

    log.message('Verify Notofication items')
    expect(noti_status).toBe(200)
    expect(noti_list.length).toEqual(noti_data.length)
    for (let i = 0; i < noti_list.length; i++) {
      const d = new Date(noti_data[i]['data']['date'])
      const full_date_time = dateFormat(d, 'dd/mm/yy') + " " + dateFormat(d, 'isoTime')

      expect(noti_list[i]['date_time']).toEqual(full_date_time)
      expect(noti_list[i]['noti_type']).toEqual(noti_data[i]['notiType'])
    }

    await util.Logout()
  })
})