const express = require('express');
const router = express.Router();

const { 
    getMessages 
} = require('../controllers/messageController');
const { getAllRooms, getRoom, createRoom } = require('../controllers/roomController');

const homeRoute = async (req, res) => {
    const roomTitle = 'Home';
    const messages = await getMessages(roomTitle);
    const rooms = await getAllRooms();
    const username = req.isAuthenticated() ? req.user.username : null;

    const room = await getRoom('6731505afd8933c90f494a47'); /* _id for home room auto generated by MongoDB.
    This number will change if the home room is ever deleted */
    if (!room) {
        await createRoom('Home', 'ADMIN');
    }
    
    res.render('index', {
        title: 'Nodejs Mini Message Board',
        hasMessages: messages.length > 0,
        messages,
        count: messages.length,
        latest: messages[0],
        roomTitle: roomTitle,
        authenticated: req.isAuthenticated(),
        username,
        rooms
    });
};

router.get('/', async (req, res) => {
    await homeRoute(req, res);
});

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) {
        homeRoute(req, res);
    } else {
        res.render('register', { title: 'Register New Account', error: false });
    }
});

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        homeRoute(req, res);
    } else {
        res.render('login', { title: 'Log in' });
    }
});

module.exports = router;