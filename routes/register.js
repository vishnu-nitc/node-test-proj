const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const jwt =require('jsonwebtoken');
const config = require('config');
const {User, validate} = require('../model/user');
const router = express.Router();
const _ = require('lodash');


router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if ( user ) return res.status(400).send('User already registered');
    const salt = await bcrypt.genSalt(10);
    user = new User(_.pick(req.body,['name','email','password']));
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    const accessToken = jwt.sign({ email: req.body.email}, config.get('jwtPrivateKey'),{ expiresIn: config.tokenLife});
    const refreshToken = jwt.sign({ email: req.body.email}, config.get('refreshToken'),{ expiresIn: config.RefreshTokenLife});
    res.status(200).header({'auth-token':accessToken,'refresh-token':refreshToken}).send(_.pick(user,['_id','name','email']));
    
})





module.exports =router;