const { test, expect } = require('@playwright/test');
const log = require('../functions/Utilities/log')
const { Util, URL, getJSONKey } = require('../functions/Utilities/Util')
const bp = require('../functions/data/bond_project')
// const dateFormat = require("dateformat");
const Bond = require('../functions/smoketest/Bond')

test.describe('Smoketest | Bond - Bond Project', () => {

  test('Should display BandProject Page properly', async ({ page, context }) => {
    const bond_name = 'testAutomation'

    const util = new Util(page)
    const bond = new Bond(page)

    context.clearCookies()

    await util.Login()

    // switch role
    await util.switcRole(2)
    log.set('Change Role to Maker - Issuer')

    // go to BondProject page
    log.action('Go to Bond Project page')
    await bond.elememt(page.locator('//span[@class="ant-menu-title-content"]').nth(3)).click()
    await bond.elememt('//ul[@class="ant-menu ant-menu-sub ant-menu-inline"]/li[1]').click()

    const bondproject_header = await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div[1]/div[1]/div/article').innerHTML()
    expect(bondproject_header).toBe('Bond Project')

    await util.reset()

    // create Bond
    log.message('Create new bond')
    await bond.elememt('//div[@class="search"]/div[1]/div[2]/div[1]/div[2]/button').click()
    await bond.elememt('//input[@id="name"]').fill(bond_name)
    await bond.elememt('//form/button[@type="submit"]').click()
    await page.waitForTimeout(3000)
    log.success('Create new bond succeed')

    // verify bond
    log.message('Go to created bond')
    await bond.elememt(`//tbody/tr[2]/td[@title="${bond_name}"]/span[3]/a`).click()
    await page.waitForTimeout(1000)
    const bn_title = await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[3]/span').innerText()
    const issue_name = await bond.elememt('//input[@id="name"]').inputValue()
    expect(bn_title).toBe(bond_name)
    expect(issue_name).toBe(bond_name)

    // funding objective information
    log.action('Select Submit Cooling Filing and Effective Filing Together')
    await bond.elememt('//input[@type="search"]').click()
    await bond.elememt('//div[@class="ant-select-item ant-select-item-option"]').click()
    await page.waitForTimeout(1000)
    log.action('Click Intent to Submit Filing Issuer Information Early')
    await bond.elememt('//span[@class="ant-radio"]').click()
    await bond.elememt('//button[@type="submit"]').click()
    await bond.elememt(page.locator('//div[@class="ant-tabs-tab"]').nth(4)).click()
    await page.waitForTimeout(6000)

    log.action('Enter postal id')
    await bond.elememt('//input[@id="postalID"]').fill(bp.init_issuer_profile.isser_info.postal_id)

    // log.action('Enter tax id')
    // const tex_id = page.locator('//input[@id="taxID"]')
    // await tex_id.scrollIntoViewIfNeeded()
    // await tex_id.fill(bp.init_issuer_profile.isser_info.tax_id)

    log.action('Enter tax area')
    await bond.elememt('//input[@id="taxArea"]').fill(bp.init_issuer_profile.isser_info.tax_area)

    log.action('Enter mobile phone')
    await bond.elememt('//input[@id="mobilePhone"]').fill(bp.init_issuer_profile.isser_info.mobile_phone)

    log.get('checkbox')
    const cbs = await bond.elememt('//input[@type="checkbox"]/parent::span/parent::label/span[2]').list()

    for (let i = 0; i < cbs.length; i++) {
      if (i !== 10) {
        await page.locator('//input[@type="checkbox"]/parent::span/parent::label/span[2]').nth(i).click()
        log.action(`Click checkbox - ${i + 1}`)
        const inputs = await bond.elememt(`//div[@class="funding-min-max"][${i + 1}]//input`).list()

        for (let j = 0; j < inputs.length + 1; j++) {
          if (j === 4 || j === 5) {
            await util.enterDate(
              page.locator(`//div[@class="funding-min-max"][${i + 1}]//input`).nth(j),
              bp.init_issuer_profile.isser_info.objective[i][j - 1]
            )
          }
          else if (j !== 0 && j !== 6) {
            const fun_max_min = page.locator(`//div[@class="funding-min-max"][${i + 1}]//input`).nth(j)
            await bond.elememt(fun_max_min).fill(bp.init_issuer_profile.isser_info.objective[i][j - 1])
            log.action('Insert amount')
          }
          else if (j === 6) {
            const fun_max_min = page.locator(`//div[@class="funding-min-max"][${i + 1}]//textarea`)
            await bond.elememt(fun_max_min).fill(bp.init_issuer_profile.isser_info.objective[i][j - 1])
            log.action('Insert detail')
          }
        }
        log.success('Insert data into field secceed')
      }
    }
    await page.waitForTimeout(1000)

    // issuer information
    const issuer_track = page.locator('//span[@class="ant-radio ant-radio-checked"]').nth(1)
    await bond.elememt(issuer_track).click();
    log.action('Click radio button')

    await bond.elememt('//input[@id="relevantLawsOnIncorporation"]').click()
    await bond.elememt('//div[@title="Business under Thai law."]').click()
    log.action('Click Business under Thai law.')

    await bond.elememt('//input[@id="businessOrganizationUnderThaiLaw"]').click()
    await bond.elememt('//div[@title="Limited Company/ Public Company Limited"]').click()
    log.action('Click Limited Company/ Public Company Limited')

    log.success('issuer information')

    // business performance
    // await page.locator('//div[@class="tabCard"][2]').scrollIntoViewIfNeeded()
    await bond.elememt('//input[@id="issuerType"]').click()
    await bond.elememt('//div[@title="Listed company"]').click()
    log.success('business performance')

    //issuer contact
    await bond.elememt('//input[@id="ceoName"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.ceo_name)
    log.action('Insert CEO name')

    await bond.elememt('//input[@id="ceoPosition"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.ceo_position)
    log.action('Insert CEO position')
    await bond.elememt('//input[@id="ceoEmail"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.ceo_email)
    log.action('Insert CEO Email')

    await bond.elememt('//input[@id="cfoName"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.cfo_name)
    log.action('Insert CFO name')

    await bond.elememt('//input[@id="cfoPosition"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.cfo_position)
    log.action('Insert CFO position')
    await bond.elememt('//input[@id="cfoEmail"]').fill(bp.init_issuer_profile.isser_info.issuer_contact.cfo_enail)
    log.action('Insert CFO Email')

    await bond.elememt('//input[@id="issuerDutiesUnderSection56"]').click()
    await bond.elememt('//div[@title="The company is obliged to submit financial statements and reports on financial position or the results of operations under Section 56."]').click()
    log.action('Select The company is obliged to submit financial statements and reports on financial position or the results of operations under Section 56.')

    await bond.elememt('//input[@id="standardTermsAndConditionFlag"]').click()
    await bond.elememt(`//div[@title="Terms of the rights are subject to the example set forth on the SEC Office's website."]`).click()
    log.action("Select Terms of the rights are subject to the example set forth on the SEC Office's website.")

    await bond.elememt('//div[@id="derivertiveLicense"]//span[@class="ant-radio"]').click()
    log.action('Click Radio button')

    const qles = await bond.elememt('//div[@class="tabCard"][2]//div[@class="ql-editor ql-blank"]').list('data-placeholder')

    expect(qles.length).toEqual(bp.init_issuer_profile.isser_info.ql_editor_part_1.length)

    let qles_i = 0

    for (let qle of qles) {
      log.action(qle)
      await bond.elememt(`//div[@class="tabCard"][2]//div[@data-placeholder="${qle}"]`).click()
      await bond.elememt(`//div[@class="tabCard"][2]//div[@data-placeholder="${qle}"]`).fill(bp.init_issuer_profile.isser_info.ql_editor_part_1[qles_i])
      qles_i++
      log.success('Insert data succeed')
      await page.waitForTimeout(500)
    }
    await page.waitForTimeout(500)

    await bond.elememt('//input[@id="profileTH"]').fill(bp.init_issuer_profile.isser_info.nature_of_buz.profile_th)
    log.action('Enter Profile name th')
    await bond.elememt('//input[@id="profileEN"]').fill(bp.init_issuer_profile.isser_info.nature_of_buz.profile_en)
    log.action('Enter Profile name en')

    await bond.elememt('//input[@id="majorShareholderPaidUpCapitalPercentageAsOf"]').click()
    await bond.elememt('//input[@id="majorShareholderPaidUpCapitalPercentageAsOf"]').fill('2021-06-06')
    await bond.elememt('//input[@id="majorShareholderPaidUpCapitalPercentageAsOf"]').press('Enter')
    log.action('Enter AsOf')

    await bond.elememt('//input[@id="registeredPaidUpCapital"]').fill(bp.init_issuer_profile.isser_info.regist_and_paidup_cap)
    log.action('Enter Registered and Paid-up Capital')

    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[12]/div[1]/a/span').click()
    await page.waitForTimeout(2000)

    await bond.elememt('//input[@id="outStandingDebtName"]').fill(bp.init_issuer_profile.isser_info.total_loan_amount.name)
    await bond.elememt('//input[@id="outStandingDebtThaiBMASymbol"]').fill(bp.init_issuer_profile.isser_info.total_loan_amount.symbo)
    await util.enterDate(page.locator('//input[@id="outStandingDebtIssueDate"]'), bp.init_issuer_profile.isser_info.total_loan_amount.date)
    await util.enterDate(page.locator('//input[@id="outStandingDebtMatuarity"]'), bp.init_issuer_profile.isser_info.total_loan_amount.maturity)
    await bond.elememt('//input[@id="outStandingDebtValue"]').fill(bp.init_issuer_profile.isser_info.total_loan_amount.value)
    await bond.elememt('//div[@class="ant-modal-body"]//button[@class="ant-btn ant-btn-primary"]').click()
    await page.waitForTimeout(1500)
    await bond.elememt('//input[@id="totalLoanAmount"]').fill(bp.init_issuer_profile.isser_info.total_loan_amount.value)
    log.action('Add Total Loan Amount List')

    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[13]/div[1]/a/span').click()
    await page.waitForTimeout(2000)

    await bond.elememt('//input[@id="outStandingNoteName"]').fill(bp.init_issuer_profile.isser_info.bill_of_exc_list.name)
    await bond.elememt('//input[@id="outStandingNoteThaiBMASymbol"]').fill(bp.init_issuer_profile.isser_info.bill_of_exc_list.symbo)
    await util.enterDate(page.locator('//input[@id="outStandingNoteIssueDate"]'), bp.init_issuer_profile.isser_info.bill_of_exc_list.date)
    await util.enterDate(page.locator('//input[@id="outStandingNoteMatuarity"]'), bp.init_issuer_profile.isser_info.bill_of_exc_list.maturity)
    await bond.elememt('//input[@id="outStandingNoteValue"]').fill(bp.init_issuer_profile.isser_info.bill_of_exc_list.value)
    await bond.elememt('//div[@class="ant-modal-body"]//button[@class="ant-btn ant-btn-primary"]').click()
    await page.waitForTimeout(1500)
    await bond.elememt('//input[@id="billOfExchange"]').fill(bp.init_issuer_profile.isser_info.bill_of_exc_list.value)
    log.action('Add Bill of Exchange List')

    //key fin
    const key_fin = await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[37]/div[2]/div/div/div/div/div/table/tbody/tr').list()

    for (let i = 0; i < key_fin.length; i++) {
      const kf_selector = `//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[37]/div[2]/div/div/div/div/div/table/tbody/tr[${i + 1}]/td[1]/div`
      const kf_list_item = await bond.elememt(kf_selector).innerText()

      log.action(`Edit ${kf_list_item}`)
      await bond.elememt(`//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[37]/div[2]/div/div/div/div/div/table/tbody/tr[${i + 1}]/td[5]/div/a`).click()

      await bond.elememt('//input[@id="latestYear"]').fill(String(bp.init_issuer_profile.isser_info.key_fin.latest_year[i]))
      await bond.elememt('//input[@id="yearBeforeLatestYear"]').fill(String(bp.init_issuer_profile.isser_info.key_fin.year_before_latest_year[i]))
      await bond.elememt('//input[@id="quarter"]').fill(String(bp.init_issuer_profile.isser_info.key_fin.quater[i]))

      await bond.elememt('//div[@class="ant-modal-body"]//button[@class="ant-btn ant-btn-primary"]').click()

      log.success(kf_list_item)
    }
    await page.waitForTimeout(1000)

    //auditor
    log.action('Auditor')
    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[48]/div/a').click()
    await bond.elememt('//input[@id="auditorFirm"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.auditor_firm}"]`).click()
    await bond.elememt('//div[@class="ant-modal-body"]//button[@class="ant-btn ant-btn-primary"]').click()
    log.success('Enter Auditor data')
    await page.waitForTimeout(1000)

    //legal advisor
    log.action("Legal Advisor")
    await bond.elememt('//input[@id="legalAdvisorThName"]').fill(bp.init_issuer_profile.isser_info.legal_ad.name_th)
    log.action('Enter Legal Advisor thai name')
    await bond.elememt('//input[@id="legalAdvisorEnName"]').fill(bp.init_issuer_profile.isser_info.legal_ad.name_en)
    log.action('Enter Legal Advisor eng name')
    await bond.elememt('//input[@id="legalAdvisorNationality"]').click()
    log.action('Click dropdown Legal Advisor nationality')

    //scroll
    await bond.elememt().Vscroll('//div[@title="AFGHAN"]', `//div[@title="${bp.init_issuer_profile.isser_info.legal_ad.nation}"][@aria-selected="false"]`)
    log.success('Found Legal Advisor nationality')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.legal_ad.nation}"][@aria-selected="false"]`).click()
    log.action('Select Legal Advisor nationality')
    await bond.elememt('//input[@id="legalAdvisorJrsID"]').fill(bp.init_issuer_profile.isser_info.legal_ad.id)
    log.action('Enter Legal Advisor ID')
    await bond.elememt('//input[@id="countryOfRegulationApplied"]').click()
    log.action('Click dropdown Country of Regulation Applied')

    //scroll
    await bond.elememt().Vscroll('//div[@title="AFGHANISTAN"]', `//div[@title="${bp.init_issuer_profile.isser_info.legal_ad.reg_app}"]`)
    log.success('Found Country of Regulation Applied')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.legal_ad.reg_app}"]`).click()
    log.action('Select Country of Regulation Applied')
    log.success("Enter Legal Advisor")

    //part 2
    log.announce('PART 2 : Business Management')
    const qles2 = await bond.elememt('//div[@class="tabCard"][3]//div[@class="ql-editor ql-blank"]').list('data-placeholder')

    let qle2_i = 0

    expect(qles2.length).toEqual(bp.init_issuer_profile.isser_info.ql_editor_part_2.length)

    for (let qle2 of qles2) {
      log.action(qle2)
      await bond.elememt(page.locator(`//div[@class="tabCard"][3]//div[@data-placeholder="${qle2}"]`).nth(qle2_i)).click()
      await bond.elememt(page.locator(`//div[@class="tabCard"][3]//div[@data-placeholder="${qle2}"]`).nth(qle2_i)).fill(bp.init_issuer_profile.isser_info.ql_editor_part_2[qle2_i])
      log.success('Insert data succeed')
      await page.waitForTimeout(500)
    }
    await page.waitForTimeout(500)

    log.action('Enter committee name')
    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[16]/div[8]/div[1]/a/span').click()
    log.action('Click Add')
    await bond.elememt('//input[@id="committeeName"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.committee.name}"]`).click()
    log.action('Enter Committee name')
    await page.locator('//button[@class="ant-btn ant-btn-primary"]').nth(1).click()
    log.action('Click Save')
    await page.waitForTimeout(1000)
    await util.enterDate('//div[@class="tabCard"][3]/div[@class="list-panel"][1]//input', bp.init_issuer_profile.isser_info.committee.asof)
    log.action('Enter Committee Date')

    log.action('Enter controller information')
    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[16]/div[9]/div[1]/a/span').click()
    log.action('Click Add')
    await bond.elememt('//input[@id="controllerThaiPrefix"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.controller_info.th.prefix}"]`).click()
    log.action('Enter th prefix')
    await bond.elememt('//input[@id="controllerEngPrefix"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.controller_info.en.prefix}"]`).click()
    log.action('Enter en prefix')
    await bond.elememt('//input[@id="controllerThaiName"]').fill(bp.init_issuer_profile.isser_info.controller_info.th.firstname)
    log.action('Enter th firstname')
    await bond.elememt('//input[@id="controllerThaiSurname"]').fill(bp.init_issuer_profile.isser_info.controller_info.th.lastname)
    log.action('Enter th lastname')
    await bond.elememt('//input[@id="controllerEngName"]').fill(bp.init_issuer_profile.isser_info.controller_info.en.firstname)
    log.action('Enter en firstname')
    await bond.elememt('//input[@id="controllerEngSurname"]').fill(bp.init_issuer_profile.isser_info.controller_info.en.lastname)
    log.action('Enter en lastname')
    await bond.elememt('//input[@id="controllerCardType"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.controller_info.card_type}"]`).click()
    log.action('Select Card type')
    await bond.elememt('//input[@id="controllerPassportIssuingCountry"]').click()
    log.action('Click Passport Issuing Country')
    await bond.elememt().Vscroll('//div[@title="Afghanistan"]', `//div[@title="${bp.init_issuer_profile.isser_info.controller_info.passport_issuing_country}"]`)
    log.success('Found Passport Issuing Country')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.controller_info.passport_issuing_country}"]`).click()
    log.action('Select Passport Issuing Country')
    await bond.elememt('//input[@id="controllerCardNumber"]').fill(bp.init_issuer_profile.isser_info.controller_info.card_no)
    log.action('Enter Card number')
    await bond.elememt('//input[@id="controllerNationality"]').click()
    log.action('Click Nationality')
    await bond.elememt().Vscroll('//div[@title="Afghan"]', `//div[@title="${bp.init_issuer_profile.isser_info.controller_info.nationality}"][@aria-selected="false"]`)
    log.success('Found Nationality')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.controller_info.nationality}"][@aria-selected="false"]`).click()
    log.action('Select Nationality')
    await util.enterDate('//input[@id="controllerCardIssuedDate"]', bp.init_issuer_profile.isser_info.controller_info.card_issued_date)
    log.action('Enter Card Issued Date')
    await util.enterDate('//input[@id="controllerCardExpiredDate"]', bp.init_issuer_profile.isser_info.controller_info.card_expired_date)
    log.action('Enter Card Expired Date')
    await page.locator('//button[@class="ant-btn ant-btn-primary"]').nth(1).click()
    log.action('Click Save')
    await util.enterDate('//div[@class="tabCard"][3]/div[@class="list-panel"][2]//input', bp.init_issuer_profile.isser_info.controller_info.asof)
    log.action('Enter Controller information date')

    await bond.elememt('//input[@id="numberOfEmployee"]').fill(bp.init_issuer_profile.isser_info.number_of_employee)
    log.action('Enter Number of employee')

    //part 3
    log.announce('PART 3 : Financial Statement')

    const qles3 = await bond.elememt('//div[@class="tabCard"][4]//div[@class="ql-editor ql-blank"]').list('data-placeholder')

    let qle3_i = 0
    for (let qle of qles3) {
      log.action(qle)
      await bond.elememt(`//div[@class="tabCard"][4]//div[@data-placeholder="${qle}"]`).click()
      await bond.elememt(`//div[@class="tabCard"][4]//div[@data-placeholder="${qle}"]`).fill(bp.init_issuer_profile.isser_info.ql_editor_part_3[qle3_i])
      qle3_i++
      log.success('Insert data succeed')
      await page.waitForTimeout(500)
    }
    await page.waitForTimeout(500)

    log.action('Click Accounting period')
    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[17]/div[5]/div[2]/div/div/div/div[1]/div').click()
    await bond.elememt().Vscroll('//div[@label="January"]', `//div[@label="${bp.init_issuer_profile.isser_info.accounting_period[0]}"]`)
    log.success('Found June')
    await bond.elememt(`//div[@label="${bp.init_issuer_profile.isser_info.accounting_period[0]}"]`).click()
    log.action('Select June')
    await bond.elememt().Vscroll('//div[@label="January"]', `//div[@label="${bp.init_issuer_profile.isser_info.accounting_period[1]}"]`)
    log.success('Found December')
    await bond.elememt(`//div[@label="${bp.init_issuer_profile.isser_info.accounting_period[1]}"]`).click()
    log.action('Select December')
    await page.mouse.click(0, 360)
    log.action('Un-Focus Field')
    await bond.elememt('//input[@id="statementFrequency"]').click()
    await bond.elememt(`//div[@label="${bp.init_issuer_profile.isser_info.statement_feq}"]`).click()
    log.action('Select Annually')
    await bond.elememt('//input[@id="financialInstitutionDebt"]').fill(bp.init_issuer_profile.isser_info.debt_position.financial_institution)
    log.action('Enter Financial institution debt')
    await bond.elememt('//input[@id="bondDebt"]').fill(bp.init_issuer_profile.isser_info.debt_position.bond)
    log.action('Enter Bond debt')
    await bond.elememt('//input[@id="otherDebt"]').fill(bp.init_issuer_profile.isser_info.debt_position.other)
    log.action('Enter Other debt')
    await util.enterDate('//input[@id="debtPortionAsOf"]', bp.init_issuer_profile.isser_info.debt_asof)
    log.action('Enter Debt Portion as of')

    log.announce('DONE')

    // final steps
    log.action('Save draft')
    const save_draft_btn = page.locator('//button[@type="submit"]').nth(1)
    await bond.elememt(save_draft_btn).click()

    await bond.elememt('//div[@class="ant-modal-body"]//button[1]').click()
    await page.waitForTimeout(15000)

    log.action('Click back')
    await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button').click()
    await page.waitForTimeout(3000)

    // log.action('Delete bond')
    // await page.locator(`//td[@title="${bond_name}"]/parent::tr/td[16]/span/div/button[3]`).click()
    // log.action('Confitm delete bond')
    // await page.locator('//div[@class="ant-modal-confirm-btns"]/button[@class="ant-btn ant-btn-primary"][1]/span').click()

    await util.Logout()
  })

})