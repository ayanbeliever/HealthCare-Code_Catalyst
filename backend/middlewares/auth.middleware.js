const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({message: 'Authentication error'}); // If token is invalid, return Forbidden
        req.user = user;
        next(); // If token is valid, proceed to the next middleware/route handler
    });
};

module.exports = authenticateToken;