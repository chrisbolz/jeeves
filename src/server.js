const express = require('express');
const bodyParser = require('body-parser');
const config = require('./../config');

const app = express();
app.use(
    bodyParser.json({limit: '10mb', extended: false}),
    bodyParser.urlencoded({extended: false})
);

const port = config.port;
const server = app.listen(port, () => {
    console.log(`Jeeves is listening to your requests on localhost:${port}`);
});

require('./router')(app);

app.stop = () => {
    server.close();
};

module.exports = app;