import StyleNode from './StyleNode'
import Settings from './Settings'

export default class MediaNode extends StyleNode {
    constructor (fromWidth, toWidth) {
        super('')
        const from = Number.parseInt(fromWidth)
        const to = Number.parseInt(toWidth)
        this.rule = from > to ? 'max-width' : 'min-width'
        const settings = Settings.getInstance()
        let ruleWidth = from
        if (settings.layoutWidth !== '' && from === Number.parseInt(settings.layoutWidth)) {
            from > to ? ruleWidth-- : ruleWidth++
        }
        this.selector = [`@media (${this.rule}: ${ruleWidth}px)`]
    }
    setWidth (width) {
        this.selector = [`@media (${this.rule}: ${width}px)`]
    }
}
