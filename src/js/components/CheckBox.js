import BaseComponent from './BaseComponent';
import html from '../../templates/CheckBox.html';
import css from '../../scss/CheckBox.scss';

export default class CheckBox extends BaseComponent {
    #input;

    constructor() {
        super(html, css);

        const shadow = this.shadowRoot;
        this.#input = shadow.querySelector('input');

        const title = this.getAttribute('data-title');
        if (title) {
            shadow.querySelector('.title').textContent = title;
        }
        this.#input.addEventListener('input', () => {
            this.dispatchEvent(new Event('input'));
        });
    }

    get checked() {
        return this.#input.checked;
    }

    set checked(state) {
        this.#input.checked = state;
    }
}

customElements.define('check-box', CheckBox);
