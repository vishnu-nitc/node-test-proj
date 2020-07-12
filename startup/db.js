var myssql = require('mysql');
const config = require('config');
const winston = require('winston');
var connection = myssql.createConnection({
    host : '127.0.0.1',
    user : "root",
    password : config.get('dbPassword'),
    database : "mydb"
});

connection.connect(function(err){
    if(!err){
        winston.info("Database is connected");
    } else {
        throw new Error("Error while connecting with database");
    }
});

module.exports = connection;