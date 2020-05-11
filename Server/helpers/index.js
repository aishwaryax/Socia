const {check, validationResult} = require('express-validator')

exports.createPostValidator = (req, res, next) => {
    check('title', 'write a title').notEmpty()
    check('title', 'title should be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    })
    check('body', 'write a body').notEmpty()
    check('body', 'body should be between 4 to 2000 characters').isLength({
        min: 4,
        max: 2000
    })

    const errors = validationErrors()

    if(errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next()
}

exports.signUpValidator = (req, res, next) => {
    check('name', 'Name is required').notEmpty()
    check('email', 'Email is required and should be between 3-32 charaters').notEmpty()
    .matches(/.+\@.+\..+/)
    .withMessage('email must contain @')
    .isLength({
        min: 3,
        max: 32
    })
    check('password', 'Email is required and should be between 6-20 charaters').notEmpty()
    .matches(/\d/)
    .withMessage('password must contain at leats one digit')
    .isLength({
        min: 6,
        max: 20
    })

    const errors = validationResult()

    if(errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({error: firstError})
    }
    next()
}
