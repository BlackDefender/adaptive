import Logger from './engine/classes/Logger';
import makeAdaptive from './engine/makeAdaptive';

class Adaptive {
    #inputElement;
    #outputElement;
    #logsElement;
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
        this.#logsElement = interfaceElement.querySelector('.logs-container');
        this.#calculateButtonElement = interfaceElement.querySelector('.calculate-button');

        const that = this;
        this.#settings = new Proxy(this.loadSettings(), {
            set(target, prop, val) {
                target[prop] = val;
                that.saveSettings();
                return true;
            },
        });

        this.bindSetting('layoutWidth', interfaceElement.querySelector('.layout-width'), 'value');
        this.bindSetting('fromWidth', interfaceElement.querySelector('.from-width'), 'value');
        this.bindSetting('toWidth', interfaceElement.querySelector('.to-width'), 'value');
        this.bindSetting('inputCode', this.#inputElement, 'value');
        this.bindSetting('copyToClipboard', interfaceElement.querySelector('.check-box-copy-to-clipboard'), 'checked');
        this.bindSetting('wrapIntoMedia', interfaceElement.querySelector('.check-box-wrap-into-media'), 'checked');
        this.bindSetting('addUnlock', interfaceElement.querySelector('.check-box-add-unlock'), 'checked');
        this.bindSetting('unlockToStartValue', interfaceElement.querySelector('.check-box-unlock-to-start-value'), 'checked');
        this.bindSetting('shake', interfaceElement.querySelector('.check-box-shake'), 'checked');

        this.#calculateButtonElement.addEventListener('click', this.calculate.bind(this));

        this.loadStyleProperties();
    }

    async loadStyleProperties() {
        const result = await fetch('style-properties.json');
        this.#settings.styleProperties = await result.json();
    }

    calculate() {
        if (this.#config.calculateButtonIsBlocked) return;
        this.#config.calculateButtonIsBlocked = true;
        try {
            const result = makeAdaptive(this.#inputElement.value, this.#settings);
            this.#outputElement.value = result.output;
            if (this.#settings.copyToClipboard) {
                this.constructor.copyToClipboard(result.output);
            }
        } catch (e) {
            Logger.getInstance().log(e.toString());
            console.error(e);
        }
        this.#logsElement.logAll(Logger.getInstance().getLogs());
        this.#calculateButtonElement.animate();
        setTimeout(() => {
            this.#config.calculateButtonIsBlocked = false;
        }, 1000);
    }

    bindSetting(property, element, parameter) {
        element[parameter] = this.#settings[property];
        element.addEventListener('input', () => {
            this.#settings[property] = element[parameter];
        });
    }

    static defaultSettings() {
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
            styleProperties: [],
        };
    }

    loadSettings() {
        if (localStorage === undefined) return this.constructor.defaultSettings();
        const loadedSettingsStr = localStorage.getItem(this.#config.storageKey);
        if (!loadedSettingsStr) return this.constructor.defaultSettings();

        const settings = this.constructor.defaultSettings();
        try {
            const loadedSettings = JSON.parse(loadedSettingsStr);
            for (const param in settings) {
                if (settings.hasOwnProperty(param) && loadedSettings.hasOwnProperty(param)) {
                    settings[param] = loadedSettings[param];
                }
            }
        } catch (e) {
            console.error('Settings can\'t be loaded. Use default settings.');
            console.error(e);
            return this.defaultSettings();
        }
        return settings;
    }

    saveSettings() {
        if (!localStorage) return;
        localStorage.setItem(this.#config.storageKey, JSON.stringify(this.#settings));
    }

    static copyToClipboard(text) {
        const element = document.createElement('textarea');
        element.style.position = 'fixed';
        element.style.top = '-100vh';
        document.body.appendChild(element);
        element.value = text;
        element.select();
        document.execCommand('copy');
        document.body.removeChild(element);
    }
}
const adaptive = new Adaptive();
