class BaseSelector extends BaseComponent {
    #label;
    #input;
    constructor() {
        super();
        this.init(this.constructor.name);

        this.#label = this.shadowRoot.querySelector('.label');
        this.#input = this.shadowRoot.querySelector('.input');

        const title = this.getAttribute('data-title');
        if (title) {
            this.#label.textContent = title;
        }
    }

    get value() {
        return this.#input.value;
    }

    set value(val) {
        this.#input.value = val;
    }
}

customElements.define('base-selector', BaseSelector);
