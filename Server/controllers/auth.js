const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

const { validationResult } = require('express-validator')

exports.signup = async(req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0], message: 'Could not sign in' })
    }
    const user = await new User(req.body)
    return res.status(200).json({ user: user, message: 'User created successfully' })
}

exports.login = (req, res, next) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'User not found' })
        }
        user.authenticate(password)
            .then(authenticated => {
                if (!authenticated) {
                    return res.status(401).json({ error: 'Email and password do not match' })
                }
                const token = jwt.sign({
                        email: user.email,
                        _id: user._id
                    },
                    process.env.JWT_TOKEN, { expiresIn: '2h' })
                res.cookie('t', token, { expire: new Date() + 9999 })
                req.profile = user
                const { name, email, _id } = user
                return res.status(200).json({ token: token, id: _id, name: name, email: email })
            })
    })
}


exports.logout = (req, res, next) => {
    res.clearCookie('t')
    return res.status(200).json({ message: 'Sign out successful' })
}

exports.requiresLogin = expressJwt({
    secret: process.env.JWT_TOKEN,
    userProperty: 'auth'
})