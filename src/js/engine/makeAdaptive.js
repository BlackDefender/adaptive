import Settings from './classes/Settings'
import Logger from './classes/Logger'
import SCSS from './classes/SCSS'
import BrowserStyles from './classes/BrowserStyles'
import MediaNode from './classes/MediaNode'

BrowserStyles.getInstance().modify()

const makeAdaptive = (input, config) => {
    const settings = Settings.getInstance()

    settings.setSettings(config)

    Logger.getInstance().clear()
    let scss = new SCSS(input)
    const styleTree = scss.parse()
    styleTree.addCurrentStyleValues()

    if (settings.shake) {
        styleTree.shake()
    }

    let output = styleTree.toLockString()

    if (settings.addUnlock) {
        let unlock = `\n\n`
        if (styleTree.constructor === MediaNode) styleTree.setWidth(settings.toWidth)
        styleTree.shake()
        unlock += styleTree.toUnlockString()
        output += unlock
    }

    return {
        output,
        logs: Logger.getInstance().getLogs()
    }
}

export default makeAdaptive
