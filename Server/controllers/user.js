const User = require('../models/user')
const _ = require('lodash')
const formidable = require('formidable');
const fs = require('fs')


exports.getUser = (req, res) => {
    req.profile.hashedPassword = undefined;
    return res.json({ user: req.profile });
}

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(401).json({ message: error })
        }
        res.status(200).json({ users })
    }).select('_id name email created updated')
}

exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(401)
                .json({
                    error: 'Request could not be handled'
                })
        }

        let user = req.profile
        user = _.extend(user, fields)
        user.updated = Date.now()
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }
        user.save((err, updatedUser) => {
            if (err) {
                return res.status(401).json({
                    message: 'User could not be created'
                })
            }
            updatedUser.hashedPassword = undefined
            res.status(200).json({ message: 'Post created', updatedUser })
        })
    })
}

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.profile._id)
        .then(user => {
            user.hashedPassword = undefined
            return res.status(200).json({ message: 'User deleted', user: user })
        })
        .catch(err => {
            return res.status(401).json({ error: 'User could not be deleted' })
        })
}

exports.userById = (req, res, next, id) => {
    User.findById(id)
        .populate('followers', '_id name about')
        .populate('following', '_id name about')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: 'User not found' })
            }
            req.profile = user
            next()
        })
}

exports.hasAuthorization = (req, res, next) => {
    console.log("here!")
    const authorized = req.auth && req.profile._id.toString() === req.auth._id.toString()
    if (!authorized) {
        return res.status(403).json({ message: 'User is not authorized to perform this action', })
    }
    console.log("now here!")
    next()
}

exports.getProfilePhoto = async(req, res, next) => {
    let user = await User.findById(req.params.userId)
    if (user.photo) {
        res.set("Content-Type", user.photo.contentType)
        return res.send(user.photo.data)
    }
    next()
}

//add following add follower

exports.addFollowing = (req, res, next) => {
    console.log(req.body)
    User.findByIdAndUpdate(req.body.userId, {
            $push: { following: req.body.followId }
        })
        .exec((err, updatedUser) => {
            if (!err || updatedUser) {
                next()
            } else {
                console.log(err)
                return res.status(401).json({ error: 'Could not add as follower' })
            }

        })
}

exports.addFollower = (req, res, next) => {
    User.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.body.userId },
        }, { new: true })
        .populate('followers', '_id name')
        .populate('following', '_id name')
        .exec()
        .then(updatedUser => {
            updatedUser.hashedPassword = undefined
            return res.status(200).json({ message: 'Added follower', user: updatedUser })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Could not add as follower' })
        })
}

//unfollow


exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, {
            $pull: { following: req.body.unfollowId }
        })
        .then(updatedUser => {
            next()
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Could not add as follower' })
        })
}

exports.removeFollower = (req, res, next) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
            $pull: { followers: req.body.userId },
        }, { new: true })
        .populate('followers', '_id name')
        .populate('following', '_id name')
        .exec()
        .then(updatedUser => {
            updatedUser.hashedPassword = undefined
            return res.status(200).json({ message: 'Removed follower', user: updatedUser })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Could not remove follower' })
        })
}

//find people

exports.findPeople = (req, res, next) => {
    let following = req.profile.following
    following.push(req.profile._id)
    User.find({ _id: { $nin: following } })
        .select('_id name')
        .then(users => {
            return res.status(200).json({ message: 'Success', users })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Could not find people' })
        })

}