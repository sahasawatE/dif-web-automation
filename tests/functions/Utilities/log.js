module.exports = {
    get: (_message) => {
        return console.log(`[GET] ${_message}`)
    },
    set: (_message) => {
        return console.log(`[SET] ${_message}`)
    },
    action: (_message) => {
        return console.log(`[ACTION] ${_message}`)
    },
    message: (_message) => {
        return console.log(`[MESSAGE] ${_message}`)
    },
    _log: (_message) => {
        return console.log(_message)
    }
}