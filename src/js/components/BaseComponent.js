export default class BaseComponent extends HTMLElement {
    constructor(html, css) {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = css;
        shadow.appendChild(style);

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const template = doc.querySelector('template');
        shadow.appendChild(template.content.cloneNode(true));
    }
}
