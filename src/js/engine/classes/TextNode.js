export default class TextNode {
    constructor (data) {
        this.data = data
    }

    addNewValue () {
    }

    toString () {
        return this.data
    }

    toLockString () {
        return this.data
    }

    toUnlockString () {
        return this.data
    }

    get saveOnShake () {
        return false
    }
}
