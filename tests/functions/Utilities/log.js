module.exports = {
    get: (_message) => {
        return console.log(`[GET] - ${_message}`)
    },
    set: (_message) => {
        return console.log(`[SET] - ${_message}`)
    },
    action: (_message) => {
        return console.log(`🤜 ${_message}`)
    },
    message: (_message) => {
        return console.log(`💬 - ${_message}`)
    },
    error: (_message) => {
        return console.error(`❗️ - ${_message}`)
    },
    success: (_message) => {
        return console.log(`✅ - ${_message}`)
    },
    _log: (_message) => {
        return console.log(_message)
    },
    announce: (_message) => {
        return console.log('===================== ' + _message + ' =====================')
    }
}