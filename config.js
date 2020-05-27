var myssql = require('mysql');
var connection = myssql.createConnection({
    host : '127.0.0.1',
    user : "root",
    password : 'Nissan20',
    database : "mydb"
});

connection.connect(function(err){
    if(!err){
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
});

module.exports = connection;