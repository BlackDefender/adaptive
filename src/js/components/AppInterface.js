class AppInterface extends BaseComponent {
    #interfaceElement;

    constructor() {
        super();
        this.init(this.constructor.name);
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
