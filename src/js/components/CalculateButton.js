import BaseComponent from './BaseComponent';
import html from '../../templates/CalculateButton.html';
import css from '../../scss/CalculateButton.scss';

class CalculateButton extends BaseComponent {
    #button;

    constructor() {
        super(html, css);
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
