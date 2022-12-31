const { test, expect } = require('@playwright/test');
const log = require('../functions/Utilities/log')
const { Util, URL, getJSONKey } = require('../functions/Utilities/Util')
const bp = require('../functions/data/bond_project')
// const dateFormat = require("dateformat");
const Bond = require('../functions/smoketest/Bond');
// const schema = require('../functions/data/create_schema')

// let bond_name = 'local_testAutomation_69'
// let bond_name = 'auto_review_9'
let bond_name = 'git_testAutomation_7'
// let bond_name = 'docker_testAutomation_11'

let bond_id

test.describe('Smoketest | Bond - Bond Project', () => {

  test('Insert data into Issuer Info', async ({ page, context }) => {
    const util = new Util(page)
    const bond = new Bond(page)

    context.clearCookies()

    await util.Login()

    // switch role
    await util.switcRole(2)
    log.set('Change Role to Maker - Issuer')

    // go to BondProject page
    log.action('Go to Bond Project page')
    const [bp_res, bp_status] = await util.getResponseAsync('Bond Project', '/bondProject/search?sortField=&size=10&page=1', [
      { click: await bond.elememt(page.locator('//span[@class="ant-menu-title-content"]').nth(3)).click() },
      { click: await bond.elememt('//ul[@class="ant-menu ant-menu-sub ant-menu-inline"]/li[1]').click() }
    ])
    expect(bp_status).toEqual(200)
    bond_id = parseInt(bp_res['users'][0]['id']) + 1

    const bondproject_header = await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div[1]/div[1]/div/article').innerHTML()
    expect(bondproject_header).toBe('Bond Project')

    // await util.reset()

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
    await page.mouse.click(0, 600)
    await page.waitForTimeout(5000)

    await bond.elememt('//div[@id="derivertiveLicense"]//span[@class="ant-radio"]/input[@value="N"]').click()
    log.action('Click Radio button value = NO')

    const qles = await bond.elememt('//div[@class="tabCard"][2]//div[@class="se-wrapper"]/span').list('innerText')

    expect(qles.length).toEqual(bp.init_issuer_profile.isser_info.ql_editor_part_1.length)

    let qles_i = 0

    for (let qle of qles) {
      log.action(qle)

      const qle_editor = bond.elememt(`//div[@class="tabCard"][2]//div[@class="se-wrapper"]/span[text() = "${qle}"]/parent::div`)
      await qle_editor.click()
      await page.keyboard.type(bp.init_issuer_profile.isser_info.ql_editor_part_1[qles_i])
      qles_i++
      log.success('Insert data succeed')
    }
    await page.waitForTimeout(500)

    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[39]/div/a/span').click()
    log.action('Click Add')
    await bond.elememt('//input[@id="financialRatioTerm"]').click()
    log.action('Click Financial ratio team')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_team}"]`).click()
    log.action('Select Financial ratio team')
    await bond.elememt('//input[@id="financialRatioTermOther"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_team_other)
    log.action('Enter Financial ratio team other')
    await bond.elememt('//input[@id="comparison"]').click()
    log.action('Click Comparison')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.fiancial_convennant_info.comparison}"]`).click()
    log.action('Select Comparison')
    await bond.elememt('//input[@id="covenantRatioEndPeriod"]').click()
    log.action('Click Convenant ratio end period')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_end_period}"]`).click()
    log.action('Select Convenant ratio end period')
    await bond.elememt('//input[@id="companyReference"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.com_ref)
    log.action('Enter Company reference')
    await bond.elememt('//input[@id="consolidateReference"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.con_ref)
    log.action('Enter consolidate reference')
    await bond.elememt('//textarea[@id="covenantRatioFormula"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_formula)
    log.action('Enter Convenant ratio formula')
    await bond.elememt('//input[@id="monitorPeriod"]').click()
    log.action('Click Monitor period')
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.fiancial_convennant_info.monitor_period}"]`).click()
    log.action('Select Monitor period')
    await bond.elememt('//input[@id="covenantRatioOfIndustryAverage"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_indus_avg)
    log.action('Enter Convenant ratio of industry average')
    await bond.elememt('//input[@id="covenantRatioOfIssuerYearBeforeLatestYear"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_issue_ybly)
    log.action('Enter Convenant ratio of issuer year before latest year')
    await bond.elememt('//input[@id="covenantRatioOfIssuerLatestYear"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_ly)
    log.action('Enter Convenant ratio of issuer latest year')
    await bond.elememt('//input[@id="covenantRatioOfIssuerQuarter"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.ratio_iq)
    log.action('Enter Convenant ratio of issuer quarter')
    await bond.elememt('//div[@class="ant-modal-body"]//button[@class="ant-btn ant-btn-primary"]').click()
    log.action('Click Save')

    await util.enterDate('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[40]/div[1]/div/div/input', bp.init_issuer_profile.isser_info.fiancial_convennant_info.ybly)
    log.action('Enter year before latest year')
    await util.enterDate('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[15]/div[40]/div[2]/div/div/input', bp.init_issuer_profile.isser_info.fiancial_convennant_info.ly)
    log.action('Enter latest year')
    await bond.elememt('//input[@placeholder="Enter quarter (Q x-Month Year xxxx)"]').fill(bp.init_issuer_profile.isser_info.fiancial_convennant_info.q)
    log.action('Enter quarter')

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
    expect(key_fin.length).toEqual(bp.init_issuer_profile.isser_info.key_fin.latest_year.length)
    expect(key_fin.length).toEqual(bp.init_issuer_profile.isser_info.key_fin.year_before_latest_year.length)
    expect(key_fin.length).toEqual(bp.init_issuer_profile.isser_info.key_fin.quater.length)

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
    await bond.elememt('//*[text()[contains(.,"Auditor")]]/parent::div/a').click()
    await page.waitForTimeout(2000)
    await bond.elememt('//input[@id="auditorFirm"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.auditor_firm}"]`).click()
    log.success('Enter Auditor data')
    await bond.elememt('//div[@class="ant-modal-body"]//button[@class="ant-btn ant-btn-primary"]').click()
    await page.waitForTimeout(1000)

    //legal advisor
    log.action("Legal Advisor")
    await bond.elememt('//input[@id="legalAdvisorThName"]').fill(bp.init_issuer_profile.isser_info.legal_ad.name_th)
    log.action('Enter Legal Advisor thai name')
    await bond.elememt('//input[@id="legalAdvisorEnName"]').fill(bp.init_issuer_profile.isser_info.legal_ad.name_en)
    log.action('Enter Legal Advisor eng name')

    //scroll
    log.action('Click dropdown Legal Advisor nationality')
    await bond.elememt('//input[@id="legalAdvisorNationality"]').Vscroll('//div[@title="AFGHAN"]', `//div[@title="${bp.init_issuer_profile.isser_info.legal_ad.nation}"][@aria-selected="false"]`)
    log.success('Found Legal Advisor nationality')
    log.action('Select Legal Advisor nationality')
    await bond.elememt('//input[@id="legalAdvisorJrsID"]').fill(bp.init_issuer_profile.isser_info.legal_ad.id)
    log.action('Enter Legal Advisor ID')

    //scroll
    await bond.elememt('//input[@id="countryOfRegulationApplied"]').Vscroll('//div[@title="AFGHANISTAN"]', `//div[@title="${bp.init_issuer_profile.isser_info.legal_ad.reg_app}"]`)
    log.action('Click dropdown Country of Regulation Applied')
    log.success('Found Country of Regulation Applied')
    log.action('Select Country of Regulation Applied')
    log.success("Enter Legal Advisor")

    //part 2
    log.announce('PART 2 : Business Management')
    const qles2 = await bond.elememt('//div[@class="tabCard"][3]//div[@class="se-wrapper"]/span').list('innerText')

    let qle2_i = 0

    expect(qles2.length).toEqual(bp.init_issuer_profile.isser_info.ql_editor_part_2.length)

    for (let qle2 of qles2) {
      log.action(qle2)
      await bond.elememt(page.locator(`//div[@class="tabCard"][3]//div[@class="se-wrapper"]/span[text() = "${qle2}"]/parent::div`).nth(qle2_i)).click()
      await page.keyboard.type(bp.init_issuer_profile.isser_info.ql_editor_part_2[qle2_i])
      log.success('Insert data succeed')
    }
    await page.waitForTimeout(500)

    // log.action('Enter committee name')
    // await bond.elememt('//*[text()[contains(.,"Committee")]]/parent::div/a').click()
    // log.action('Click Add')
    // await bond.elememt('//input[@id="committeeName"]').click()
    // await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.committee.name}"]`).click()
    // log.action('Enter Committee name')
    // await page.locator('//button[@class="ant-btn ant-btn-primary"]').nth(1).click()
    // log.action('Click Save')
    await page.waitForTimeout(1000)
    await util.enterDate('//div[@class="tabCard"][3]/div[@class="list-panel"][1]//input', bp.init_issuer_profile.isser_info.committee.asof)
    log.action('Enter Committee Date')

    log.action('Enter controller information')
    await bond.elememt('//*[text()[contains(.,"Controller Information")]]/parent::div/a').click()
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
    log.action('Click Passport Issuing Country')
    await bond.elememt('//input[@id="controllerPassportIssuingCountry"]').Vscroll('//div[@title="Afghanistan"]', `//div[@title="${bp.init_issuer_profile.isser_info.controller_info.passport_issuing_country}"]`)
    log.success('Found Passport Issuing Country')
    log.action('Select Passport Issuing Country')
    await bond.elememt('//input[@id="controllerCardNumber"]').fill(bp.init_issuer_profile.isser_info.controller_info.card_no)
    log.action('Enter Card number')
    log.action('Click Nationality')
    await bond.elememt('//input[@id="controllerNationality"]').Vscroll('//div[@title="Afghan"]', `//div[@title="${bp.init_issuer_profile.isser_info.controller_info.nationality}"][@aria-selected="false"]`)
    log.success('Found Nationality')
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

    const qles3 = await bond.elememt('//div[@class="tabCard"][4]//div[@class="se-wrapper"]/span').list('innerText')

    let qle3_i = 0
    for (let qle of qles3) {
      log.action(qle)
      await bond.elememt(`//div[@class="tabCard"][4]//div[@class="se-wrapper"]/span[text() = "${qle}"]/parent::div`).click()
      await page.keyboard.type(bp.init_issuer_profile.isser_info.ql_editor_part_3[qle3_i])
      qle3_i++
      log.success('Insert data succeed')
    }
    await page.waitForTimeout(500)

    log.action('Click Accounting period')
    await bond.elememt('//*[@id="rc-tabs-1-panel-4"]/div/div[2]/div/form/div[1]/div[2]/div[17]/div[5]/div[2]/div/div/div/div[1]/div').Vscroll('//div[@label="January"]', `//div[@label="${bp.init_issuer_profile.isser_info.accounting_period[0]}"]`)
    log.success('Found June')
    log.action('Select June')
    await bond.elememt().Vscroll('//div[@label="June"]', `//div[@label="${bp.init_issuer_profile.isser_info.accounting_period[1]}"]`)
    log.success('Found December')
    log.action('Select December')
    await page.mouse.click(0, 600)
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
    await bond.elememt('text=Save Draft').click()
    await bond.elememt('//span[text()[contains(.,"Cooling Filing")]]').click()
    await bond.elememt('//span[text()[contains(.,"Effective Filing")]]').click()
    // const [res_save_draft_json, res_save_draft_status] = await util.getResponseAsync(
    //   'save draft',
    //   `/bondProject/${bond_id}/issuerProfile/issuerInfo/draft?state=1,2,3`,
    //   [
    //     { click: '//div[@class="ant-modal-body"]//button[1]' }
    //   ])
    // expect(res_save_draft_json['message']).toBe('success')
    // expect(res_save_draft_status).toBe(200)
    await bond.elememt('//div[@class="ant-modal-body"]//button[1]').click()
    await page.waitForTimeout(30000)

    log.action('Click back')
    await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button').click()
    await page.waitForTimeout(3000)

    // log.action('Delete bond')
    // await page.locator(`//td[@title="${bond_name}"]/parent::tr/td[16]/span/div/button[3]`).click()
    // log.action('Confitm delete bond')
    // await page.locator('//div[@class="ant-modal-confirm-btns"]/button[@class="ant-btn ant-btn-primary"][1]/span').click()

    await util.Logout()
  })

  test('Insert data into Authorized Signer', async ({ page, context }) => {
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
    const table_data = await util.getResponseAsync('table data', '/bondProject/search?sortField=&size=10&page=1')
    expect(table_data[1]).toEqual(200)

    const [result_data, result_status] = await util.getResponseAsync(
      'search',
      "/bondProject/search?sortField=&size=10&page=1",
      [
        {
          fill: {
            selector: '//input[@placeholder="Search by bond project name"]',
            data: bond_name
          }
        },
        { click: page.locator('//button[@type="submit"]').nth(2) },
        { wait: 1.5 }
      ]
    )
    expect(result_status).toEqual(200)
    const [result] = result_data['users'].filter(r => r['name'] === bond_name)
    expect(bond_name).toBe(result['name'])
    bond_id = result['id']

    await bond.elememt(`//td[@title="${result['name']}"]//a`).click()
    await bond.elememt(page.locator('//div[@class="ant-tabs-tab"]').nth(5)).click()
    await bond.elememt('//*[@id="AuthorizeSignerProcessOption"]/label[1]/span[1]').click()

    // Authorized Signer for Issuer Information
    const auth_signer_element = 'authorizedSignerIssuerForIssuerInfo'
    const auth_signer_issuer = bp.init_issuer_profile.authorized_signer.issuer_info

    await bond.elememt(page.locator('//div[@class="title"]/a').nth(0)).click()
    await bond.elememt(`//input[@id="${auth_signer_element}ThPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_signer_issuer.th.prefix}"]`).click()
    await bond.elememt(`//input[@id="${auth_signer_element}ThName"]`).fill(auth_signer_issuer.th.firstname)
    await bond.elememt(`//input[@id="${auth_signer_element}ThSurname"]`).fill(auth_signer_issuer.th.lastname)
    await bond.elememt(`//input[@id="${auth_signer_element}EnPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_signer_issuer.en.prefix}"]`).click()
    await bond.elememt(`//input[@id="${auth_signer_element}EnName"]`).fill(auth_signer_issuer.en.firstname)
    await bond.elememt(`//input[@id="${auth_signer_element}EnSurname"]`).fill(auth_signer_issuer.en.lastname)
    await bond.elememt(`//input[@id="${auth_signer_element}Nationality"]`).Vscroll('//div[@title="AFGHAN"]', `//div[@title="${auth_signer_issuer.nationality}"]`)
    await bond.elememt(`//input[@id="${auth_signer_element}TypeOfCard"]`).click()
    await bond.elememt(`//div[@title="${auth_signer_issuer.card_type}"]`).click()
    await bond.elememt(`//input[@id="${auth_signer_element}CardNumber"]`).fill(auth_signer_issuer.card_number)
    await bond.elememt(`//input[@id="${auth_signer_element}Position"]`).fill(auth_signer_issuer.position)
    await bond.elememt(`//input[@id="${auth_signer_element}Email"]`).fill(auth_signer_issuer.email)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    await bond.elememt(`//*[@id="${auth_signer_element}CompanyStampFlag"]/label[1]/span[1]`).click()
    // await bond.elememt(`//input[@id="${auth_signer_element}JuristicId"]`).Vscroll('//div[@title="BANGKOK BANK PUBLIC COMPANY LIMITED"]', `//div[@title="${auth_signer_issuer.juristic_name}"]`)

    await bond.elememt(page.locator('//div[@class="title"]/a').nth(1)).click()

    // Authorized Signer FA for Issuer
    const fa_element = 'authorizedSignerFAForIssuerInfo'
    const auth_signer_fa = bp.init_issuer_profile.authorized_signer.fa_for_isser_info

    await bond.elememt(`//input[@id="${fa_element}ThPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_signer_fa.th.prefix}"]`).click()
    await bond.elememt(`//input[@id="${fa_element}ThName"]`).fill(auth_signer_fa.th.firstname)
    await bond.elememt(`//input[@id="${fa_element}ThSurname"]`).fill(auth_signer_fa.th.lastname)
    await bond.elememt(`//input[@id="${fa_element}EnPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_signer_fa.en.prefix}"]`).click()
    await bond.elememt(`//input[@id="${fa_element}EnName"]`).fill(auth_signer_fa.en.firstname)
    await bond.elememt(`//input[@id="${fa_element}EnSurname"]`).fill(auth_signer_fa.en.lastname)
    await bond.elememt(`//input[@id="${fa_element}Nationality"]`).Vscroll('//div[@title="AFGHAN"]', `//div[@title="${auth_signer_fa.nationality}"]`)
    await bond.elememt(`//input[@id="${fa_element}TypeOfCard"]`).click()
    await bond.elememt(`//div[@title="${auth_signer_fa.card_type}"]`).click()
    await bond.elememt(`//input[@id="${fa_element}CardNumber"]`).fill(auth_signer_fa.card_number)
    await bond.elememt(`//input[@id="${fa_element}Position"]`).fill(auth_signer_fa.position)
    await bond.elememt(`//input[@id="${fa_element}Email"]`).fill(auth_signer_fa.email)
    await bond.elememt('//div[@class="se-wrapper"]').click()
    await page.keyboard.type(auth_signer_fa.additional_comment)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    await bond.elememt(`//*[@id="${fa_element}CompanyStampFlag"]/label[1]/span[1]`).click()
    // await bond.elememt(`//input[@id="${fa_element}JuristicId"]`).Vscroll('//div[@title="BANGKOK BANK PUBLIC COMPANY LIMITED"]', `//div[@title="${auth_signer_fa.juristic_name}"][@aria-selected="false"]`)

    await bond.elememt(page.locator('//div[@class="title"]/a').nth(2)).click()

    // Authorized Signer Issuer for Pricing and Other Information
    const other_element = 'authorizedSignerIssuerForPricingAndOtherInfo'
    const auth_other = bp.init_issuer_profile.authorized_signer.other_info

    await bond.elememt(`//input[@id="${other_element}ThPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_other.th.prefix}"]`).click()
    await bond.elememt(`//input[@id="${other_element}ThName"]`).fill(auth_other.th.firstname)
    await bond.elememt(`//input[@id="${other_element}ThSurname"]`).fill(auth_other.th.lastname)
    await bond.elememt(`//input[@id="${other_element}EnPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_other.en.prefix}"]`).click()
    await bond.elememt(`//input[@id="${other_element}EnName"]`).fill(auth_other.en.firstname)
    await bond.elememt(`//input[@id="${other_element}EnSurname"]`).fill(auth_other.en.lastname)
    await bond.elememt(`//input[@id="${other_element}Nationality"]`).Vscroll('//div[@title="AFGHAN"]', `//div[@title="${auth_other.nationality}"]`)
    await bond.elememt(`//input[@id="${other_element}TypeOfCard"]`).click()
    await bond.elememt(`//div[@title="${auth_other.card_type}"]`).click()
    await bond.elememt(`//input[@id="${other_element}CardNumber"]`).fill(auth_other.card_number)
    await bond.elememt(`//input[@id="${other_element}Position"]`).fill(auth_other.position)
    await bond.elememt(`//input[@id="${other_element}Email"]`).fill(auth_other.email)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    await bond.elememt('//*[@id="authorizedSignerIssuesrForPricingAndOtherInfoCompanyStampFlag"]/label[1]/span[1]').click()
    // await bond.elememt(`//input[@id="${other_element}JuristicId"]`).Vscroll('//div[@title="BANGKOK BANK PUBLIC COMPANY LIMITED"]', `//div[@title="${auth_other.juristic_name}"][@aria-selected="false"]`)
    await util.enterDate('//input[@id="dateOfInternalAuditAsessessmentPricingInfo"]', auth_other.date)

    await bond.elememt(page.locator('//div[@class="title"]/a').nth(3)).click()

    // Authorized Signer FA for Pricing and Other Information (if any)
    const fa_other_elememt = 'authorizedSignerFAForPricingAndOtherInfo'
    const auth_fa_other = bp.init_issuer_profile.authorized_signer.fa_other

    await bond.elememt(`//input[@id="${fa_other_elememt}ThPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_fa_other.th.prefix}"]`).click()
    await bond.elememt(`//input[@id="${fa_other_elememt}ThName"]`).fill(auth_fa_other.th.firstname)
    await bond.elememt(`//input[@id="${fa_other_elememt}ThSurname"]`).fill(auth_fa_other.th.lastname)
    await bond.elememt(`//input[@id="${fa_other_elememt}EnPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_fa_other.en.prefix}"]`).click()
    await bond.elememt(`//input[@id="${fa_other_elememt}EnName"]`).fill(auth_fa_other.en.firstname)
    await bond.elememt(`//input[@id="${fa_other_elememt}EnSurname"]`).fill(auth_fa_other.en.lastname)
    await bond.elememt(`//input[@id="${fa_other_elememt}Nationality"]`).Vscroll('//div[@title="AFGHAN"]', `//div[@title="${auth_fa_other.nationality}"]`)
    await bond.elememt(`//input[@id="${fa_other_elememt}TypeOfCard"]`).click()
    await bond.elememt(`//div[@title="${auth_fa_other.card_type}"]`).click()
    await bond.elememt(`//input[@id="${fa_other_elememt}CardNumber"]`).fill(auth_fa_other.card_number)
    await bond.elememt(`//input[@id="${fa_other_elememt}Position"]`).fill(auth_fa_other.position)
    await bond.elememt(`//input[@id="${fa_other_elememt}Email"]`).fill(auth_fa_other.email)
    await bond.elememt('//div[@class="se-wrapper"]').click()
    await page.keyboard.type(auth_fa_other.additional_comment)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    await bond.elememt(`//*[@id="${fa_other_elememt}CompanyStampFlag"]/label[1]/span[1]`).click()
    // await bond.elememt(`//input[@id="${fa_other_elememt}JuristicId"]`).Vscroll('//div[@title="BANGKOK BANK PUBLIC COMPANY LIMITED"]', `//div[@title="${auth_fa_other.juristic_name}"][@aria-selected="false"]`)

    await bond.elememt(page.locator('//div[@class="title"]/a').nth(4)).click()

    // Authorized Signer for Letter of Approval
    const approval_element = 'authorizedSignerForLetterOfApproval'
    const auth_approval = bp.init_issuer_profile.authorized_signer.approval

    await bond.elememt(`//input[@id="${approval_element}ThPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_approval.th.prefix}"]`).click()
    await bond.elememt(`//input[@id="${approval_element}ThName"]`).fill(auth_approval.th.firstname)
    await bond.elememt(`//input[@id="${approval_element}ThSurname"]`).fill(auth_approval.th.lastname)
    await bond.elememt(`//input[@id="${approval_element}EnPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_approval.en.prefix}"]`).click()
    await bond.elememt(`//input[@id="${approval_element}EnName"]`).fill(auth_approval.en.firstname)
    await bond.elememt(`//input[@id="${approval_element}EnSurname"]`).fill(auth_approval.en.lastname)
    await bond.elememt(`//input[@id="${approval_element}Nationality"]`).Vscroll('//div[@title="AFGHAN"]', `//div[@title="${auth_approval.nationality}"]`)
    await bond.elememt(`//input[@id="${approval_element}TypeOfCard"]`).click()
    await bond.elememt(`//div[@title="${auth_approval.card_type}"]`).click()
    await bond.elememt(`//input[@id="${approval_element}CardNumber"]`).fill(auth_approval.card_number)
    await bond.elememt(`//input[@id="${approval_element}Position"]`).fill(auth_approval.position)
    await bond.elememt(`//input[@id="${approval_element}Email"]`).fill(auth_approval.email)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    await bond.elememt(`//*[@id="${approval_element}companyStampFlag"]/label[1]/span[1]`).click()
    // await bond.elememt(`//input[@id="${approval_element}JuristicId"]`).Vscroll('//div[@title="BANGKOK BANK PUBLIC COMPANY LIMITED"]', `//div[@title="${auth_approval.juristic_name}"][@aria-selected="false"]`)

    await bond.elememt(page.locator('//div[@class="title"]/a').nth(5)).click()

    //  Authorized Signer FA for Letter of Approval (if any)
    const fa_approval_element = 'authorizedSignerFAForLetterOfApproval'
    const fa_auth_approval = bp.init_issuer_profile.authorized_signer.fa_approval

    await bond.elememt(`//input[@id="${fa_approval_element}ThPrefix"]`).click()
    await bond.elememt(`//div[@title="${fa_auth_approval.th.prefix}"]`).click()
    await bond.elememt(`//input[@id="${fa_approval_element}ThName"]`).fill(fa_auth_approval.th.firstname)
    await bond.elememt(`//input[@id="${fa_approval_element}ThSurname"]`).fill(fa_auth_approval.th.lastname)
    await bond.elememt(`//input[@id="${fa_approval_element}EnPrefix"]`).click()
    await bond.elememt(`//div[@title="${fa_auth_approval.en.prefix}"]`).click()
    await bond.elememt(`//input[@id="${fa_approval_element}EnName"]`).fill(fa_auth_approval.en.firstname)
    await bond.elememt(`//input[@id="${fa_approval_element}EnSurname"]`).fill(fa_auth_approval.en.lastname)
    await bond.elememt(`//input[@id="${fa_approval_element}Nationality"]`).Vscroll('//div[@title="AFGHAN"]', `//div[@title="${fa_auth_approval.nationality}"]`)
    await bond.elememt(`//input[@id="${fa_approval_element}TypeOfCard"]`).click()
    await bond.elememt(`//div[@title="${fa_auth_approval.card_type}"]`).click()
    await bond.elememt(`//input[@id="${fa_approval_element}CardNumber"]`).fill(fa_auth_approval.card_number)
    await bond.elememt(`//input[@id="${fa_approval_element}Position"]`).fill(fa_auth_approval.position)
    await bond.elememt(`//input[@id="${fa_approval_element}Email"]`).fill(fa_auth_approval.email)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    await bond.elememt(`//*[@id="${fa_approval_element}CompanyStampFlag"]/label[1]/span[1]`).click()
    // await bond.elememt('//input[@id="authorizedSignerFAForLetterOfApprovalJuristicId"]').Vscroll('//div[@title="BANGKOK BANK PUBLIC COMPANY LIMITED"]', `//div[@title="${fa_auth_approval.juristic_name}"][@aria-selected="false"]`)

    await bond.elememt(page.locator('//div[@class="title"]/a').nth(6)).click()

    // Authorized Signer Issuer for Post Sale Report
    const post_sale_report_element = 'authorizedSignerIssuerForPostSaleReport'
    const auth_post_sale_repost = bp.init_issuer_profile.authorized_signer.post_sale_report.issuer

    await bond.elememt(`//input[@id="${post_sale_report_element}ThPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_post_sale_repost.th.prefix}"]`).click()
    await bond.elememt(`//input[@id="${post_sale_report_element}ThName"]`).fill(auth_post_sale_repost.th.firstname)
    await bond.elememt(`//input[@id="${post_sale_report_element}ThSurname"]`).fill(auth_post_sale_repost.th.lastname)
    await bond.elememt(`//input[@id="${post_sale_report_element}EnPrefix"]`).click()
    await bond.elememt(`//div[@title="${auth_post_sale_repost.en.prefix}"]`).click()
    await bond.elememt(`//input[@id="${post_sale_report_element}EnName"]`).fill(auth_post_sale_repost.en.firstname)
    await bond.elememt(`//input[@id="${post_sale_report_element}EnSurname"]`).fill(auth_post_sale_repost.en.lastname)
    await bond.elememt(`//input[@id="${post_sale_report_element}Nationality"]`).Vscroll('//div[@title="AFGHAN"]', `//div[@title="${auth_post_sale_repost.nationality}"]`)
    await bond.elememt(`//input[@id="${post_sale_report_element}TypeOfCard"]`).click()
    await bond.elememt(`//div[@title="${auth_post_sale_repost.card_type}"]`).click()
    await bond.elememt(`//input[@id="${post_sale_report_element}CardNumber"]`).fill(auth_post_sale_repost.card_number)
    await bond.elememt(`//input[@id="${post_sale_report_element}Position"]`).fill(auth_post_sale_repost.position)
    await bond.elememt(`//input[@id="${post_sale_report_element}Email"]`).fill(auth_post_sale_repost.email)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    log.announce('DONE')

    log.action('Save draft')
    await bond.elememt('text=Save Draft').click()
    await bond.elememt('//span[text()[contains(.,"Cooling Filing")]]').click()
    await bond.elememt('//span[text()[contains(.,"Effective Filing")]]').click()
    await bond.elememt('//div[@class="ant-modal-body"]//button[1]').click()
    await page.waitForTimeout(6000)
    // const [res_save_draft_json, res_save_draft_status] = await util.getResponseAsync(
    //   'save draft',
    //   `/bondProject/${bond_id}/issuerProfile/issuerInfo/draft?state=1`,
    //   [
    //     { click: 'text=Save Draft' },
    //     { click: '//span[text()[contains(.,"Cooling Filing")]]' },
    //     { click: '//span[text()[contains(.,"Effective Filing")]]' },
    //     { click: '//div[@class="ant-modal-body"]//button[1]' }
    //   ])
    // expect(res_save_draft_json['message']).toBe('success')
    // expect(res_save_draft_status).toBe(200)

    log.action('Click back')
    await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button').click()
    await page.waitForTimeout(3000)

    await util.Logout()
  })

  test('Insert data into Selling info', async ({ page, context }) => {
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
    const table_data = await util.getResponseAsync('table data', '/bondProject/search?sortField=&size=10&page=1')
    expect(table_data[1]).toEqual(200)

    const [search_result_data, search_result_status] = await util.getResponseAsync(
      'search',
      "/bondProject/search?sortField=&size=10&page=1",
      [
        {
          fill: {
            selector: '//input[@placeholder="Search by bond project name"]',
            data: bond_name
          }
        },
        { click: page.locator('//button[@type="submit"]').nth(2) },
        { wait: 1.5 }
      ]
    )
    expect(search_result_status).toEqual(200)
    const [result] = search_result_data['users'].filter(r => r['name'] === bond_name)
    expect(bond_name).toBe(result['name'])

    await bond.elememt(`//td[@title="${result['name']}"]//a`).click()
    await bond.elememt('text=Selling Info').click()
    // await bond.elememt('//*[@id="AuthorizeSignerProcessOption"]/label[1]/span[1]').click()
    await page.waitForTimeout(12000)

    // const qles = await bond.elememt('//div[@class="se-wrapper"]/span').list('innerText')
    const qles = await page.$$eval('//span[@class="se-placeholder"]', els => {
      return Array.from(els, el => el.innerText)
    })
    // console.log(qles)
    expect(qles.length).toEqual(bp.init_issuer_profile.selling_info.ql_editor.length)

    let qle_index = 0
    for (let qle of qles) {
      let qle_editor
      if (qle_index === 8) {
        qle_editor = bond.elememt("div:nth-child(18) > div > .sun-editor-container > .ant-row > .ant-col > .ant-form-item-control-input > .ant-form-item-control-input-content > .sun-text-editor > .sun-editor > .se-container > .se-wrapper >> nth=0")
      }
      else if (qle_index === 23) {
        qle_editor = bond.elememt("div:nth-child(26) > .ant-col > .sun-editor-container > .sun-text-editor > .sun-editor > .se-container > .se-wrapper")
      }
      else {
        qle_editor = bond.elememt(`//div[@class="se-wrapper"]/span[text() = "${qle}"]/parent::div`)
      }
      await qle_editor.click()
      await page.keyboard.type(bp.init_issuer_profile.selling_info.ql_editor[qle_index])
      qle_index++
    }
    await page.waitForTimeout(500)

    // bone information
    await bond.elememt('//input[@id="sellingValuePerUnit"]').fill(bp.init_issuer_profile.selling_info.tc.bond_info.selling_value)
    await bond.elememt('//input[@id="totalSellingUnitCapMax"]').fill(bp.init_issuer_profile.selling_info.tc.bond_info.total_selling_value)
    await bond.elememt('//input[@id="greenshoeTotalUnit"]').fill(bp.init_issuer_profile.selling_info.tc.bond_info.greenshoe_totle_unit)
    // await bond.elememt('//input[@id="totalSellingUnitIncludingGreenshoe"]').fill(bp.init_issuer_profile.selling_info.tc.bond_info.total_selling_unit)
    await util.enterDate('//input[@id="tradeRegistrationDate"]', bp.init_issuer_profile.selling_info.tc.trade_reg_date)

    await bond.elememt('//span[text() = "Collateral"]/parent::div/a').click()
    await bond.elememt('//input[@id="collateralType"]').Vscroll('//div[@title="Movable and Immovable Property"]', `//div[@title="${bp.init_issuer_profile.selling_info.tc.collateral.type}"][@aria-selected="false"]`)
    await bond.elememt('//div[@class="se-wrapper"]/span[text() = "Enter collateral information"]/parent::div').click()
    await page.keyboard.type(bp.init_issuer_profile.selling_info.tc.collateral.info)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    // financial advisor
    await bond.elememt('//span[text() = "Financial Advisor"]/parent::div/a').click()
    await bond.elememt('//input[@id="financialAdvisor"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.selling_info.tc.financial_ad.fin_ad}"][@aria-selected="false"]`).click()
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    await bond.elememt('//input[@id="bondRepresentative"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.selling_info.tc.bond_represent.bond}"][@aria-selected="false"]`).click()

    // issuer service underwriter list
    await bond.elememt('//span[text() = "Issuer Service Underwriter List (Max 15)"]/parent::div/a').click()
    await bond.elememt('//input[@id="issuerServiceUnderwriterAssigned"]').Vscroll('//div[@title="B.E.S. COMPANY LIMITED"]', `//div[@title="${bp.init_issuer_profile.selling_info.issuer_service_underwriter.list.assigned}"][@aria-selected="false"]`)
    await bond.elememt('//div[@class="se-wrapper"]/span[text() = "Enter issuer service underwriter assigned address"]/parent::div').click()
    await page.keyboard.type(bp.init_issuer_profile.selling_info.issuer_service_underwriter.list.address)
    await bond.elememt('//input[@id="issuerServiceUnderwriterTelephone"]').fill(bp.init_issuer_profile.selling_info.issuer_service_underwriter.list.tel)
    await bond.elememt('//div[@id="conflictOfInterestIssuerAndSellingAgent"]//input[@type="radio"][@value="Y"]').click()
    await bond.elememt('//div[@class="se-wrapper"]/span[text() = "Enter conflict of interest issuer and selling agent detail"]/parent::div').click()
    await page.keyboard.type(bp.init_issuer_profile.selling_info.issuer_service_underwriter.list.conflict_detail)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    // dealer
    await bond.elememt('//span[text() = "Dealer"]/parent::div/a').click()
    await bond.elememt('//input[@id="dealer"]').Vscroll('//div[@title="B.E.S. COMPANY LIMITED"]', `//div[@title="${bp.init_issuer_profile.selling_info.issuer_service_underwriter.dealer.name}"][@aria-selected="false"]`)
    await bond.elememt('//div[@id="conflictOfInterestDealer"]//input[@type="radio"][@value="N"]').click()
    await bond.elememt('//div[@class="se-wrapper"]/span[text() = "Enter conflict of interest dealer detail"]/parent::div').click()
    await page.keyboard.type(bp.init_issuer_profile.selling_info.issuer_service_underwriter.dealer.conflict_detail)
    await bond.elememt('//button[@class="ant-btn ant-btn-primary"]').click()

    // Transfer Restriction Detail
    await bond.elememt('//input[@id="transferRestrictionDetail"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.selling_info.transfer_rest_detail}"]`).click()

    await bond.elememt('//input[@id="coordinatorName"]').fill(bp.init_issuer_profile.selling_info.coordinator.name)
    await bond.elememt('//input[@id="coordinatorPhone"]').fill(bp.init_issuer_profile.selling_info.coordinator.tel)
    await bond.elememt('//input[@id="coordinatorMail"]').fill(bp.init_issuer_profile.selling_info.coordinator.email)
    await bond.elememt('//input[@id="coordinatorPosition"]').fill(bp.init_issuer_profile.selling_info.coordinator.position)
    await bond.elememt('//input[@id="coordinatorType"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.selling_info.coordinator.type}"][@aria-selected="false"]`).click()

    // Address on Invoice
    await bond.elememt('//input[@id="officeSequenceOnInvoice"]').fill(bp.init_issuer_profile.selling_info.address_and_invoice.code)
    await bond.elememt('//input[@id="officeTypeOnInvoice"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.selling_info.address_and_invoice.office}"][@aria-selected="false"]`).click()
    await bond.elememt('//input[@id="addressNameThOnInvoice"]').click()
    await page.keyboard.press('Shift+A')
    await page.keyboard.press('Backspace')
    await bond.elememt('//input[@id="addressNameThOnInvoice"]').fill(bp.init_issuer_profile.selling_info.address_and_invoice.address.th)
    await bond.elememt('//input[@id="addressNameEnOnInvoice"]').click()
    await page.keyboard.press('Shift+A')
    await page.keyboard.press('Backspace')
    await bond.elememt('//input[@id="addressNameEnOnInvoice"]').fill(bp.init_issuer_profile.selling_info.address_and_invoice.address.en)
    await bond.elememt('//input[@id="telephoneOnInvoice"]').click()
    await page.keyboard.press('Shift+A')
    await page.keyboard.press('Backspace')
    await bond.elememt('//input[@id="telephoneOnInvoice"]').fill(bp.init_issuer_profile.selling_info.address_and_invoice.invoice.tel)
    await bond.elememt('//input[@id="emailOnInvoice"]').fill(bp.init_issuer_profile.selling_info.address_and_invoice.invoice.email)
    await bond.elememt('//input[@id="taxIDOnInvoice"]').fill(bp.init_issuer_profile.selling_info.address_and_invoice.invoice.tex_id)

    log.announce('DONE')

    // final steps
    log.action('Save draft')
    await bond.elememt('//div[@class="ant-card-body"]/button[@type="submit"]').click()
    await page.waitForTimeout(2000)
    await bond.elememt('//span[text()[contains(.,"Cooling Filing")]]').click()
    await bond.elememt('//span[text()[contains(.,"Effective Filing")]]').click()
    await bond.elememt('//div[@class="ant-modal-body"]//button[1]').click()
    await page.waitForTimeout(6000)

    log.action('Click back')
    await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button').click()
    await page.waitForTimeout(3000)

    await util.Logout()
  })

  test.skip('test', async ({ page, context }) => {
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
    const table_data = await util.getResponseAsync('table data', '/bondProject/search?sortField=&size=10&page=1')
    expect(table_data[1]).toEqual(200)

    const [search_result_data, search_result_status] = await util.getResponseAsync(
      'search',
      "/bondProject/search?sortField=&size=10&page=1",
      [
        {
          fill: {
            selector: '//input[@placeholder="Search by bond project name"]',
            data: bond_name
          }
        },
        { click: page.locator('//button[@type="submit"]').nth(2) },
        { wait: 1.5 }
      ]
    )
    expect(search_result_status).toEqual(200)
    const [result] = search_result_data['users'].filter(r => r['name'] === bond_name)
    expect(bond_name).toBe(result['name'])
    await bond.elememt(`//td[@title="${result['name']}"]//a`).click()
    await bond.elememt('//div[@class="ant-tabs-tab"][3]').click()

    log.action('Auditor')
    await bond.elememt('//*[text()[contains(.,"Auditor")]]/parent::div/a').click()
    await page.waitForTimeout(5000)
    await bond.elememt('//input[@id="auditorFirm"]').click()
    await bond.elememt(`//div[@title="${bp.init_issuer_profile.isser_info.auditor_firm}"]`).click()
    log.success('Enter Auditor data')
    await bond.elememt('//div[@class="ant-modal-body"]//button[@class="ant-btn ant-btn-primary"]').click()

    log.action('Click back')
    await bond.elememt('//*[@id="root"]/div/section/section/main/div/div/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/button').click()
    await page.waitForTimeout(3000)

    await util.Logout()
  })
})