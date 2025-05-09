const express = require('express')
const User = require('../models/user')
const router = express.Router()
const {jwtAuthMiddleware, isAdmin, generateToken} = require('./../middleware/jwt')
const {signupValidation, loginValidation} = require('./../validation/authValidation')
const {sendVerificationCode, welcomeCode} = require('./../middleware/email')

router.post('/signup', signupValidation, async (req, res) => {
    try{
        const {name, email, password} = req.body
        const newData = await User.findOne({email})
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const data = new User({name, email, password, verificationCode})
        const response = await data.save()
        sendVerificationCode(email, verificationCode)
        const token = generateToken(response.email)
        res.status(200).json({response: response, token: token})
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})

router.post('/verify-email', async (req, res) => {
    try{ 
        const {code} = req.body
        const user = await User.findOne({verificationCode: code})
        user.isVerified = true
        user.verificationCode = undefined
        const response = await user.save()
        welcomeCode(user.email, user.name)
        res.status(200).json({message: 'ok'})
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'internal server error'})
    }
})

router.post('/login', loginValidation, async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        
        // Check if user exists and password is correct
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the user's email is verified
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account is not verified. Please verify your email to log in.' });
        }

        // Generate a token for the user
        const payload = { id: user.id, email: user.email };
        const token = generateToken(payload);

        // Send the token in response
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/name', jwtAuthMiddleware, async (req, res) => {
    try {
        const id = req.user.id;  // Access user ID from req.user
        const data = await User.findById(id);  // Find the user by ID in the database

        if (!data) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ name: data.name, role: data.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/demo', jwtAuthMiddleware, isAdmin, (req, res) => {
    res.send('Hi, I am Admin')
})

module.exports = router