const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');

const { getMessages } = require('../controllers/messageController');
const { getAllRooms, getRoom, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

router.get('/room/:id', isAuthenticated, async (req, res) => {
    const username = req.isAuthenticated() ? req.user.username : null;
    const rooms = await getAllRooms();
    const room = await getRoom(req.params.id);

    if (!room || room.title === 'Home') {
        return res.redirect('/');
    }

    const messages = await getMessages(room.title);
    
    res.render('index', {
        title: room.title,
        hasMessages: messages.length > 0,
        messages,
        count: messages.length,
        latest: messages[0],
        roomTitle: room.title,
        authenticated: req.isAuthenticated(),
        username,
        rooms
    });
});

router.get('/edit/room/:id', isAuthenticated, async (req, res) => {
    const room = await getRoom(req.params.id);
    if (room.username === req.user.username) {
        res.render('./room/edit', { title: 'Edit Room', room });
    } else {
        res.redirect('/');
    }
});

router.get('/delete/room/:id', isAuthenticated, async (req, res) => {
    const room = await getRoom(req.params.id);
    if (room.username === req.user.username) {
        res.render('./room/delete', { title: 'Delete Room', room });
    } else {
        res.redirect('/');
    }
});

router.post('/edit/room/:id', isAuthenticated, async (req, res) => {
    try {
        const room = await getRoom(req.params.id);
        await updateRoom(req.params.id, req.body.title);

        res.redirect(`/room/${room._id}`);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error: Room not found");
    }
});

router.post('/delete/room/:id', isAuthenticated, async (req, res) => {
    try {
        const room = await getRoom(req.params.id);
        if (req.body.text === 'YES') {
            await deleteRoom(room.id, room.username);

            res.redirect('/');
        } else {
            res.redirect(`/room/${room.id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error: Room not found");
    }
});

router.post('/room', isAuthenticated, async (req, res) => {
    const { title, password } = req.body;
    const username = req.user.username;
    await createRoom(title, password, username);
    res.redirect('/');
});

router.post('/room/:id', async (req, res) => {
    const password = req.body.password;
    const room = await getRoom(req.params.id);

    if (!room) {
        return res.redirect('/');
    }

    if (password === room.password) {
        res.redirect(`/room/${room._id}`);
    } else {
        res.redirect('/');
    }
});

module.exports = router;