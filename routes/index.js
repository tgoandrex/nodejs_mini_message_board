var express = require('express');
var router = express.Router();

const messages = [
    {
        text: "Hi there!",
        user: "Amando",
        added: new Date()
    },
    {
        text: "Hello World!",
        user: "Charles",
        added: new Date()
    }
];

/* GET home page. */
router.get('/', function(req, res, next) {
     res.render('index', { title: 'Nodejs Mini Message Board', messages: messages });
});

/* GET new message. */
router.get('/new', function(req, res, next) {
    res.render('form', { title: 'New Message' });
});

/* POST new message. */
router.post('/new', function(req, res, next) {
    const messageUser = req.body.author;
    const messageText = req.body.message;

    messages.push({text: messageText, user: messageUser, added: new Date()});

    res.redirect("/");
});

module.exports = router;