const express = require('express');

const app = express();
var connection = require('./config');

const jwt = require('jsonwebtoken');
const accessTokenSecret = "YourSecretCode";




module.exports.books = function(req, res) {
        const authHeader = req.headers.authorization;
        //console.log(authHeader);
        if ( authHeader ) {
            const token = authHeader.split(' ')[1];
            //console.log(token);
            jwt.verify(token, accessTokenSecret, (err, result) => {
                console.log(err);
                if (err) {
                    //console.log("token");
                    return res.sendStatus(403);
                }
                
                connection.query('select * from books' , (error, results) => {
                    if (error) {
                        res.json({
                            status:false,
                            message:"thereare some error with query"
                        })
                    } else {
                        res.json({
                            status:true,
                            data:results
                        })
                    }
                })
                
            })
        } else {
            return res.sendStatus(403);
        }
    };
    

