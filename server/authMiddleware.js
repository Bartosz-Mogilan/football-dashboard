const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'Access token missing'});
    }

    jwt.verify(token, secretKey, (err, user) => {
        if(err) {
            return res.status(403).json({ error: 'Invalid token'});
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;

