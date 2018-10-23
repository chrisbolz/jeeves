const fs = require("fs");
const path = require("path");
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
const server = require("./../src/server");

chai.use(chaiHttp);

const testJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());

before(() => {
    process.env.test = true;
});

describe("Test server.js GET", () => {
    it("can GET a JSON file as json", done => {
        chai.request(server)
            .get('/test')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('array');
                done();
            });
    });

    it("can GET specific object", done => {
        chai.request(server)
            .get('/test.object.nested')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.str.should.equal('nested-str');
                done();
            });
    });

    it("can GET specific object using selector", done => {
        chai.request(server)
            .get('/test.array[int==1]')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body[0].str.should.equal('array1str');
                done();
            });
    });
});

describe("Test server.js PATCH", () => {
    afterEach(() => {
        fs.writeFileSync(path.resolve(__dirname, './testData/test.json'), JSON.stringify(testJSON, null, 2));
    });

    it("can partially update object", done => {
        const body = {str: "changedStr", int: 9001, nested: {str: "changedNested"}};
        chai.request(server)
            .patch('/test.object')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.object.str.should.equal(body.str);
                changedFile.object.int.should.equal(body.int);
                changedFile.object.bool.should.equal(true);
                changedFile.object.nested.str.should.equal(body.nested.str);
                should.exist(changedFile.object.nested.next);
                changedFile.object.nested.next.should.deep.equal(testJSON.object.nested.next);

                done();
            });
    });

    const arrayPutTest = {str: "changedStr"};
    it("can partially update object in array via index", done => {
        chai.request(server)
            .patch('/test.array[1]')
            .send(arrayPutTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array[0].should.deep.equal(testJSON.array[0]);
                changedFile.array[1].str.should.equal(arrayPutTest.str);
                changedFile.array[1].int.should.equal(testJSON.array[1].int);

                done();
            });
    });

    it("can partially update object in array via selector", done => {
        chai.request(server)
            .patch('/test.array[str$=1str]')
            .send(arrayPutTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array[0].should.deep.equal(testJSON.array[0]);
                changedFile.array[1].str.should.equal(arrayPutTest.str);
                changedFile.array[1].int.should.equal(testJSON.array[1].int);

                done();
            });
    });

    it("can partially update multiple objects in array via selector", done => {
        chai.request(server)
            .patch('/test.array[str^=array]')
            .send(arrayPutTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array[0].str.should.equal(arrayPutTest.str);
                changedFile.array[0].int.should.equal(testJSON.array[0].int);
                changedFile.array[1].str.should.equal(arrayPutTest.str);
                changedFile.array[1].int.should.equal(testJSON.array[1].int);

                done();
            });
    });
});

describe("Test server.js POST", () => {
    afterEach(() => {
        fs.writeFileSync(path.resolve(__dirname, './testData/test.json'), JSON.stringify(testJSON, null, 2));
    });

    it("can append object to array", done => {
        const body = {"int": 2, "bool": true, "str": "array2str"};
        chai.request(server)
            .post('/test.array')
            .send(body)
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array[1].should.deep.equal(testJSON.array[1]);
                changedFile.array.length.should.equal(3);
                changedFile.array[2].should.deep.equal(body);

                done();
            });
    });

    it("can append object to an existing object", done => {
        const body = {"str": "a fresh object"};
        chai.request(server)
            .post('/test.posted')
            .send(body)
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                should.exist(changedFile.posted);
                changedFile.posted.str.should.equal(body.str);
                done();
            });
    });
});

describe("Test server.js PUT", () => {
    afterEach(() => {
        fs.writeFileSync(path.resolve(__dirname, './testData/test.json'), JSON.stringify(testJSON, null, 2));
    });

    it("can update object", done => {
        const body = {str: "changedStr", int: 9001, nested: {str: "changedNested"}};
        chai.request(server)
            .put('/test.object')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.object.str.should.equal(body.str);
                changedFile.object.int.should.equal(body.int);
                should.not.exist(changedFile.object.bool);
                should.not.exist(changedFile.object.nested.next);

                done();
            });
    });

    const arrayPutTest = {str: "changedStr"};
    it("can update object in array via index", done => {
        chai.request(server)
            .put('/test.array[1]')
            .send(arrayPutTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array[0].should.deep.equal(testJSON.array[0]);
                changedFile.array[1].str.should.equal(arrayPutTest.str);
                should.not.exist(changedFile.array[1].int);

                done();
            });
    });

    it("can update object in array via selector", done => {
        chai.request(server)
            .put('/test.array[str$=1str]')
            .send(arrayPutTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array[0].should.deep.equal(testJSON.array[0]);
                changedFile.array[1].str.should.equal(arrayPutTest.str);
                should.not.exist(changedFile.array[1].int);

                done();
            });
    });

    it("can update multiple objects in array via selector", done => {
        chai.request(server)
            .put('/test.array[str^=array]')
            .send(arrayPutTest)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array[0].str.should.equal(arrayPutTest.str);
                should.not.exist(changedFile.array[0].int);
                changedFile.array[1].str.should.equal(arrayPutTest.str);
                should.not.exist(changedFile.array[1].int);

                done();
            });
    });

});

describe("Test server.js DELETE", () => {
    afterEach(() => {
        fs.writeFileSync(path.resolve(__dirname, './testData/test.json'), JSON.stringify(testJSON, null, 2));
    });

    it("can DELETE an object from a structure", done => {
        chai.request(server)
            .delete('/test.object')
            .end((err, res) => {
                res.should.have.status(204);

                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                should.not.exist(changedFile.object);

                done();
            });
    });

    it("can DELETE an array", done => {
        chai.request(server)
            .delete('/test.array')
            .end((err, res) => {
                res.should.have.status(204);

                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.should.not.have.property('array');

                done();
            });
    });

    it("can DELETE via selector", done => {
        chai.request(server)
            .delete('/test.array[str^=array0]')
            .end((err, res) => {
                res.should.have.status(204);

                const changedFile = JSON.parse(fs.readFileSync(path.resolve(__dirname, './testData/test.json')).toString());
                changedFile.should.not.deep.equal(testJSON);
                changedFile.array.length.should.equal(1);
                changedFile.array[0].should.deep.equal(testJSON.array[1]);

                done();
            });
    });
});