const jwt = require('jsonwebtoken')
const User = require('../models/user')

const jwtAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: Missing authorization header' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach userId to req.user if available
        req.user = decoded.userId ? { id: decoded.userId } : decoded;

        next();  // Move to the next middleware/route handler
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


const generateToken = (userData) => {
    return jwt.sign(userData, process.env.SECRET_KEY)
}

const isAdmin = async (req, res, next) => {
    try{
        const {email} = req.body
        const user = await User.findOne({email})
        if(user.role !== 1){
            return res.status(401).json({message: 'no admin access'})
        }
            next()
        
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
}

module.exports = {jwtAuthMiddleware, isAdmin, generateToken}