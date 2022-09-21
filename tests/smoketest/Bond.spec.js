const { test, expect } = require('@playwright/test');
const log = require('../functions/Utilities/log')
const { Util, URL, getJSONKey } = require('../functions/Utilities/Util')
const bp = require('../functions/data/bond_project')
// const dateFormat = require("dateformat");
// const Bond = require('../functions/smoketest/Bond')

test.describe('Smoketest | Bond - Bond Project', () => {

  test('Should display BandProject Page properly', async ({ page, context }) => {
    const bond_name = 'testAutomation'

    const util = new Util(page)
    // const bond = new Bond(page)

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

    // verify bond
    log.message('Go to created bond')
    await page.locator(`//tbody/tr[2]/td[@title="${bond_name}"]/span[3]/a`).click()
    await page.waitForTimeout(1000)
    const bn_title = await page.locator('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[3]/span').innerText()
    const issue_name = await page.locator('//input[@id="name"]').inputValue()
    expect(bn_title).toBe(bond_name)
    expect(issue_name).toBe(bond_name)

    // insert data to bond
    log.action('Select Submit Cooling Filing and Effective Filing Together')
    await page.locator('//input[@type="search"]').click()
    await page.locator('//div[@class="ant-select-item ant-select-item-option"]').click()
    await page.waitForTimeout(1000)
    log.action('Click Intent to Submit Filing Issuer Information Early')
    await page.locator('//span[@class="ant-radio"]').click()
    await page.locator('//button[@type="submit"]').click()
    await page.locator('//div[@class="ant-tabs-tab"]').nth(4).click()
    await page.waitForTimeout(6000)

    log.action('Enter postal id')
    const postal_id = page.locator('//input[@id="postalID"]')
    await postal_id.scrollIntoViewIfNeeded()
    await postal_id.fill(bp.init_issuer_profile.isser_info.postal_id)

    log.action('Enter tax id')
    const tex_id = page.locator('//input[@id="taxID"]')
    await tex_id.scrollIntoViewIfNeeded()
    await tex_id.fill(bp.init_issuer_profile.isser_info.tax_id)

    log.action('Enter tax area')
    const tex_area = page.locator('//input[@id="taxArea"]')
    await tex_area.scrollIntoViewIfNeeded()
    await tex_area.fill(bp.init_issuer_profile.isser_info.tax_area)

    log.action('Enter mobile phone')
    const mobile_phone = page.locator('//input[@id="mobilePhone"]')
    await mobile_phone.scrollIntoViewIfNeeded()
    await mobile_phone.fill(bp.init_issuer_profile.isser_info.mobile_phone)

    log.get('checkbox')
    const cbs = await page.$$eval('//input[@type="checkbox"]/parent::span/parent::label/span[2]', checkbox => {
      return Array.from(checkbox, cb => {
        return cb.innerHTML
      })
    })
    // console.log(cbs)
    for (let i = 0; i < cbs.length; i++) {
      if (i !== 10) {
        await page.locator('//input[@type="checkbox"]/parent::span/parent::label/span[2]').nth(i).scrollIntoViewIfNeeded()
        await page.locator('//input[@type="checkbox"]/parent::span/parent::label/span[2]').nth(i).click()
        log.action(`Click checkbox - ${i + 1}`)
        const inputs = await page.$$eval(`//div[@class="funding-min-max"][${i + 1}]//input`, input => {
          return Array.from(input, inp => inp.getAttribute('class'))
        })
        for (let j = 0; j < inputs.length + 1; j++) {
          if (j === 4 || j === 5) {
            await page.locator(`//div[@class="funding-min-max"][${i + 1}]//input`).nth(j).click()
            await page.locator(`//div[@class="funding-min-max"][${i + 1}]//input`).nth(j).fill(bp.init_issuer_profile.isser_info.objective[i][j - 1])
            await page.locator(`//div[@class="funding-min-max"][${i + 1}]//input`).nth(j).press('Enter')
            log.action('Insert date')
          }
          else if (j !== 0 && j !== 6) {
            await page.locator(`//div[@class="funding-min-max"][${i + 1}]//input`).nth(j).fill(bp.init_issuer_profile.isser_info.objective[i][j - 1])
            log.action('Insert amount')
          }
          else if (j === 6) {
            await page.locator(`//div[@class="funding-min-max"][${i + 1}]//textarea`).fill(bp.init_issuer_profile.isser_info.objective[i][j - 1])
            log.action('Insert detail')
          }
        }
        log.success('Insert data into field secceed')
      }
    }
    await page.waitForTimeout(6000)

    log.action('Click back')
    await page.locator('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button').click()
    await page.waitForTimeout(3000)
    log.action('Delete bond')
    await page.locator(`//td[@title="${bond_name}"]/parent::tr/td[16]/span/div/button[3]`).click()
    log.action('Confitm delete bond')
    await page.locator('//div[@class="ant-modal-confirm-btns"]/button[@class="ant-btn ant-btn-primary"][1]/span').click()

    await util.Logout()
  })

})