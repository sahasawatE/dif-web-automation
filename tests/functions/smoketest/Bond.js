const log = require('../Utilities/log')

class Bond {
    constructor(page) {
        this.page = page

    }

    async #setElement(selector) {
        let elm
        if (typeof selector === 'string') {
            await this.page.locator(selector).scrollIntoViewIfNeeded()
            elm = this.page.locator(selector)
        }
        else {
            await selector.scrollIntoViewIfNeeded()
            elm = selector
        }

        return elm
    }

    elememt(selector) {
        return {
            force: {
                click: async () => {
                    const elm = await this.#setElement(selector)
                    await elm.click({ force: true })
                },
            },
            scrollToView: async () => {
                await this.#setElement(selector)
            },
            fill: async (input_data = '') => {
                const elm = await this.#setElement(selector)
                await elm.fill(input_data)
            },
            click: async () => {
                const elm = await this.#setElement(selector)
                await elm.click()
            },
            innerHTML: async () => {
                const elm = await this.#setElement(selector)
                const return_value = await elm.innerHTML()
                return return_value
            },
            innerText: async () => {
                const elm = await this.#setElement(selector)
                const return_value = await elm.innerText()
                return return_value
            },
            inputValue: async () => {
                const elm = await this.#setElement(selector)
                const return_value = await elm.inputValue()
                return return_value
            },
            press: async (key = "") => {
                const elm = await this.#setElement(selector)
                await elm.press(key)
            },
            list: async (attribute = "") => {
                let return_value
                if (attribute === "data-placeholder") {
                    return_value = await this.page.$$eval(selector, els => {
                        return Array.from(els, el => el.getAttribute('data-placeholder'))
                    })
                }
                else if (attribute === "class") {
                    return_value = await this.page.$$eval(selector, els => {
                        return Array.from(els, el => el.getAttribute('class'))
                    })
                }
                else if (attribute === "id") {
                    return_value = await this.page.$$eval(selector, els => {
                        return Array.from(els, el => el.getAttribute('id'))
                    })
                }
                else if (attribute === "innerHTML") {
                    return_value = await this.page.$$eval(selector, els => {
                        return Array.from(els, el => el.innerHTML)
                    })
                }
                else if (attribute === "innerText") {
                    return_value = await this.page.$$eval(selector, els => {
                        return Array.from(els, el => el.innerText)
                    })
                }
                else {
                    return_value = await this.page.$$eval(selector, els => {
                        return new Array(els.length)
                    })
                }
                return return_value
            },
            // scroll y
            Vscroll: async (first_item, target_item) => {
                if (selector) {
                    const elm = await this.#setElement(selector)
                    await elm.click()
                }

                let element
                if (typeof first_item === 'string') {
                    element = this.page.locator(first_item)
                }
                else {
                    element = first_item
                }
                const target = this.page.locator(target_item)
                let target_visible = await target.isVisible()
                await element.hover()
                while (!target_visible) {
                    log.error('not found => search again')
                    await this.page.mouse.wheel(0, 150)
                    await this.page.waitForTimeout(600)
                    target_visible = await target.isVisible()
                }
                if (target_visible) {
                    await target.click()
                }
            },
            isDisabled: async () => {
                const elm = await this.#setElement(selector)
                const return_value = await elm.isDisabled()
                return return_value
            }
        }
    }
}

module.exports = Bond