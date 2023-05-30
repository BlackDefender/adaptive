import PseudoClass from './PseudoClass'

let instanceId = Symbol('instanceId')
let instanceSecurityKey = Symbol('instanceSecurityKey')

export default class PseudoClasses {
    constructor (securityKey) {
        if (securityKey !== instanceSecurityKey) throw new Error('Instantiation failed: use Settings.getInstance() instead of new.')

        this.pseudoClassNames = ['hover', 'focus']
        this.list = this.pseudoClassNames.map(pseudoClassName => new PseudoClass(pseudoClassName))
        this.pseudoClassesToSubstitutesReplacementRegExp = new RegExp(this.pseudoClassNames.map(item => `:${item}`).join('|'), 'g')
    }

    static getInstance () {
        if (!this[instanceId]) {
            this[instanceId] = new PseudoClasses(instanceSecurityKey)
        }
        return this[instanceId]
    }

    replacePseudoClassesToSubstitutes (selector) {
        return selector.replace(this.pseudoClassesToSubstitutesReplacementRegExp, pseudoClassSelector => PseudoClass.selectorToSubstitute(pseudoClassSelector))
    }
}
