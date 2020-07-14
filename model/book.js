const Joi = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    booksname: {
        type: String,
        required: true,
        minlength: 5,
        maxlenght: 255
    },
    booksauthor: {
        type: String,
        required: true,
        minlength: 5,
        maxlenght: 255
    }
});

const Book = new mongoose.model('Book',bookSchema);
function validate(book){
    const schema = {
        booksname: Joi.string().min(3).max(255).required(),
        booksauthor: Joi.string().required().min(3).max(50)
    }
    return Joi.validate(book,schema);   // to validate req.body when user sends registration
}

exports.Book = Book;
exports.validate = validate;