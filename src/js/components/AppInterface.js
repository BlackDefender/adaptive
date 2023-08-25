import BaseComponent from './BaseComponent';
import html from '../../templates/AppInterface.html';
import css from '../../scss/AppInterface.scss';

class AppInterface extends BaseComponent {
    #interfaceElement;

    constructor() {
        super(html, css);
        this.#interfaceElement = this.shadowRoot.querySelector('.app-interface');
    }

    setPosition(x, y) {
        this.#interfaceElement.style.left = `${x}px`;
        this.#interfaceElement.style.top = `${y}px`;
    }

    get width() {
        return this.#interfaceElement.clientWidth;
    }

    get height() {
        return this.#interfaceElement.clientHeight;
    }
}

customElements.define('app-interface', AppInterface);
