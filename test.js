const {Token}=require('./model/emailToken');
const {User} = require('./model/user')
token = Token.findOne({token: "d50449fe6dc10342f16be88a7823f204"});
console.log(token);

