const express = require('express');
const Joi = require('joi');
const app = express();
var connection = require('../startup/db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/',auth,async(req,res) => {
    await connection.query('select * from books' , (error, results) => {
        if (error) return res.status(500).send(error.details[0].message); 
        res.status(200).send(results);
    });
});
router.get('/:id',auth,async(req,res) => {
    await connection.query('select * from books where idbooks = ?',req.params.id , (error, results) => {
        if (error) return res.status(500).send(error.details[0].message); 
        if (results.length > 0) return res.status(200).send(results);
        res.status(400).send('requested id is not presented');
        
    });
});
router.post('/',auth,async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    var book = {
        "booksname" :req.body.booksname,
        "booksauthor" :req.body.booksauthor
    }
    await connection.query('INSERT INTO books SET ?',book, function(error, results, fields) {
        if (error) return res.status(500).send(error.details[0].message); 
        else {
            res.status(200).send(`${results.insertId}`);
        }
    });
})

router.put('/:id',auth,async(req, res) => {
    const {error} = validate(req.body);
    if ( error ) return res.status(400).send(error.details[0].message);
    await connection.query('select * from books where idbooks = ?',req.params.id , (error, results) => {
        if (error) return res.status(500).send(error.details[0].message); 
        if (results.length === 0) return res.status(400).send('requested id is not presented');
    });
    var book = {
        "booksname" :req.body.booksname,
        "booksauthor" :req.body.booksauthor
    }
    await connection.query('UPDATE books SET ? WHERE idbooks = ? ',[book,req.params.id], function(error, results) {
        if (error) return res.status(500).send(error.details[0].message); 
        else {
            res.status(200).send(`${results.affectedRows}`);
        }
    });
});
router.delete('/:id',auth, async(req,res)=> {
    await connection.query('select * from books where idbooks = ?',req.params.id , (error, results) => {
        if (error) return res.status(500).send(error.details[0].message); 
        if (results.length === 0) return res.status(400).send('requested id is not presented');
    });
    await connection.query( 'DELETE FROM BOOKS WHERE idbooks=?',req.params.id,function(error, results){
        if (error) return res.status(500).send(error.details[0].message); 
        else {
            res.status(200).send(`${results.affectedRows}`);
        }
    });

});

function validate(book){
    const schema = {
        booksname: Joi.string().min(3).max(255).required(),
        booksauthor: Joi.string().required().min(3).max(50)
    }
    return Joi.validate(book,schema);   // to validate req.body when user sends registration
}

module.exports = router;

    

