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
        log.message('Login succeed')
    }

    async Logout() {
        log._log('================= LOGOUT =================')
        this.page.goto(URL.web('/bondteam'))
        const profile_btn = '//*[@id="root"]/div/section/section/header/div[2]/a/span[1]'
        const logout_btn = 'ul.ant-dropdown-menu > li:nth-child(4)'
        await this.page.locator(profile_btn).click()
        log.action('Click Profile button')
        this.page.waitForTimeout(1000)
        await this.page.locator(logout_btn).click()
        log.action('Click Sign out')
        this.page.waitForTimeout(2000)
        log.message('Logout succeed')
    }

    async onResponse(response, name = '') {
        const responseJSON = await response.json()
        const responseStatus = await response.status()
        log.get(`${getJSONKey(responseJSON)} from ${name} api response => status ${responseStatus}`)
        return { data: responseJSON, status: responseStatus }
    }
}

const URL = {
    web: (endpoint = '') => {
        const url = 'https://ps220057-dev-env.playtorium.co.th/dif-web2'
        if (endpoint[0] === '/') return url + endpoint
        return url + "/" + endpoint
    },
    api: (endpoint = '') => {
        const url = 'https://ps220057-dev-env.playtorium.co.th/dif-api2'
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