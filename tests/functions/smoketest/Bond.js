const log = require('../Utilities/log')

class Bond {
    constructor(page) {
        this.page = page

    }

    print() {
        log._log('bond')
    }
}

module.exports = Bond