'use strict';

class Selector {
    constructor(selector) {
        const operand = selector.match(/[*^=$]=/g)[0];

        this.arr = selector.substring(0, selector.indexOf('['));
        this.key = selector.substring(selector.indexOf('[') + 1, selector.indexOf(operand));
        this.operand = operand;
        this.value = selector.substring(selector.indexOf(operand) + 2, selector.indexOf(']'));
    }

    compare(obj) {
        const opEquals = '==',
            opContains = '*=',
            opStartsWith = '^=',
            opEndsWith = '$=';

        switch (this.operand) {
            case opEquals:
                return obj[this.key].toString() === this.value;
            case opContains:
                return obj[this.key].toString().includes(this.value);
            case opStartsWith:
                return obj[this.key].toString().startsWith(this.value);
            case opEndsWith:
                return obj[this.key].toString().endsWith(this.value);
        }
    }
}

module.exports = Selector;