const express = require('express');
const register = require('../routes/register');
const login = require('../routes/login')
const books = require('../routes/books');
const token = require('../routes/refreshtoken');
const resend = require('../routes/resendEmail');
const emailConfirmation = require('../routes/emailConfirmation')
var bodyParser = require('body-parser');
module.exports = function(app){
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ type: 'application/*+json' }));
    app.use('/api/register',register);
    app.use('/api/login',login);
    app.use('/api/books',books);
    app.use('/api/token',token);
    app.use('/confirmation',emailConfirmation);
    app.use('/resend',resend);
    app.get('/', function (req, res)  {
        res.sendFile("/index.html", { root: '.' });
    });
    app.get('/login.html',function(req, res)  {
        res.sendFile("/login.html", {root: '.' } );
    });
    
}