const express = require('express');
const router = express.Router();

const { Message } = require('../model/Message');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const allMessages = await Message.find({});

    res.render('index', {
        title: 'Nodejs Mini Message Board',
        messages: allMessages
    });
});

/* GET new message. */
router.get('/new', function(req, res, next) {
    res.render('form', { title: 'New Message' });
});

/* POST new message. */
router.post('/new', function(req, res, next) {
    const message = new Message({
        text: req.body.text,
        user: req.body.user
    });

    try {
        message.save();
        res.redirect('/');
    } catch(e) {
        console.error(e);
    }
});

module.exports = router;