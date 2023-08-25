import BaseComponent from './BaseComponent';
import html from '../../templates/AppHeader.html';
import css from '../../scss/AppHeader.scss';

class AppHeader extends BaseComponent{
    constructor() {
        super(html, css);

        const interfaceElement = document.querySelector('app-interface');
        const titleElement = this.shadowRoot.querySelector('.title');

        this.shadowRoot
            .querySelector('.close-button')
            .addEventListener('click', () => {
                interfaceElement.style.display = 'none';
            });

        let moveWindow = false;
        let baseX = 0;
        let baseY = 0;
        let windowX = 0;
        let windowY = 0;

        const onMove = (e, rewriteWindowPosition = false) => {
            if (!moveWindow) return;
            e.preventDefault();
            const deltaX = e.pageX - baseX;
            const deltaY = e.pageY - baseY;
            let x = windowX + deltaX;
            let y = windowY + deltaY;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            if (x > window.innerWidth - interfaceElement.width) {
                x = window.innerWidth - interfaceElement.width;
            }
            if (y > window.innerHeight - interfaceElement.height) {
                y = window.innerHeight - interfaceElement.height;
            }
            interfaceElement.setPosition(x, y);
            if (!rewriteWindowPosition) return;
            windowX = x;
            windowY = y;
        };
        titleElement.addEventListener('mousedown', (e) => {
            moveWindow = true;
            baseX = e.pageX;
            baseY = e.pageY;
        });
        document.addEventListener('mouseup', (e) => {
            if (!moveWindow) return;
            onMove(e, true);
            moveWindow = false;
        });
        document.addEventListener('mousemove', onMove);
    }
}

customElements.define('app-header', AppHeader);
