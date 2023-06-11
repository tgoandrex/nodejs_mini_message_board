const express = require('express');
const router = express.Router();

const Message = require('../model/Message');
const User = require('../model/User');

const homeRoute = async (req, res) => {
    let username = null;

    if(req.isAuthenticated()) {
        username = req.user.username;
    }

    const numberOfMessages = await Message.count({});

    if(numberOfMessages > 0) {
        const allMessages = await Message.find({});
        const latestMessage = await Message.findOne({}, '-_id createdAt', {sort: {createdAt: -1}});

        res.render('index', {
            title: 'Nodejs Mini Message Board',
            hasMessages: true,
            messages: allMessages,
            count: numberOfMessages,
            latest: latestMessage,
            authenticated: req.isAuthenticated(),
            username: username
        });
    } else {
        res.render('index', {
            title: 'Nodejs Mini Message Board',
            hasMessages: false,
            authenticated: req.isAuthenticated(),
            username: username
        });
    }
}

/* GET home page. */
router.get('/', async (req, res) => {
    homeRoute(req, res);
});

/* GET register page. */
router.get('/register', async (req, res) => {
    if(req.isAuthenticated()) {
        homeRoute(req, res);
    } else {
        res.render('register', {
            title: 'Register New Account',
            error: false
        });
    }
});

/* GET login page. */
router.get('/login', async (req, res) => {
    if(req.isAuthenticated()) {
        homeRoute(req, res);
    } else {
        res.render('login', {
            title: 'Log in'
        });
    }
});

/* GET edit message page. */
router.get('/edit/:id', async (req, res) => {
    Message.findById({_id: req.params.id}).then((message) => {
        if(req.isAuthenticated()) {
            if(message.username !== req.user.username) {
                res.redirect('/');
            } else {
                res.render('edit', {
                    title: 'Edit Message',
                    message: message
                });
            }
        } else {
            res.redirect('/');
        }
    })
});

/* GET delete message page. */
router.get('/delete/:id', async (req, res) => {
    Message.findById({_id: req.params.id}).then((message) => {
        if(req.isAuthenticated()) {
            if(message.username !== req.user.username) {
                res.redirect('/');
            } else {
                res.render('delete', {
                    title: 'Delete Message',
                    message: message
                });
            }
        } else {
            res.redirect('/');
        }
    })
});

/* Submit new message. */
router.post('/message', (req, res) => {
    Message.create({text: req.body.text, username: req.user.username}).then((message) => {
        User.findOneAndUpdate({ username: req.user.username }, {$push: {messages: message._id}}).then(
            res.redirect('/')
        );
    }).catch((err) => {
        console.log(err);
    });
});

/* Edit message. */
router.post('/edit/:id', (req, res) => {
    Message.findByIdAndUpdate(req.params.id, {$set: {text: req.body.text}}).then(
        res.redirect('/')
    ).catch((err) => {
        console.log(err);
    });
});

/* Delete message. */
router.post('/delete/:id', (req, res) => {
    if(req.body.text === 'YES') {
        Message.findByIdAndDelete(req.params.id).then((message) =>
            User.findOneAndUpdate({username: message.username}, {$pull: {messages: message._id}}).then(
                res.redirect('/')
            )
        ).catch((err) => {
            console.log(err);
        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;