let instanceId = Symbol('instanceId')
let instanceSecurityKey = Symbol('instanceSecurityKey')

export default class Settings {
    constructor (securityKey) {
        if (securityKey !== instanceSecurityKey) throw new Error('Use .getInstance() instead of new!')
    }

    setSettings (data) {
        Object.assign(this, data)
    }

    static getInstance () {
        if (!this[instanceId]) {
            this[instanceId] = new this(instanceSecurityKey)
        }
        return this[instanceId]
    }

    get indent () {
        return ' '.repeat(this.indentSize)
    }

    indentLevel (level) {
        return this.indent.repeat(level)
    }
}
