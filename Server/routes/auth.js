const express = require('express')
const router = express.Router()

const { check, body } = require('express-validator')

const authController = require('../controllers/auth')
const userController = require('../controllers/user')

const User = require('../models/user')

//POST
router.post('/signup', [
    check('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter valid email')
    .custom((val, { req }) => {
        return User.findOne({ email: val })
            .then(userDocument => {
                if (userDocument) {
                    return Promise.reject('Email already exists! Please pick another or log in')
                }
            })
    }),
    body('password')
    .isLength({ min: 6, max: 20 })
    .trim()
    .withMessage('Please enter a password between length 5 to 20'),
    body('confirmPassword').custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error('Passwords should match!')

        }
        return true
    })
], authController.signup)

router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.param('userId', userController.userById)


module.exports = router