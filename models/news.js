const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    image: {
        type: String,
    },
    title: {
        type: String,    
    },
    description: {
        type: String,
    },
    category: {    
        type: mongoose.ObjectId,
        ref: 'category'
    },
    comment: {
        type: String
    },
    user: {
        type: mongoose.ObjectId,
        ref: "user"
    }
})

const Image = mongoose.model('news', newsSchema)
module.exports = Image