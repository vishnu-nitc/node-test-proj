const nodemailer = require('nodemailer');
const config = require('config');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.get('user_id'),
        pass: config.get('passwd')
    }
});
exports.transporter = transporter;