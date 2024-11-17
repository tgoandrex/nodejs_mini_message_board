const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');

const { 
    getMessage, createMessage, updateMessage, deleteMessage 
} = require('../controllers/messageController');
const { getRoom } = require('../controllers/roomController');

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const message = await getMessage(req.params.id);
    if (message.username === req.user.username) {
        res.render('./message/edit', { title: 'Edit Message', message });
    } else {
        res.redirect('/');
    }
});

router.get('/delete/:id', isAuthenticated, async (req, res) => {
    const message = await getMessage(req.params.id);
    if (message.username === req.user.username) {
        res.render('./message/delete', { title: 'Delete Message', message });
    } else {
        res.redirect('/');
    }
});

router.post('/message', isAuthenticated, async (req, res) => {
    const { text, room } = req.body;
    const username = req.user.username;
    const newMessage = await createMessage(text, username, room);
    const roomDoc = await getRoom(newMessage.room);
    res.redirect(`/room/${roomDoc._id}`);
});

router.post('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const message = await getMessage(req.params.id);
        await updateMessage(req.params.id, req.body.text);

        res.redirect(`/room/${message.room._id}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error: Message or Room not found");
    }
});

router.post('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const message = await getMessage(req.params.id);
        if (req.body.text === 'YES') {
            await deleteMessage(message.id, message.username, message.room._id);

            res.redirect(`/room/${message.room._id}`);
        } else {
            res.redirect(`/room/${message.room._id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error: Message or Room not found");
    }
});

module.exports = router;