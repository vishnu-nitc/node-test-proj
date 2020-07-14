const express=require('express');
const winston = require('winston');

require('./startup/db')();
require('./startup/log');

var app = express();



require('./startup/config')();
require('./startup/routes')(app);


port = process.env.PORT || 8012;
const server = app.listen(port, () => winston.info(`Listening to ${port}`));
module.exports = server;