export default class Utils {
    static toIntOrZero (value) {
        return parseInt(value) || 0
    }
    static toFloatOrZero (value) {
        return parseFloat(value) || 0
    }
    static toKebabCase (string) {
        return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    }
    static toCamelCase (string) {
        return string.replace(/-[a-z]/g, s => s.toUpperCase()).replace(/-/g, '')
    }
    static isEmptyObject (obj) {
        return Object.getOwnPropertyNames(obj).length === 0
    }
}
