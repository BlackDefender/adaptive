import makeAdaptive from './engine/makeAdaptive';
import textToClipboard from './textToClipboard';

class Adaptive {
    #inputElement;
    #outputElement;
    #calculateButtonElement;
    #settings = {};
    #config = {
        storageKey: 'adaptiveSettings',
        calculateButtonIsBlocked: false,
    };

    constructor() {
        const interfaceElement = document.querySelector('app-interface');
        this.#inputElement = interfaceElement.querySelector('.input-code');
        this.#outputElement = interfaceElement.querySelector('.output-code');
        this.#calculateButtonElement = interfaceElement.querySelector('.calculate-button');

        const that = this;
        this.#settings = new Proxy(this.loadSettings(), {
            set(target, prop, val) {
                target[prop] = val;
                that.saveSettings();
                return true;
            },
        });

        this.bindData(this.#settings, 'layoutWidth', interfaceElement.querySelector('.layout-width'), 'value');
        this.bindData(this.#settings, 'fromWidth', interfaceElement.querySelector('.from-width'), 'value');
        this.bindData(this.#settings, 'toWidth', interfaceElement.querySelector('.to-width'), 'value');
        this.bindData(this.#settings, 'inputCode', this.#inputElement, 'value');
        this.bindData(this.#settings, 'copyToClipboard', interfaceElement.querySelector('.check-box-copy-to-clipboard'), 'checked');
        this.bindData(this.#settings, 'wrapIntoMedia', interfaceElement.querySelector('.check-box-wrap-into-media'), 'checked');
        this.bindData(this.#settings, 'addUnlock', interfaceElement.querySelector('.check-box-add-unlock'), 'checked');
        this.bindData(this.#settings, 'unlockToStartValue', interfaceElement.querySelector('.check-box-unlock-to-start-value'), 'checked');
        this.bindData(this.#settings, 'shake', interfaceElement.querySelector('.check-box-shake'), 'checked');

        this.#calculateButtonElement.addEventListener('click', this.calculate.bind(this));
    }

    calculate() {
        if (this.#config.calculateButtonIsBlocked) return;
        this.#config.calculateButtonIsBlocked = true;
        this.output = ''
        try {
            const result = makeAdaptive(this.#inputElement.value, this.#settings)
            this.#outputElement.value = result.output;
            console.log(this.#outputElement);
            console.log(result);
            // if (this.settings.copyToClipboard) {
            //     textToClipboard(result.output)
            // }
        } catch (e) {
            // Logger.getInstance().log(e.toString())
            // console.error(e)
        }
        // this.$refs.logContainer.innerHTML = Logger.getInstance().getLogsFormatted()
        this.#calculateButtonElement.animate();
        setTimeout(() => {
            this.#config.calculateButtonIsBlocked = false;
        }, 1000)
    }

    bindData(object, property, element, parameter) {
        element[parameter] = object[property];
        element.addEventListener('input', () => {
            object[property] = element[parameter];
        });
    }

    get defaultSettings() {
        return {
            baseSelector: '',
            indentSize: 4,
            fromWidth: 0,
            toWidth: 0,
            layoutWidth: 1366,
            inputCode: '',
            outputCode: '',
            addUnlock: true,
            copyToClipboard: true,
            shake: false,
            unlockToStartValue: false,
            wrapIntoMedia: true,
        };
    }

    loadSettings() {
        if (localStorage === undefined) return this.defaultSettings;
        const loadedSettingsStr = localStorage.getItem(this.#config.storageKey);
        if (!loadedSettingsStr) return this.defaultSettings;

        const settings = this.defaultSettings;
        try {
            const loadedSettings = JSON.parse(loadedSettingsStr);
            for (let param in settings) {
                if (settings.hasOwnProperty(param) && loadedSettings.hasOwnProperty(param)) {
                    settings[param] = loadedSettings[param];
                }
            }
        } catch (e) {
            console.error('Settings can\'t be loaded. Use default settings.');
            console.error(e);
            return this.defaultSettings;
        }
        return settings;
    }

    saveSettings() {
        if (!localStorage) return;
        localStorage.setItem(this.#config.storageKey, JSON.stringify(this.#settings));
    }
}
const adaptive = new Adaptive();

