import Settings from './Settings';

export default class StyleProperty {
    constructor(data) {
        const dataArray = typeof data === 'string' ? data.split(':') : data;
        this.name = dataArray[0].trim();
        this.value = dataArray[1].replace(';', '').trim().split(' ').map((item) => item.trim())
            .join(' ');
        this.newValue = null;
    }

    static isHEXColor(value) {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
    }

    static isSCSSVariable(value) {
        return value.charAt(0) === '$';
    }

    static isCSSVariable(value) {
        return value.substring(0, 3) === 'var';
    }

    static isDimensionless(value) {
        return value.length > 0 && /^\d*\.*\d*$/i.test(value);
    }

    static isNonPixelValue(value) {
        return value.includes('%') || value.includes('em') || value.includes('fr');
    }

    static compareValue(oldValue, newValue) {
        oldValue = oldValue.split(' ');
        newValue = newValue.split(' ');
        return oldValue.map((item, index) => {
            if (item === 'auto') return item;
            if (this.isNonPixelValue(item)) return item;
            if ((item === '0' || item === '0px') && (newValue[index] === '0' || newValue[index] === '0px')) return item;
            if (index === 2 && newValue[index] === undefined) return newValue[0];
            if (index === 3 && newValue[index] === undefined) return newValue[1];
            return newValue[index] || '';
        }).join(' ');
    }

    static prepareValueToUnlock(value) {
        return value
            .split(' ')
            .map((item) => (parseInt(item, 10) === 0 ? 0 : item))
            .join(' ');
    }

    addNewValue(newValueObj) {
        const newValue = newValueObj.element || newValueObj.stylesheet || newValueObj.computed;
        if (!this.cssLockAvailable()
            || newValue === undefined
            || newValue === ''
            || this.constructor.isHEXColor(newValue)
            || this.constructor.isSCSSVariable(newValue)
            || this.constructor.isCSSVariable(newValue)
            || (this.name === 'line-height' && this.constructor.isDimensionless(this.value))
            || this.value === 'auto') {
            return;
        }

        const compareValue = this.constructor.compareValue(this.value, newValue);
        if (this.value !== compareValue) this.newValue = compareValue;
    }

    get saveOnShake() {
        return this.newValue !== null;
    }

    toLockString() {
        const settings = Settings.getInstance();
        if (this.newValue) {
            return `${this.name}: ${this.constructor.makeCssLockString(this.value, this.newValue, settings.fromWidth, settings.toWidth)};`;
        }
        return `${this.name}: ${this.value};`;
    }

    toUnlockString() {
        if (Settings.getInstance().unlockToStartValue) return `${this.name}: ${this.constructor.prepareValueToUnlock(this.value)};`;
        if (this.newValue) return `${this.name}: ${this.constructor.prepareValueToUnlock(this.newValue)};`;
        return null;
    }

    static makeString(fromValStr, toValStr, fromWidth, toWidth) {
        if (fromValStr === 'auto') return 'auto';
        const fromVal = this.round(fromValStr);
        const toVal = this.round(toValStr);
        // const units = this.getUnits(fromValStr);
        if (fromVal === toVal) {
            return fromVal + ((fromVal > 0) ? 'px' : '');
        }
        return `calc(${fromVal}px + (${fromVal} - ${toVal}) * (100vw - ${fromWidth}px) / (${fromWidth} - ${toWidth}))`;
    }

    /* static getUnits(val) {
        const supportedUnits = ['px', 'em', 'rem'];
        const m = val.match(/\D+$/);
        const unit = m && m[0];
        if (unit && supportedUnits.indexOf(unit) === -1) {
            return 'px';
        }
        return unit;
    } */

    static round(val) {
        return Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100;
    }

    static valueByIndex(propertyString, index) {
        const propertyArray = propertyString.split(' ');
        if (propertyArray[index] !== undefined) return propertyArray[index];
        if (index === 1 || index === 2) return propertyArray[0];
        if (index === 3 && propertyArray[1] !== undefined) return propertyArray[1];
        return propertyArray[0];
    }

    static cssLockStringSeparator(lock) {
        let calcCount = 0;
        lock.forEach((item) => {
            if (item.includes('calc')) calcCount += 1;
        });
        return calcCount >= 2 ? '\n' : ' ';
    }

    static makeCssLockString(fromStr, toStr, fromWidth, toWidth) {
        const fromArray = fromStr.split(' ');
        const lock = [];
        for (let i = 0; i < fromArray.length; ++i) {
            const toValue = this.valueByIndex(toStr, i);
            lock.push(this.makeString(fromArray[i], toValue, fromWidth, toWidth));
        }
        if (lock.length === 1) return lock[0];
        const separator = this.cssLockStringSeparator(lock);
        return lock.join(separator);
    }

    cssLockAvailable() {
        return Settings.getInstance().styleProperties.includes(this.name);
    }
}
