const express=require('express');
var bodyParser=require('body-parser');
const winston = require('winston');

require('./startup/db');
require('./startup/log');

var app = express();



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./startup/config')();
require('./startup/routes')(app);


port = process.env.PORT || 8012;
const server = app.listen(port, () => winston.info(`Listening to ${port}`));
module.exports = server;