const express = require('express');
const nodemailer = require('nodemailer');
const router= express.Router();
const {User} = require('../model/user');
const {Token} = require('../model/emailToken');
const config = require('config');
const Joi = require('joi');
const crypto = require('crypto');

router.post('/',async (req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if ( !user ) return res.status(400).send('Email id is not registered');
    if (user.isVerified) return res.status(400).send('Email is already verified');
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

});


function validate(email){
    const schema = {
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255)
    }
    return Joi.validate(email,schema);   // to validate req.body when user sends registration
}
module.exports =router;