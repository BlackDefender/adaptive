import Settings from './Settings'
import NodeSelector from './NodeSelector'
import BrowserStyles from './BrowserStyles'
import StyleProperty from './StyleProperty'
import Utils from './Utils'

export default class StyleNode {
    constructor (selector, parentNode = null) {
        this.selector = selector.replace('{', '')
            .split(',')
            .map(item => item.trim())
        this.childNodes = []
        this.properties = []
        this.parentNode = parentNode
        this._levelComputingStartValue = 0
    }

    appendChild (node) {
        this.childNodes.push(node)
    }

    removeChild (node) {
        node.parentNode = null
        this.childNodes.splice(this.childNodes.indexOf(node), 1)
    }

    appendProperty (property) {
        this.properties.push(property)
    }

    shake () {
        this.properties = this.properties.filter(property => property.saveOnShake)
        for (let i = this.childNodes.length - 1; i >= 0; --i) {
            this.childNodes[i].shake()
        }
        if (this.childNodes.length === 0 && this.properties.length === 0 && this.parentNode) {
            this.parentNode.removeChild(this)
        }
    }

    get hasStyleProperties () {
        return this.properties.length > 0
    }

    static indent (level) {
        return Settings.getInstance().indentLevel(level)
    }

    get _nodeIndent () {
        return Settings.getInstance().indentLevel(this._level)
    }

    get _nodeContentIndent () {
        return Settings.getInstance().indentLevel(this._level + 1)
    }

    get _level () {
        return (function countNodeLevel (node, level) {
            return (node.parentNode === null) ? level : countNodeLevel(node.parentNode, ++level)
        })(this, this._levelComputingStartValue)
    }

    get fullSelector () {
        return this.constructor._fullSelector(this).join(',').trim()
    }

    static _prepareFullSelectorItem (selector) {
        return selector.map(item => item.charAt(0) === '&' ? item.substring(1) : ' ' + item)
    }

    static _fullSelector (treeItem) {
        if (treeItem.parentNode && treeItem.parentNode.constructor === StyleNode) {
            return this._multipleSelectors(this._fullSelector(treeItem.parentNode), this._prepareFullSelectorItem(treeItem.selector))
        }
        if (Settings.getInstance().baseSelector) {
            return this._multipleSelectors([Settings.getInstance().baseSelector], this._prepareFullSelectorItem(treeItem.selector))
        }
        return this._prepareFullSelectorItem(treeItem.selector)
    }

    static _multipleSelectors (s1, s2) {
        const res = []
        for (let i = 0; i < s1.length; ++i) {
            for (let j = 0; j < s2.length; ++j) {
                res.push(s1[i] + s2[j])
            }
        }
        return res
    }

    getFullSelectorObject () {
        let selector = this.fullSelector
        let pseudoElement = null
        if (selector.includes(':before') || selector.includes(':after')) {
            pseudoElement = selector.includes(':before') ? ':before' : ':after'
            selector = selector.substring(0, selector.indexOf(pseudoElement))
            if (selector.charAt(selector.length - 1) === ':') {
                selector = selector.substring(0, selector.length - 1)
            }
        }
        return new NodeSelector(selector, pseudoElement)
    }

    _stylesToLockString () {
        return this.properties.reduce((text, property) => {
            return `${text}\n${this._nodeContentIndent}${property.toLockString()}`
        }, '')
    }

    _childNodesToLockString () {
        return this.childNodes.reduce((text, node) => {
            return `${text}\n${this._nodeContentIndent}${node.toLockString()}`
        }, '')
    }

    toLockString () {
        return `${this.selector} {${this._stylesToLockString()}${this._childNodesToLockString()}\n${this._nodeIndent}}`
    }

    _stylesToUnlockString () {
        return this.properties.reduce((text, property) => {
            const propertyUnlock = property.toUnlockString()
            return propertyUnlock ? `${text}\n${this._nodeContentIndent}${propertyUnlock}` : text
        }, '')
    }

    _childNodesToUnlockString () {
        return this.childNodes.reduce((text, node) => {
            return `${text}\n${this._nodeContentIndent}${node.toUnlockString()}`
        }, '')
    }

    toUnlockString () {
        return `${this.selector} {${this._stylesToUnlockString()}${this._childNodesToUnlockString()}\n${this._nodeIndent}}`
    }

    addCurrentStyleValues () {
        if (this.hasStyleProperties) {
            const browserStyles = BrowserStyles.getInstance()
            const fullSelectorObject = this.getFullSelectorObject()

            const stylesheetProperties = browserStyles.getPropertiesFromStylesheets(this.fullSelector)
            const elementProperties = browserStyles.getPropertiesFromElement(fullSelectorObject)
            const computedProperties = browserStyles.getComputedElementProperties(fullSelectorObject)

            const getNewPropertyValue = property => {
                const propertyName = Utils.toCamelCase(property.name)
                return {
                    element: elementProperties[propertyName],
                    stylesheet: stylesheetProperties[propertyName],
                    computed: computedProperties[propertyName]
                }
            }

            this.properties.forEach(property => {
                if (property.constructor === StyleProperty) {
                    property.addNewValue(getNewPropertyValue(property))
                }
            })
        }
        if (this.childNodes) {
            this.childNodes
                .filter(node => node instanceof StyleNode)
                .forEach(node => node.addCurrentStyleValues())
        }
    }
}
