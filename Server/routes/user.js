const express = require('express')
const router = express.Router()

const authController = require('../controllers/auth')
const userController = require('../controllers/user')

router.put('/follow', authController.requiresLogin, userController.addFollowing, userController.addFollower)
router.put('/unfollow', authController.requiresLogin, userController.removeFollowing, userController.removeFollower)
router.get('/', userController.allUsers)
router.get('/:userId', userController.getUser)
router.get('/:userId/profile', userController.getProfilePhoto)
router.get('/:userId/find', userController.findPeople)
router.put('/:userId',
    authController.requiresLogin,
    userController.hasAuthorization,
    userController.updateUser)
router.delete('/:userId', userController.deleteUser)

router.param('userId', userController.userById)



module.exports = router