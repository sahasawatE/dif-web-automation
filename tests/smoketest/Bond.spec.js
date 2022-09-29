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

    // funding objective information
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
    await page.waitForTimeout(1000)

    // issuer information
    const issuer_track = page.locator('//span[@class="ant-radio ant-radio-checked"]').nth(1)
    await issuer_track.scrollIntoViewIfNeeded()
    await issuer_track.click();
    log.action('Click radio button')

    await page.locator('//input[@id="relevantLawsOnIncorporation"]').click()
    const buz_under_th_law = page.locator('//div[@title="Business under Thai law."]')
    await buz_under_th_law.scrollIntoViewIfNeeded()
    await buz_under_th_law.click()
    log.action('Click Business under Thai law.')

    await page.locator('//input[@id="businessOrganizationUnderThaiLaw"]').click()
    const bou_th = page.locator('//div[@title="Limited Company/ Public Company Limited"]')
    await bou_th.scrollIntoViewIfNeeded()
    await bou_th.click()
    log.action('Click Limited Company/ Public Company Limited')

    log.success('issuer information')

    // business performance
    await page.locator('//div[@class="tabCard"][2]').scrollIntoViewIfNeeded()
    const issuer_type = page.locator('//input[@id="issuerType"]')
    await issuer_type.scrollIntoViewIfNeeded()
    await issuer_type.click()
    await page.locator('//div[@title="Listed company"]').click()
    log.success('business performance')

    //issuer contact
    const ceo_name = page.locator('//input[@id="ceoName"]')
    await ceo_name.scrollIntoViewIfNeeded()
    await ceo_name.fill(bp.init_issuer_profile.isser_info.issuer_contact.ceo_name)
    log.action('Insert CEO name')

    await page.locator('//input[@id="ceoPosition"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.ceo_position)
    await page.locator('//input[@id="ceoEmail"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.ceo_email)
    log.action('Insert CEO position')

    const cfo_name = page.locator('//input[@id="cfoName"]')
    await cfo_name.scrollIntoViewIfNeeded()
    await cfo_name.fill(bp.init_issuer_profile.isser_info.issuer_contact.cfo_name)
    log.action('Insert CFO name')

    await page.locator('//input[@id="ceoPosition"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.cfo_position)
    await page.locator('//input[@id="ceoEmail"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.cfo_enail)
    log.action('Insert CFO position')

    const issuer_duty_under_section_56 = page.locator('//input[@id="issuerDutiesUnderSection56"]')
    await issuer_duty_under_section_56.scrollIntoViewIfNeeded()
    await issuer_duty_under_section_56.click()
    await page.locator('//div[@title="The company is obliged to submit financial statements and reports on financial position or the results of operations under Section 56."]').click()
    log.action('Select The company is obliged to submit financial statements and reports on financial position or the results of operations under Section 56.')

    await page.locator('//input[@id="standardTermsAndConditionFlag"]').click()
    await page.locator(`//div[@title="Terms of the rights are subject to the example set forth on the SEC Office's website."]`).click()
    log.action("Select Terms of the rights are subject to the example set forth on the SEC Office's website.")

    const DL = page.locator('//div[@id="derivertiveLicense"]//span[@class="ant-radio"]')
    await DL.scrollIntoViewIfNeeded()
    await DL.click()
    log.action('Click Radio button')

    const qles = await page.$$eval('//div[@class="tabCard"][2]//div[@class="ql-editor ql-blank"]', els => {
      return Array.from(els, el => el.getAttribute('data-placeholder'))
    })

    expect(qles.length).toEqual(bp.init_issuer_profile.isser_info.ql_editor_part_1.length)

    let qles_i = 0

    for (let qle of qles) {
      log.action(qle)
      const ql = page.locator(`//div[@class="tabCard"][2]//div[@data-placeholder="${qle}"]`)
      await ql.scrollIntoViewIfNeeded()
      await ql.click()
      await ql.fill(bp.init_issuer_profile.isser_info.ql_editor_part_1[qles_i])
      qles_i++
      log.success('Insert data succeed')
      await page.waitForTimeout(1000)
    }
    await page.waitForTimeout(1000)

    const profileTH = page.locator('//input[@id="profileTH"]')
    await profileTH.scrollIntoViewIfNeeded()
    await profileTH.fill(bp.init_issuer_profile.isser_info.nature_of_buz.profile_th)
    await page.locator('//input[@id="profileEN"]').fill(bp.init_issuer_profile.isser_info.nature_of_buz.profile_en)

    const as_of = page.locator('//input[@id="majorShareholderPaidUpCapitalPercentageAsOf"]')
    await as_of.scrollIntoViewIfNeeded()
    await as_of.click()
    await as_of.fill('2021-06-06')
    await as_of.press('Enter')

    log.action('Save draft')
    const save_draft_btn = page.locator('//button[@type="submit"]').nth(1)
    await save_draft_btn.scrollIntoViewIfNeeded()
    await save_draft_btn.click()

    await page.locator('//div[@class="ant-modal-body"]//button[1]').click()
    await page.waitForTimeout(10000)

    log.action('Click back')
    const back_btn = page.locator('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button')
    await back_btn.scrollIntoViewIfNeeded()
    await back_btn.click()
    await page.waitForTimeout(3000)

    // log.action('Delete bond')
    // await page.locator(`//td[@title="${bond_name}"]/parent::tr/td[16]/span/div/button[3]`).click()
    // log.action('Confitm delete bond')
    // await page.locator('//div[@class="ant-modal-confirm-btns"]/button[@class="ant-btn ant-btn-primary"][1]/span').click()

    await util.Logout()
  })

})