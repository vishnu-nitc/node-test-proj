const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlenght: 255
    },
    otpToken: {
        type: String,
        required: true,
        minlength: 5,
        maxlenght: 255
    },
    createdAt: {type: Date, required:true, default: Date.now, expires: 1000}
});
const Otp = new mongoose.model('Otp',otpSchema);
exports.Otp = Otp;