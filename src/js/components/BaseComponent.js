class BaseComponent extends HTMLElement {
    constructor() {
        super();
    }
    init(componentName) {
        const shadow = this.attachShadow({ mode: 'open' });

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `dist/css/${componentName}.css`;
        shadow.appendChild(link);

        const template = document.getElementById(`${this.constructor.toKebabCase(componentName)}-template`);
        shadow.appendChild(template.content.cloneNode(true));
    }

    static toKebabCase(str) {
        return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());
    }
}
