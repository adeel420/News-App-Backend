const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String
}, {timestamps: true})

userSchema.pre('save', async function (next) {
    const user = this
    if(!user.isModified('password'))
        return next()
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
        next()
    }catch(err){
        return next(err)
    }
})

userSchema.methods.comparePassword = async function (candidate) {
    try{
        const isMatch = await bcrypt.compare(candidate, this.password)
        return isMatch
    }catch(err){
        throw err
    }
}
 
const User = mongoose.model('user', userSchema)
module.exports = User