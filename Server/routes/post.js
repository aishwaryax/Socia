const express = require('express')
const router = express.Router()

const { check, body } = require('express-validator')

const postController = require('../controllers/post')
const authController = require('../controllers/auth')
const userController = require('../controllers/user')



//GET
// router.get('/', authController.requiresLogin, postController.getPosts)
router.get('/', postController.getPosts)



// POST
router.post('/',
    authController.requiresLogin,
    postController.createPost)


router.get('/:postId', postController.getPost)


//DELETE
router.delete('/:postId',
    authController.requiresLogin,
    postController.ownsPost,
    postController.deletePost)

router.put('/like', authController.requiresLogin, postController.likePost)
router.put('/unlike', authController.requiresLogin, postController.unlikePost)

router.put('/comment', postController.comment)
router.put('/uncomment', postController.uncomment)

router.put('/:postId',
    authController.requiresLogin,
    postController.ownsPost,
    postController.updatePost)


router.get('/:postId/photo', postController.getPostPhoto)


router.param('userId', userController.userById)
router.param('postId', postController.postById)

router.get('/by/:userId', postController.getPostsByUser)

module.exports = router