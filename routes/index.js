const express = require('express');
const router = express.Router();

const Message = require('../model/Message');

/* GET home page. */
router.get('/', async (req, res) => {
    const allMessages = await Message.find({});
    const numberOfMessages = await Message.count({});
    const latestMessage = await Message.findOne({}, '-_id createdAt', {sort: {createdAt: -1}});

    let username = null;

    if(req.isAuthenticated()) {
        username = req.user.username;
    }
    
    res.render('index', {
        title: 'Nodejs Mini Message Board',
        messages: allMessages,
        count: numberOfMessages,
        latest: latestMessage.createdAt,
        authenticated: req.isAuthenticated(),
        username: username
    });
});

/* GET register page. */
router.get('/register', async (req, res) => {
    if(req.isAuthenticated()) {
        const allMessages = await Message.find({});
        const numberOfMessages = await Message.count({});
        const latestMessage = await Message.findOne({}, '-_id createdAt', {sort: {createdAt: -1}});

        res.render('index', {
            title: 'Nodejs Mini Message Board',
            messages: allMessages,
            count: numberOfMessages,
            latest: latestMessage.createdAt,
            authenticated: req.isAuthenticated(),
            username: req.user.username
        });
    } else {
        res.render('register', {
            title: 'Register New Account',
        });
    }
});

/* GET login page. */
router.get('/login', async (req, res) => {
    if(req.isAuthenticated()) {
        const allMessages = await Message.find({});
        const numberOfMessages = await Message.count({});
        const latestMessage = await Message.findOne({}, '-_id createdAt', {sort: {createdAt: -1}});

        res.render('index', {
            title: 'Nodejs Mini Message Board',
            messages: allMessages,
            count: numberOfMessages,
            latest: latestMessage.createdAt,
            authenticated: req.isAuthenticated(),
            username: req.user.username
        });
    } else {
        res.render('login', {
            title: 'Log in',
        });
    }
});

/* Submit new message. */
router.post('/new', (req, res) => {
    const message = new Message({
        text: req.body.text,
        user: req.body.user
    });

    try {
        message.save();
        res.redirect('/');
    } catch(err) {
        res.send(err);
    }
});

module.exports = router;