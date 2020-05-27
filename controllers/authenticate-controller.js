var Cryptr = require('cryptr');
cryptr = new Cryptr('MyTotalySecretKey');
var connection = require('../config');
const jwt =require('jsonwebtoken')

const accessTokenSecret = "YourSecretCode";
const refresTokenSecret = "RefreshSecretToken";
refreshTokens = []
module.exports.authenticate = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    connection.query('SELECT * FROM users where email = ?',[email], function(error, results,fields){
        if (error){
            res.json({
                status:false,
                message:"there is some error with query"
            })
        } else {
            
            if (results.length > 0){
                decryptedString = cryptr.decrypt(results[0].password);
                if (password == decryptedString) {
                    const accessToken = jwt.sign({ email: email}, accessTokenSecret, { expiresIn : '1m'});
                    const refreshToken = jwt.sign( { email: email}, refresTokenSecret, { expiresIn: '3m'});
                    refreshTokens.push(refreshToken)
                    res.json({
                        status:true,
                        message:"succesfully authenticated",
                        accessToken:accessToken,
                        refreshToken:refreshToken

                    })
                } else {
                    res.json({
                        status:false,
                        message:"Email and password doesn't match"
                    });
                }
            } else {
                res.json({
                    status:false,
                    message:"Email doesn't exists"
                });
            }
        }
    });
}

module.exports.token = function(req, res){
    //console.log(req.body);
    const { token } = req.body;
    //console.log(token);
    if ( !token ){
        return res.sendStatus(401);
    }
    if (!refreshTokens.includes(token)){
        console.log(refreshTokens,token);
        return res.sendStatus(403);
    }
    jwt.verify(token, refresTokenSecret, (err, results) => {
        console.log(err);
        if (err) {
            return res.sendStatus(403);
        }
        const accessToken = jwt.sign({ email: results.email}, accessTokenSecret, { expiresIn : '1m'});
        const refreshToken = jwt.sign( { email: results.email}, refresTokenSecret, { expiresIn: '2m'});
        refreshTokens.push(refreshToken)
                    res.json({
                        status:true,
                        message:"succesfully authenticated",
                        accessToken:accessToken,
                        refreshToken:refreshToken

                    });
    })
}

module.exports.logout =  (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t != token);
    console.log(token+"\n"+refreshTokens);
    res.send("logout successfull")
}