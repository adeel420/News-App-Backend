const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    user: {
        type: mongoose.ObjectId,
        ref: "user"
    },
    news: {
        type: mongoose.ObjectId,
        ref: "news",
    }
}, {timestamps: true})

const Comment = mongoose.model('comment', commentSchema)
module.exports = Comment