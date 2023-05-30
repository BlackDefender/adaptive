const instanceId = Symbol('instanceId')
const instanceSecurityKey = Symbol('instanceSecurityKey')

export default class Logger {
    constructor (securityKey) {
        if (securityKey !== instanceSecurityKey) throw new Error('Use .getInstance instead of new!')
        this.logs = []
    }

    static getInstance () {
        if (!this[instanceId]) {
            this[instanceId] = new this(instanceSecurityKey)
        }
        return this[instanceId]
    }

    log (message) {
        this.logs.push(message)
    }

    clear () {
        this.logs = []
    }

    getLogs () {
        return this.logs
    }

    getLogsFormatted () {
        return this.logs
            .map(item => `<div class="log-message">${item}</div>`)
            .join('')
    }
}
