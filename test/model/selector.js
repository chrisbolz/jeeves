const should = require("chai").should();
const fs = require("fs");
const path = require("path");

const SystemUnderTest = require("../../model/Selector");
const testJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../testData/test.json')).toString());

const testEquals = 'array[str==array0str]',
    testContains = 'array[str*=array]',
    testStartsWith = 'array[str^=array0]',
    testEndsWith = 'array[str$=0str]';

const getSelector = queryPart => {
    return queryPart.substring(queryPart.indexOf('['), queryPart.indexOf(']') + 1);
};

describe("Test Selector.js", () => {
    it("can construct a selector from a query string part", () => {
        const testSelector = new SystemUnderTest(testEquals);
        testSelector.arr.should.equal("array");
        testSelector.key.should.equal("str");
        testSelector.value.should.equal("array0str");
        testSelector.operand.should.equal("==");
    });

    it("can compare for equals", () => {
        const testSelector = new SystemUnderTest(getSelector(testEquals));
        let res = [];
        testJSON.array.forEach(entry => {
            if (testSelector.compare(entry)) {
                res.push(entry)
            }
        });
        res.length.should.equal(1);
        res[0].str.should.equal(testJSON.array[0].str);
    });

    it("can compare for contains", () => {
        const testSelector = new SystemUnderTest(getSelector(testContains));
        let res = [];
        testJSON.array.forEach(entry => {
            if (testSelector.compare(entry)) {
                res.push(entry)
            }
        });
        res.length.should.equal(2);
        res[0].str.should.equal(testJSON.array[0].str);
        res[1].str.should.equal(testJSON.array[1].str);
    });

    it("can compare for startsWith", () => {
        const testSelector = new SystemUnderTest(getSelector(testStartsWith));
        let res = [];
        testJSON.array.forEach(entry => {
            if (testSelector.compare(entry)) {
                res.push(entry)
            }
        });
        res.length.should.equal(1);
        res[0].str.should.equal(testJSON.array[0].str);
    });

    it("can compare for endsWith", () => {
        const testSelector = new SystemUnderTest(getSelector(testEndsWith));
        let res = [];
        testJSON.array.forEach(entry => {
            if (testSelector.compare(entry)) {
                res.push(entry)
            }
        });
        res.length.should.equal(1);
        res[0].str.should.equal(testJSON.array[0].str);
    });
});