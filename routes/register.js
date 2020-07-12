const bcrypt = require('bcrypt');
const express = require('express');
const connection = require('../startup/db');
const Joi = require('joi');
const jwt =require('jsonwebtoken');
const config = require('config');
const router = express.Router();



router.post('/', async(req, res) => {
    let out = "a";
    var today = new Date();
    const {error} = validateUser(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    await connection.query( 'SELECT * FROM USERS WHERE EMAIL = ?',req.body.email, function(error,results,fileds) {
        if (error) return res.status(500).send(error.details[0].message);
        if (results.length > 0) return res.status(400).send('User already registered');
        });
    const salt = await bcrypt.genSalt(10);
    var user={
            "name":req.body.name,
            "email":req.body.email,
            "password":req.body.password,
            "created_at":today,
            "updated_at":today
        }
    user.password = await bcrypt.hash(user.password,salt);
    const accessToken = jwt.sign({ email: req.body.email}, config.get('jwtPrivateKey'),{ expiresIn: config.tokenLife});
    const refreshToken = jwt.sign({ email: req.body.email}, config.get('refreshToken'),{ expiresIn: config.RefreshTokenLife});
    await connection.query('INSERT INTO users SET ?',user, function(error, results, fields) {
        if (error) return res.status(500).send(error.details[0].message); 
        else {
            out =results.insertId;
            res.status(200).header({'auth-token':accessToken,'refresh-token':refreshToken}).send(`${out}`);
        }
});
})



function validateUser(user){
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255),
        password: Joi.string().required().min(5).max(255)
    }
    return Joi.validate(user,schema);   // to validate req.body when user sends registration
}

module.exports =router;