const express = require('express');
const router = express.Router();

const { Message } = require('../model/Message');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const allMessages = await Message.find({});
    const numberOfMessages = await Message.count({});
    const latestMessage = await Message.findOne({}, '-_id createdAt', {sort: {createdAt: -1}});

    res.render('index', {
        title: 'Nodejs Mini Message Board',
        messages: allMessages,
        count: numberOfMessages,
        latest: latestMessage.createdAt
    });
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