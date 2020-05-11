const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 150
    },
    body: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 2000
    },
    created: {
        type: Date,
        default: Date.now
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        created: {
            type: Date,
            default: Date.now()
        }
    }]
})

module.exports = mongoose.model('Post', postSchema);