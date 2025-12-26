const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT
const REFRESH_KEY = process.env.REFRESH

const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
}
const generateRefreshToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, REFRESH_KEY, { expiresIn });
}

module.exports = {
    generateToken,
    verifyToken,
    generateRefreshToken
};