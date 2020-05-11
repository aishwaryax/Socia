const fs = require('fs')
const formidable = require('formidable')
const _ = require('lodash')

const Post = require('../models/post')


exports.postById = (req, res, next) => {
    Post.findById(req.params.postId)
        .select('_id title body postedBy created likes comments')
        .populate('createdBy', 'name _id')
        .populate('comments.postedBy', 'name _id')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(401).json({ error: 'Post could not be fetched' })
            }
            req.post = post
            next()
        })
}

exports.getPost = (req, res) => {
    return res.status(200).json({ post: req.post })
}

exports.getPosts = (req, res) => {
    Post.find()
        .select('_id postedBy title body created likes')
        .populate('createdBy', '_id name')
        .then(posts => {
            res.json({
                posts: posts
            })
        })
}


exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(401)
                    .json({
                        error: 'Request could not be handled'
                    })
            }
            console.log(fields)
            let post = new Post(fields)
            if (files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path)
                post.photo.contentType = files.photo.type
            }
            post.save((err, createdPost) => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({
                        message: 'Post could not be created'
                    })
                }
                res.status(200).json({ message: 'Post created', createdPost })
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Could not create post' })
        })
}

exports.ownsPost = async(req, res, next) => {
    const post = await Post.findById(req.params.postId)
    const ownsPost = req.auth._id.toString() === post.createdBy.toString()
    if (!ownsPost) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    next()
}

exports.deletePost = (req, res) => {
    Post.findByIdAndRemove(req.params.postId, (err, post) => {
        if (err || !post) {
            return res.status(401).json({ error: 'Could not delete post' })
        }
        return res.status(200).json({
            message: 'Post deleted',
            post: post
        })
    })
}


exports.updatePost = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(401)
                    .json({
                        error: 'Request could not be handled'
                    })
            }
            let post = req.post
            post = _.extend(post, fields)
            if (files.photo) {
                post.photo.data = fs.readFileSync(files.photo.path)
                post.photo.contentType = files.photo.type
            }
            post.save((err, updatedPost) => {
                if (err) {
                    console.log(err)
                    return res.status(401).json({
                        message: 'Post could not be created'
                    })
                }
                console.log('ouched')
                console.log(updatedPost)
                return res.status(200).json({ message: 'Post updated', updatedPost })
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Could not create post' })
        })
}

exports.getPostPhoto = async(req, res, next) => {
    let post = await Post.findById(req.params.postId)
    if (post.photo) {
        res.set("Content-Type", post.photo.contentType)
        return res.send(post.photo.data)
    }
    next()
}

exports.getPostsByUser = (req, res) => {
    Post.find({ createdBy: req.params.userId })
        .select('_id title body createdBy created')
        .then(posts => {
            return res.status(200).json({ posts: posts })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Could not fetch posts' })
        })
}

exports.likePost = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.body.userId }
        }, { new: true })
        .exec()
        .then(post => {
            console.log(post)
            return res.status(200).json({ post: post, message: 'Post liked' })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Couldnt like the post :(' })
        })
}

exports.unlikePost = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
            $pull: { likes: req.body.userId }
        }, {
            new: true
        })
        .exec()
        .then(post => {
            console.log(post)
            return res.status(200).json({ post: post, message: 'Post unliked' })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Couldnt unlike the post :(' })
        })
}

exports.comment = (req, res) => {
    let comment = req.body.comment
    Post.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('createdBy', '_id name')
        .exec()
        .then(post => {
            console.log(post)
            return res.status(200).json({ post: post, message: 'Commented on the post' })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Couldnt like the post :(' })
        })
}

exports.uncomment = (req, res) => {
    let comment = req.body.comment
    Post.findByIdAndUpdate(req.body.postId, {
            $pull: { comments: comment }
        }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('createdBy', '_id name')
        .exec()
        .then(post => {
            return res.status(200).json({ post: post, message: 'Unommented on the post' })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({ error: 'Couldnt like the post :(' })
        })
}