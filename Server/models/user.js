const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    about: {
        type: String
    },
    updated: Date,
    salt: String,
    followers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]

})

userSchema.virtual('password')
    .set(function(password) {
        this._password = password
        this.encryptPassword(password)
            .then(result => {
                this.hashedPassword = result
                this.save()
                return this
            })
    })
    .get(function() {
        return this._password
    })

userSchema.methods = {
    authenticate: function(password) {
        console.log(password, '2: ', this.hashedPassword)
        return bcrypt.compare(password, this.hashedPassword)
    },
    encryptPassword: function(password) {
        if (!password)
            return ''
        try {
            return bcrypt.hash(password, 10)
        } catch (err) {
            return ''
        }
    }
}

module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('User', userSchema);