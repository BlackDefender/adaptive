import StyleNode from './StyleNode';
import Logger from './Logger';
import ASTParser from './ASTParser';

export default class SCSS {
    constructor(scss) {
        this.scss = scss;
    }

    validate() {
        if (this.scss.trim().length === 0) {
            Logger.getInstance().log('ERROR: Input is empty');
            return false;
        }
        return true;
    }

    parse() {
        if (!this.validate()) {
            return new StyleNode('');
        }
        const parser = new ASTParser(this.scss);
        return parser.parse();
    }
}
