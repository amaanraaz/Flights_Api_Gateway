const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ServerConfig} = require('../../config');
const { JWT_SECRET } = require('../../config/server-config');

function checkPassword(plainPassword,encryptedPassword){
    console.log(plainPassword,encryptedPassword);
    try {
        return bcrypt.compareSync(plainPassword,encryptedPassword);
    } catch (error) {
        throw error;
    }
}
function createToken(input){
    try {
        return jwt.sign(input, ServerConfig.JWT_SECRET, {expiresIn: ServerConfig.JWT_EXPIRY});
    } catch (error) {
        throw error;
    }
}

function verifyToken(token){
    const res = jwt.verify(token,JWT_SECRET);
    return res;
}
module.exports = {
    checkPassword,
    createToken,
    verifyToken
}