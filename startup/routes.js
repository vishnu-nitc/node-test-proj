const express = require('express');
const register = require('../routes/register');
const login = require('../routes/login')
const books = require('../routes/books');
const token = require('../routes/refreshtoken');
module.exports = function(app){
    app.use(express.json());
    app.use('/api/register',register);
    app.use('/api/login',login);
    app.use('/api/books',books);
    app.use('/api/token',token)
    app.get('/', function (req, res)  {
        res.sendFile("/index.html", { root: '.' });
    });
    app.get('/login.html',function(req, res)  {
        res.sendFile("/login.html", {root: '.' } );
    });
    
}