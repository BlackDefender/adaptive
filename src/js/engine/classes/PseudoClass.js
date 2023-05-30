export default class PseudoClass {
    constructor (pseudoClassName) {
        this.selector = `:${pseudoClassName}`
        this.selectorRegExp = new RegExp(this.selector, 'g')
        this.substituteName = `item-${pseudoClassName}-state-class`
        this.substitute = `.${this.substituteName}`
    }

    static selectorToSubstitute (selector) {
        return `.item-${selector.replace(':', '')}-state-class`
    }
}
