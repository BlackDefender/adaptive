import StyleNode from './StyleNode';

export default class PseudoStyleNode extends StyleNode {
    constructor() {
        super('');
        this._levelComputingStartValue = -1;
    }

    static get iSPseudo() {
        return true;
    }

    toLockString() {
        return `${this._childNodesToLockString()}\n`;
    }

    toUnlockString() {
        return `${this._childNodesToUnlockString()}\n`;
    }
}
