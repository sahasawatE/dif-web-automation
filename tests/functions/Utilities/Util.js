const { expect } = require('@playwright/test')
const log = require('./log')

class Util {
    #email = 'test.all.role@gmail.com'
    // #email = 'Testplaytorium002@gmail.com'
    #password = 'P@ssw0rd2'
    // #password = 'P@ssw0rd1'
    constructor(page) {
        this.page = page
    }

    async Login() {
        this.page.goto(URL.web('login'))
        log.announce('LOGIN')
        const login_title = '.login-form-container > .sub-container.first > .ant-typography.login-label'
        const title = await this.page.locator(login_title).innerHTML()
        expect(title).toBe('Login')
        await this.page.locator('//input[@id="email"]').fill(this.#email)
        log.action('Enter email')
        await this.page.locator('//input[@id="password"]').fill(this.#password)
        log.action('Enter password')
        await this.page.locator('//button[@type="submit"]/span').click()
        log.action('Click Login')
        this.page.waitForTimeout(2000)
        log.success('Login succeed')
    }

    async Logout(profile_btn = '//*[@id="root"]/div/section/section/header/div[2]/a', logout_btn = '//li[@class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child log-out"]/span') {
        log.announce('LOGOUT')
        // this.page.goto(URL.web('/bondteam'))
        await this.page.waitForTimeout(3000)
        await this.page.locator(profile_btn).click()
        log.action('Click Profile button')
        this.page.waitForTimeout(2000)
        await this.page.locator(logout_btn).click()
        log.action('Click Sign out')
        this.page.waitForTimeout(2000)
        log.success('Logout succeed')
    }

    async CreateBond(bond_name) {
        log.message('Create new Bond')
        await this.page.locator('//div[@class="search"]/div[1]/div[2]/div[1]/div[2]/button').click()
        await this.page.locator('//input[@id="name"]').fill(bond_name)
        await this.page.locator('//form/button[@type="submit"]').click()
        await this.page.waitForTimeout(3000)
        log.success('Create new bond succeed')
    }

    async reset(bond_name) {
        const [result_data, result_status] = await this.getResponseAsync(
            'search',
            "/bondProject/search?sortField=&sortField=createAt&sortDir=desc&size=10&page=1",
            [
                {
                    fill: {
                        selector: '//input[@placeholder="Search by bond project name"]',
                        data: bond_name
                    }
                },
                { click: this.page.locator('//button[@type="submit"]').nth(2) },
                { wait: 1.5 }
            ]
        )
        expect(result_status).toEqual(200)

        const result = result_data['users'].filter(r => r['name'] === bond_name)
        if (result.length) {
            log.action('Delete bond')
            await this.page.locator(`//td[@title="${result[0]['name']}"]/parent::tr/td[16]/span/div/button[3]`).click()
            log.action('Confitm delete bond')
            await this.page.locator('//div[@class="ant-modal-confirm-btns"]/button[@class="ant-btn ant-btn-primary"][1]/span').click()
        }

        await this.page.waitForTimeout(3000)
    }

    async getResponseAsync(name, endpoint = "", option = []) {
        var promises = []
        if (option) {
            option.forEach(async action => {
                if (action['fill']) {
                    log.action(`fill ${action['fill']['data']}`)
                    promises.push(await this.page.fill(action['fill']['selector'], action['fill']['data']))
                }
                if (action['click']) {
                    log.action('Click')
                    if (typeof action['click'] === 'string') promises.push(await this.page.click(action['click']))
                    else promises.push(await action['click'].click())
                }
                if (action['wait']) promises.push(await this.page.waitForTimeout(action['wait'] * 1000))
                if (action['log']) promises.push(console.log(action['log']))
            })
        }
        promises.push(this.page.waitForResponse(endpoint.includes('https://') ? endpoint : URL.api(endpoint)))
        promises.push(console.log(`[GET] ${name} api response`))

        const [return_value] = await Promise.all(promises)
        const return_value_json = await return_value.json()
        const return_value_status = await return_value.status()

        return [return_value_json, return_value_status]
    }

    async switcRole(select) {
        const dropdown_btn = '.ant-dropdown-trigger' //1
        const switch_btn = '//div[@class="ant-collapse-header"]/span' //0
        const role_menu = '//div[@class="ant-collapse-content-box"]/ul'

        await this.page.locator(dropdown_btn).nth(1).click()
        await this.page.locator(switch_btn).nth(0).click()
        if (select) {
            if (typeof select === 'number') {
                const menu_list = await this.page.$$eval(role_menu, items => {
                    let ml = []
                    for (let item of items) {
                        for (let i = 0; i < item.children.length; i++) {
                            const class_name = item.children.item(i).getAttribute('class')
                            const inner_text = item.children.item(i).innerText
                            ml.push({
                                class: class_name,
                                text: inner_text
                            })
                        }
                    }
                    return ml
                })

                const mi = '//div[@class="ant-collapse-content-box"]/ul/li[@role="menuitem"]'
                if (select >= 0 && select <= menu_list.length) {
                    await this.page.locator(mi).nth(select).click()
                }
            }
            else if (typeof select === 'string') {
                this.page.locator(`text=${select}`).click()
            }
        }
        await this.page.waitForTimeout(3000)
    }

    async onResponse(response, name = '') {
        const responseJSON = await response.json()
        const responseStatus = await response.status()
        log.get(`${getJSONKey(responseJSON)} from ${name} api response => status ${responseStatus}`)
        return { data: responseJSON, status: responseStatus }
    }

    async enterDate(locator, string_date) {
        let element
        if (typeof locator === 'string') element = this.page.locator(locator)
        else element = locator

        await element.click()
        await element.fill(string_date)
        await element.press('Enter')
        log.action('Insert date')
    }
}

const URL = {
    web: (endpoint = '') => {
        const url = 'https://ps220057-dev-env.playtorium.co.th/dif-web'
        // const url = 'https://ps220057-dev-env.playtorium.co.th/dif-web2'
        if (endpoint[0] === '/') return url + endpoint
        return url + "/" + endpoint
    },
    api: (endpoint = '') => {
        const url = 'https://ps220057-dev-env.playtorium.co.th/dif-api/api'
        // const url = 'https://ps220057-dev-env.playtorium.co.th/dif-api2/api'
        if (endpoint[0] === '/') return url + endpoint
        return url + "/" + endpoint
    }
}

function getJSONKey(data) {
    expect(data).not.toBeUndefined()
    expect(data).not.toBeNull()

    if (typeof data === 'object') return Object.keys(data)
}

module.exports = { Util, URL, getJSONKey }