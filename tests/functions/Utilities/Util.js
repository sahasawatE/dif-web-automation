const { expect } = require('@playwright/test')
const log = require('./log')

class Util {
    #email = 'Testplaytorium002@gmail.com'
    #password = 'P@ssw0rd'
    constructor(page) {
        this.page = page
    }

    async Login() {
        this.page.goto(URL.web('login'))
        log._log('================= LOGIN =================')
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

    async Logout() {
        log._log('================= LOGOUT =================')
        // this.page.goto(URL.web('/bondteam'))
        await this.page.waitForTimeout(3000)
        const profile_btn = '//*[@id="root"]/div/section/section/header/div[2]/a'
        const logout_btn = '//li[@class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child log-out"]/span'
        await this.page.locator(profile_btn).click()
        log.action('Click Profile button')
        this.page.waitForTimeout(2000)
        await this.page.locator(logout_btn).click()
        log.action('Click Sign out')
        this.page.waitForTimeout(2000)
        log.success('Logout succeed')
    }

    async switcRole(select = 0) {
        const dropdown_btn = '.ant-dropdown-trigger' //1
        const switch_btn = '//div[@class="ant-collapse-header"]/span' //0
        const role_menu = '//div[@class="ant-collapse-content-box"]/ul'

        await this.page.locator(dropdown_btn).nth(1).click()
        await this.page.locator(switch_btn).nth(0).click()
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

        if (select) {
            const mi = '//div[@class="ant-collapse-content-box"]/ul/li[@role="menuitem"]'
            if (select >= 0 && select <= menu_list.length) {
                await this.page.locator(mi).nth(select).click()
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
        await locator.click()
        await locator.fill(string_date)
        await locator.press('Enter')
        log.action('Insert date')
    }
}

const URL = {
    web: (endpoint = '') => {
        const url = 'https://ps220057-dev-env.playtorium.co.th/dif-web'
        if (endpoint[0] === '/') return url + endpoint
        return url + "/" + endpoint
    },
    api: (endpoint = '') => {
        const url = 'https://ps220057-dev-env.playtorium.co.th/dif-api'
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