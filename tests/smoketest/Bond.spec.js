const { test, expect } = require('@playwright/test');
const log = require('../functions/Utilities/log')
const { Util, URL, getJSONKey } = require('../functions/Utilities/Util')
const dateFormat = require("dateformat");
const Bond = require('../functions/smoketest/Bond')

test.describe('Smoketest | Bond - Bond Project', () => {

  test('Should display BandProject Page properly', async ({ page, context }) => {
    const bond_name = 'testAutomation'

    const util = new Util(page)
    const bond = new Bond(page)

    context.clearCookies()

    // page.on('response', async response => {
    //   if (response.url() === URL.api('api/notification/list')) {
    //     const { data, status } = await util.onResponse(response)
    //     noti_data = data['data'];
    //     noti_status = status
    //   }
    // })

    await util.Login()

    // switch role
    await util.switcRole(2)
    log.set('Change Role to Maker - Issuer')

    // go to BondProject page
    log.action('Go to Bond Project page')
    await page.locator('//span[@class="ant-menu-title-content"]').nth(3).click()
    await page.locator('//ul[@class="ant-menu ant-menu-sub ant-menu-inline"]/li[1]').click()

    const bondproject_header = await page.locator('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div[1]/div[1]/div/article').innerHTML()
    expect(bondproject_header).toBe('Bond Project')

    // create Bond
    log.message('Create new bond')
    const create_bond_btn = '//div[@class="search"]/div[1]/div[2]/div[1]/div[2]/button'
    await page.locator(create_bond_btn).click()
    await page.locator('//input[@id="name"]').fill(bond_name)
    await page.locator('//form/button[@type="submit"]').click()
    await page.waitForTimeout(3000)
    log.success('Create new bond succeed')

    log.message('Go to created bond')
    await page.locator(`//tbody/tr[2]/td[@title="${bond_name}"]/span[3]/a`).click()
    await page.waitForTimeout(1000)
    const bn_title = await page.locator('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[3]/span').innerText()
    const issue_name = await page.locator('//input[@id="name"]').inputValue()
    expect(bn_title).toBe(bond_name)
    expect(issue_name).toBe(bond_name)

    log.action('Select Submit Cooling Filing and Effective Filing Together')
    await page.locator('//input[@type="search"]').click()
    const sp = document.querySelector('input[@type="search"]')
    log._log(sp.offsetTop)
    log._log(sp.offsetLeft)
    await page.mouse.click(500, 500)
    await page.waitForTimeout(6000)
    log.action('Click Intent to Submit Filing Issuer Information Early')
    await page.locator('//span[@class="ant-radio"]').click()

    log.action('Click back')
    await page.locator('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button').click()
    log.action('Delete bond')
    await page.locator(`//td[@title="${bond_name}"]/parent::tr/td[16]/span/div/button[3]`).click()
    log.action('Confitm delete bond')
    await page.locator('//div[@class="ant-modal-confirm-btns"]/button[2]').click()

    await util.Logout()
  })

})