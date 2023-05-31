import { parse as parser } from 'scss-parser';
import PseudoStyleNode from './PseudoStyleNode';
import StyleNode from './StyleNode';
import TextNode from './TextNode';
import StyleProperty from './StyleProperty';
import Settings from './Settings';
import MediaNode from './MediaNode';

export default class ASTParser {
    constructor(scss) {
        this.scss = scss;
    }

    _reduceAstItemValue(astItem) {
        return astItem.value.reduce((argumentsStr, item) => argumentsStr + this._stringifyAstItem(item), '');
    }

    _stringifyAstItem(astItem) {
        let stringValue = '';
        switch (astItem.type) {
        case 'block':
            stringValue = '';
            break;
        case 'id':
            stringValue = `#${this._reduceAstItemValue(astItem)}`;
            break;
        case 'class':
            stringValue = `.${this._reduceAstItemValue(astItem)}`;
            break;
        case 'variable':
            stringValue = `$${astItem.value}`;
            break;
        case 'color_hex':
            stringValue = `#${astItem.value}`;
            break;
        case 'function':
            stringValue = this._reduceAstItemValue(astItem);
            break;
        case 'arguments':
            stringValue = `(${this._reduceAstItemValue(astItem)})`;
            break;
        case 'pseudo_class':
            stringValue = `:${this._reduceAstItemValue(astItem)}`;
            break;
        case 'string_single':
            stringValue = `'${astItem.value}'`;
            break;
        case 'string_double':
            stringValue = `"${astItem.value}"`;
            break;
        case 'parentheses':
            stringValue = `(${this._reduceAstItemValue(astItem)})`;
            break;
        case 'attribute':
            stringValue = `[${this._reduceAstItemValue(astItem)}]`;
            break;
        default: // punctuation, space, atkeyword, identifier, number, operator, string, declaration, punctuation, value
            if (typeof astItem.value === 'string') {
                stringValue = astItem.value;
            } else {
                stringValue = this._reduceAstItemValue(astItem);
            }
            break;
        }
        return stringValue;
    }

    _stringifyAtrule(astItem) {
        return astItem.value.reduce((atrule, valueItem) => atrule + this._stringifyAstItem(valueItem), '@');
    }

    _convertDeclaration(astItem) {
        const property = astItem.value.find((item) => item.type === 'property').value.reduce((valueStr, item) => valueStr + this._stringifyAstItem(item), '');
        const value = astItem.value.find((item) => item.type === 'value').value.reduce((valueStr, item) => valueStr + this._stringifyAstItem(item), '');
        return new StyleProperty([property, value]);
    }

    _ruleSelector(rule) {
        const selectorObject = rule.value.find((astItem) => astItem.type === 'selector');
        return selectorObject.value.reduce((selector, astItem) => selector + this._stringifyAstItem(astItem), '');
    }

    _convertRuleBlock(rule, node) {
        const block = rule.value.find((astItem) => astItem.type === 'block');
        block.value.forEach((astItem) => {
            switch (astItem.type) {
            case 'rule':
                this._convertRule(astItem, node);
                break;
            case 'declaration':
                const declaration = this._convertDeclaration(astItem);
                node.appendProperty(declaration);
                break;
            case 'atrule':
                this._convertAtRule(astItem, node);
                break;
            case 'comment_singleline':
                node.appendProperty(new TextNode(`//${astItem.value}`));
                break;
            case 'comment_multiline':
                node.appendProperty(new TextNode(`/*${astItem.value}*/`));
                break;
            }
        });
    }

    _convertAtRule(astItem, parentNode) {
        const atRuleType = astItem.value.find((item) => item.type === 'atkeyword').value;
        switch (atRuleType) {
        case 'media':
            this._convertRuleBlock(astItem, parentNode);
            break;
        default:
            const atrule = this._stringifyAtrule(astItem);
            parentNode.appendProperty(new TextNode(atrule));
            break;
        }
    }

    _convertRule(rule, parentNode) {
        const selector = this._ruleSelector(rule);
        const node = new StyleNode(selector, parentNode);
        this._convertRuleBlock(rule, node);
        parentNode.appendChild(node);
    }

    parse() {
        const ast = parser(this.scss);
        const settings = Settings.getInstance();
        let styleTree;
        if (settings.wrapIntoMedia) {
            styleTree = new MediaNode(settings.fromWidth, settings.toWidth);
        } else {
            styleTree = new PseudoStyleNode();
        }
        ast.value.forEach((astItem) => {
            switch (astItem.type) {
            case 'rule':
                this._convertRule(astItem, styleTree);
                break;
            case 'atrule':
                this._convertAtRule(astItem, styleTree);
                break;
            }
        });
        return styleTree;
    }
}
