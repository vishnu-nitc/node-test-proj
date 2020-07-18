const Joi = require('joi');
const mongoose = require('mongoose');
const {User} = require('./user')

const tokenSchema = new mongoose.Schema({
    _userId: {type: mongoose.Schema.Types.ObjectId, required:true, ref: User},
    token: {type: String, required: true},
    createdAt: {type: Date, required:true, default: Date.now, expires: 45000}
});
const Token = new mongoose.model('Token',tokenSchema);


exports.Token = Token;
