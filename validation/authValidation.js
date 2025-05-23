const joi = require('joi')

const signupValidation = (req, res, next) => {
    const Schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(5).max(100).required(),
    })
const {error} = Schema.validate(req.body)
    if(error){
        return res.status(401).json({message: 'invalid email and password', error})
    }
    next()
}

const loginValidation = (req, res, next) => {
    const Schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(5).max(100).required(),
    })
    const {error} = Schema.validate(req.body)
    if(error){
        return res.status(401).json({message: 'invalid email and password', error})
    }
    next()
}

module.exports = {signupValidation, loginValidation}