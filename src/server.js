const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('./../config');
const router = require('./router');

const app = express();
app.use(
    bodyParser.json({limit: '10mb', extended: false}),
    bodyParser.urlencoded({extended: false})
);
app.use(helmet());
app.use('/', router);

const port = config.port;
const server = app.listen(port, () => {
    console.log(`Jeeves is listening to your requests on localhost:${port}`);
});

app.stop = () => {
    server.close();
};

module.exports = app;