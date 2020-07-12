const express = require('express');
const jwt =require('jsonwebtoken');
const config = require('config');
const router = express.Router();

router.post('/',  async(req, res) => {
    const token = req.header('refresh-token');
    if ( !token ) return res.status(401).send('No access token. No refresh token is provided');
    try {
        const decoded = jwt.verify(token, config.get('refreshToken'));
        const accessToken = jwt.sign({ email: req.body.email}, config.get('jwtPrivateKey'),{ expiresIn: config.tokenLife});
        const refreshToken = jwt.sign({ email: req.body.email}, config.get('refreshToken'),{ expiresIn: config.RefreshTokenLife});
        res.status(200).header({'auth-token':accessToken,'refresh-token':refreshToken}).send('new token');
    }
    catch (ex) {
        res.status(400).send('invalid token');
    }

});
module.exports = router;