require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.jwtCheck = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).send('Invalid token');
            res.username = decoded.username;
            res.userId = decoded.userId;
            res.outLookSubscriptionId = decoded?.outLookSubscriptionId || null;
            next();
        });
    } else {
        return res.status(401).send('No token provided');
    }

}