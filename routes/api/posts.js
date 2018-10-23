const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

// Validations
const validatePostInput = require('../../validation/post');

// @route  GET api/posts/test
// @desc   Tests get route
// @access public
router.get('/test', (req,res) => res.json({msg: "Posts Wroks"}));

// @route  GET api/posts
// @desc   Get Posts
// @access Public
router.get('/', (req,res) => {
    Post.find().sort({ date: -1 }).then(posts => {
        res.json(posts);
    }).catch(err => res.status(400).json({nopostfound: 'No se encontraron los posts'}));
})

// @route  GET api/posts/:id
// @desc   Get Post by id
// @access Public
router.get('/:id', (req,res) => {
    Post.findById(req.params.id).then(post => {
        res.json(post);
    }).catch(err => res.status(400).json({nopostfound: 'No se encontró el post'}));
})

// @route  Post api/posts
// @desc   Create post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req,res) => {

    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

// @route  Delete api/posts/:id
// @desc   Delete Post by id
// @access Private
router.delete('/:id', passport.authenticate('jwt',{ session: false }),  (req,res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id).then(post => {
            // Check for post owner
            if (post.user.toString() !== req.user.id){
                return res.status(401).json({ notauthorized: 'Usuario no autorizado' });
            }

            //Delete
            post.remove().then(() => {
                res.json({success: true})
            })
        }).catch(err => res.status(404).json({ postnotfound: 'No se encontró el post' }));
    })
})

// @route  Post api/posts/like/:id
// @desc   Like Post
// @access Private
router.post('/like/:id', passport.authenticate('jwt',{ session: false }),  (req,res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id).then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
                return res.status(400).json({ alreadyliked: 'El usuario ya le habia dado like' })
            }

            // Add user id to like array
            post.likes.unshift({user: req.user.id});
            
            post.save().then(post => res.json(post));
        })
    }).catch(err => res.status(404).json({ postnotfound: 'No se encontró el post' }));
})

// @route  Post api/posts/unlike/:id
// @desc   Unlike Post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt',{ session: false }),  (req,res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id).then(post => {
            if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                return res.status(400).json({ notliked: 'El usuario no le habia dado like' })
            }

            // Get remove index
            const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
            
            // Splice out of array
            post.likes.splice(removeIndex, 1);

            // Save
            post.save().then(post => res.json(post));
        })
    }).catch(err => res.status(404).json({ postnotfound: 'No se encontró el post' }));
})

// @route  Post api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }
    
    Post.findById(req.params.id).then(post => {
        const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        }

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post)).catch(err => res.status(400).json({postnotfound: 'No se encontró el post'}));

    }).catch(err => res.status(404).json({ post: 'No se encontró el post' }));
})

// @route  Delete api/posts/comment/:id/:comment_id
// @desc   Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    
    Post.findById(req.params.id).then(post => {
        // Check to see if comment exists
        if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
            return res.status(404).json({ commentnotexists: 'No existe el comentario' });
        }
        
        // Get remove index
        const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
        
        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));

    }).catch(err => res.status(404).json({ postnotfound: 'No se encontró el post' }));
})

module.exports = router;