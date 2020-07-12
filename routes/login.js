const bcrypt = require('bcrypt');
const express = require('express');
const connection = require('../startup/db');
const Joi = require('joi');
const jwt =require('jsonwebtoken');
const config = require('config');
const router = express.Router();

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    connection.query('SELECT * FROM users where email = ?',[req.body.email],async function(error, results,fields){
        if (error) return res.status(500).send(error.details[0].message);
         else {
            if (results.length > 0){
                const validPassword = await bcrypt.compare(req.body.password,results[0].password);
                if (!validPassword) return res.status(400).send('Invalid email id or password');
                const accessToken = jwt.sign({ email: req.body.email}, config.get('jwtPrivateKey'),{ expiresIn: config.tokenLife});
                const refreshToken = jwt.sign({ email: req.body.email}, config.get('refreshToken'),{ expiresIn: config.RefreshTokenLife});
                res.status(200).header({'auth-token':accessToken,'refresh-token':refreshToken}).send('logged in');
            } 
            else return res.status(400).send('Invalid email id or password')
            } 
            
        });
});


function validate(user){
    const schema = {
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255),
        password: Joi.string().required().min(5).max(255)
    }
    return Joi.validate(user,schema);   // to validate req.body when user sends registration
}
module.exports =router;