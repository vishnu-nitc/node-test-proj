const express = require('express');
const router = express.Router();
const {Token}= require('../model/emailToken')
const {User} = require('../model/user');

router.get('/:id',async(req,res) => {
    const token = await Token.findOne({token: req.params.id});
    if ( !token ) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
    const user = await User.findOne({_id:token._userId});
    if (!user ) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
    if( user.isVerified)  return res.status(400).send({ type: 'already-verified', msg:'This user is already verified'});
    user.isVerified = true;
    await user.save();
    res.status(200).send("The account has been verified. Please log in.");
});

module.exports =router;
