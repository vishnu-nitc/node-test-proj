const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlenght: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlenght: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlenght: 255
    },
    isVerified: { type: Boolean, default: false }
});
const User = new mongoose.model('User',userSchema);
function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email({minDomainAtoms: 2}).required().min(5).max(255),
        password: Joi.string().required().min(5).max(255)
    }
    return Joi.validate(user,schema);   // to validate req.body when user sends registration
}

exports.User = User;
exports.validate = validateUser;