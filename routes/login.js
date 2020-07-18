const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const jwt =require('jsonwebtoken');
const config = require('config');
const {User} = require('../model/user');
const mongoose = require('mongoose');
const router = express.Router();

router.post('/',  async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if ( !user ) return res.status(400).send('Invalid username or password');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('invalid username or password');
    if (!user.isVerified) return res.status(400).send('Email is not verified');
    const accessToken = jwt.sign({ email: req.body.email}, config.get('jwtPrivateKey'),{ expiresIn: config.tokenLife});
    const refreshToken = jwt.sign({ email: req.body.email}, config.get('refreshToken'),{ expiresIn: config.RefreshTokenLife});
    res.status(200).send({'auth-token':accessToken,'refresh-token':refreshToken});

});


function validate(user){
    const schema = {
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255),
        password: Joi.string().required().min(5).max(255)
    }
    return Joi.validate(user,schema);   // to validate req.body when user sends registration
}
module.exports =router;