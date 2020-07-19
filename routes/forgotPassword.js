const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User} = require('../model/user');
//const transporter = require('../startup/transporter');
const nodemailer = require('nodemailer');
const config = require('config');
const shortid = require('shortid');
const {Otp} = require('../model/otpToken');
const bcrypt = require('bcrypt');

router.post('/',async(req, res)=> {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("email id is not registered");
    const emailOtp = shortid.generate();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: config.get('user_id'), pass: config.get('passwd')}  
    });
    const mailOption = {
        from: 'passwd@gmail.com',
        to: user.email,
        subject: 'passwd change otp',
        text: `Hello ${user.name}, \n\n You requested for passwd change . Please enter the otp send below \n\n otp : \t ${emailOtp}`
    }
    transporter.sendMail(mailOption,async function(err){
        if (err) { return res.status(500).send({ msg: err.message }); }
        const emlOtp = new Otp({email: user.email,otpToken: emailOtp})
        await emlOtp.save();
        res.status(200).send("otp is send to mail please enter otp to continue");

    })
});
router.post('/change',async(req, res)=> {
    const {error} = validateChange(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("email id is not registered");
    const emailOtp = await Otp.findOne({email: req.body.email}).limit(1).sort({createdAt: -1});
    if(!emailOtp) return res.status(400).send("Please send a valid OTP");
    if(emailOtp.otpToken !== req.body.emlOtp) return res.status(400).send("Please send a valid OTP");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password,salt);
    await user.save();
    res.status(200).send("password is changed please login ");    // how to invalidate already issued access token and refresh token  
});

function validate(user){
    const schema = {
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255)
    }
    return Joi.validate(user,schema);   // to validate req.body when user sends registration
}

function validateChange(user){
    const schema = {
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255),
        emlOtp: Joi.string().required(),
        password: Joi.string().required().min(5).max(255)
    }
    return Joi.validate(user,schema);   // to validate req.body when user sends registration
}
module.exports =router;