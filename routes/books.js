const express = require('express');
const Joi = require('joi');
const app = express();
const{Book,validate} = require('../model/book');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');
const validateId = require('../middleware/validateObjectid')

router.get('/',auth,async(req,res) => {
    const books = await  Book.find().sort('booksname');
    res.status(200).send(books);
});
router.get('/:id',[auth,validateId],async(req,res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send('requested id is not presented'); 
    res.send(book);
        
});
router.post('/',auth,async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    let  book = new Book({
        "booksname" :req.body.booksname,
        "booksauthor" :req.body.booksauthor
    })
    book =await book.save();
    res.status(200).send(book);
        
})

router.put('/:id',[auth,validateId],async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    const book = await Book.findByIdAndUpdate(req.params.id,
                        {"booksname" :req.body.booksname,
                        "booksauthor" :req.body.booksauthor}, { new:true});
    if(!book) return res.status(404).send('requested id is not presented'); 
    res.send(book); 
    
});
router.delete('/:id',[auth,validateId], async(req,res)=> {
    const book = await Book.findByIdAndRemove(req.params.id);
    if(!book) return res.status(404).send('requested id is not presented'); 
    res.send(book);

});

module.exports = router;

    

