class AppInterface extends BaseComponent {
    constructor() {
        super();
        this.init(this.constructor.name);
    }
}

customElements.define('app-interface', AppInterface);
