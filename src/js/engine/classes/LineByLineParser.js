import StyleNode from './StyleNode'
import TextNode from './TextNode'
import StyleProperty from './StyleProperty'
import Settings from './Settings'
import MediaNode from './MediaNode'
import PseudoStyleNode from './PseudoStyleNode'

export default class LineByLineParser {
    constructor (scss) {
        this.scss = scss
        this.allCSSProperties = this.constructor.getAllCSSProperties()
    }

    static getAllCSSProperties () {
        return Object
            .keys(document.createElement('div').style)
            .map(cssProperty => cssProperty.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
    }

    prepareSCSSForParsing () {
        let dataString = this.scss
        // Доставляем закрывающие скобки если надо
        const openBraketsCount = dataString.match(/{/g).length
        const closeBraketsCount = dataString.match(/}/g).length
        if (openBraketsCount > closeBraketsCount) {
            const diff = openBraketsCount - closeBraketsCount
            dataString += `\n}`.repeat(diff)
        }
        // Удаляем комментарии, однострочные правила разносим на разные строки, разбиваем на строки, обрезаем строки и удаляем пустые
        const commentRegExp = /\/\*[\s\S]*?\*\/|\/\/.*$/gm
        const singleLineStyleRule = /^([^{}\n]+){([^{}\n]*)}$/gm
        const dataArray = dataString
            .replace(commentRegExp, '')
            .replace(singleLineStyleRule, '$1{\n$2\n}')
            .split('\n')
            .map(str => str.trim())
            .filter(str => str !== '')
        // Убираем медиазапрос если он есть
        if (dataArray[0].includes('@media')) {
            dataArray.shift()
            dataArray.pop()
        }
        return dataArray
    }

    parse () {
        const selectorStartSymbols = ['#', '.', '&']
        const textStartSymbols = ['@', '$']

        const data = this.prepareSCSSForParsing()

        let currentNode

        const createStyleNode = dataItem => {
            if (dataItem.charAt(dataItem.length - 1) === ',') {
                return createStyleNode(dataItem + data.shift())
            } else {
                return new StyleNode(dataItem, currentNode)
            }
        }

        const parseDataItem = (dataItem) => {
            if (dataItem === undefined) return
            if (dataItem === '}') {
                currentNode = currentNode.parentNode
                return
            }
            if (selectorStartSymbols.includes(dataItem.charAt(0))) {
                const node = createStyleNode(dataItem)
                currentNode.appendChild(node)
                currentNode = node
                return
            }
            if (textStartSymbols.includes(dataItem.charAt(0))) {
                currentNode.appendProperty(new TextNode(dataItem))
                return
            }
            /* if(dataItem.charAt(0) === '&'){} */
            if (dataItem.includes(':') && this.allCSSProperties.includes(dataItem.split(':')[0].trim())) {
                currentNode.appendProperty(new StyleProperty(dataItem))
            } else {
                const node = createStyleNode(dataItem)
                currentNode.appendChild(node)
                currentNode = node
            }
        }

        const parseData = () => {
            data.forEach(item => parseDataItem(item))
        }

        const settings = Settings.getInstance()
        if (settings.wrapIntoMedia) {
            currentNode = new MediaNode(settings.fromWidth, settings.toWidth)
            parseData()
            return currentNode
        } else {
            currentNode = new PseudoStyleNode()
            parseData()
            return currentNode
        }
    }
}
