const config = require('config');
module.exports = function(){
    if( !config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwt key is not defined')
    }
}
// program to check jwtkey is defined as environment variable or not , it runs at start