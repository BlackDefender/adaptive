class CodeContainer extends BaseComponent {
    #inputField;
    #modeButton;
    #codeContainer;
    constructor() {
        super();
        this.init(this.constructor.name);
        const shadow = this.shadowRoot;
        this.#inputField = shadow.querySelector('textarea');
        const title = this.getAttribute('data-title');
        if (title) {
            shadow.querySelector('.title').textContent = title;
        }
        this.#modeButton = shadow.querySelector('.mode-button');
        this.#codeContainer = shadow.querySelector('.code-container');
        this.#setModeButtonText();
        this.#modeButton.addEventListener('click', () => {
            this.#codeContainer.classList.toggle('expanded');
            this.#setModeButtonText();
        });
        this.#inputField.addEventListener('input', () => {
            this.dispatchEvent(new Event('input'));
        });
    }

    #setModeButtonText() {
        if (this.#codeContainer.classList.contains('expanded')) {
            this.#modeButton.textContent = 'Shrink';
        } else {
            this.#modeButton.textContent = 'Expand';
        }
    }

    get value() {
        return this.#inputField.value;
    }
    set value(val) {
        this.#inputField.value = val;
    }
}

customElements.define('code-container', CodeContainer);
