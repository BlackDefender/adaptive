import BaseComponent from './BaseComponent';
import html from '../../templates/LogsContainer.html';
import css from '../../scss/LogsContainer.scss';

class LogsContainer extends BaseComponent {
    #containerElement;

    constructor() {
        super(html, css);
        this.#containerElement = this.shadowRoot.querySelector('.logs-container');
    }

    logAll(messages) {
        const messageElements = messages.map((message) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('log-message');
            messageElement.textContent = message;
            return messageElement;
        });
        this.#containerElement.replaceChildren(...messageElements);
    }
}

customElements.define('logs-container', LogsContainer);
