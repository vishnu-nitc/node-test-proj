const bcrypt = require('bcrypt');
const express = require('express');
const nodemailer = require('nodemailer');
const {Token} = require('../model/emailToken')
const jwt =require('jsonwebtoken');
const config = require('config');
const {User, validate} = require('../model/user');
const router = express.Router();
const _ = require('lodash');
const crypto = require('crypto');


router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if ( user ) return res.status(400).send('User already registered');
    const salt = await bcrypt.genSalt(10);
    user = new User(_.pick(req.body,['name','email','password']));
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    const tokenEmail = new Token({ _userId:user._id, token: crypto.randomBytes(16).toString('hex')});
    await tokenEmail.save();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: config.get('user_id'), pass: config.get('passwd')}  
    });
    const mailOptions = {
        from: 'noreply@book.com',
        to: user.email,
        subject: 'account verification token',
        text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + tokenEmail.token + '.\n'
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        res.status(200).send('A verification email has been sent to ' + user.email + '.');
    });
    /*const accessToken = jwt.sign({ email: req.body.email}, config.get('jwtPrivateKey'),{ expiresIn: config.tokenLife});
    const refreshToken = jwt.sign({ email: req.body.email}, config.get('refreshToken'),{ expiresIn: config.RefreshTokenLife});
    res.status(200).header({'auth-token':accessToken,'refresh-token':refreshToken}).send(_.pick(user,['_id','name','email']));*/
    
});





module.exports =router;