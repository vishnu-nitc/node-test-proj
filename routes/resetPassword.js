const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User} = require('../model/user');

router.post('/', async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if ( !user ) return res.status(400).send('Invalid username or password');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('invalid username or password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.new_password,salt);
    await user.save();
    res.status(200).send('password is chnaged');
});

function validate(user){
    const schema = {
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255),
        password: Joi.string().required().min(5).max(255),
        new_password: Joi.string().required().min(5).max(255)
    }
    return Joi.validate(user,schema);   // to validate req.body when user sends registration
}
module.exports =router;