class CalculateButton extends BaseComponent{
    #button;
    constructor() {
        super();
        this.init(this.constructor.name);
        this.#button = this.shadowRoot.querySelector('.calculate-button');
    }

    animate() {
        this.#button.classList.add('animated');
        setTimeout(() => {
            this.#button.classList.remove('animated');
        }, 1000);
    }
}

customElements.define('calculate-button', CalculateButton);
