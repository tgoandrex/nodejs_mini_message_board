const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../model/User');

// Create Passport local strategy
passport.use(User.createStrategy());

// Serialize and deserialize user
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture
        });
    });
});
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

// Register user
router.post('/auth/register', async (req, res) => {
    try {
        const userToRegister = await User.register({username: req.body.username}, req.body.password);

        if(userToRegister) {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        } else {
            res.redirect('/register');
        }
    } catch(err) {
        res.send(err);
    }
});

// Login user
router.post('/auth/login', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if(err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        }
    })
});

// Logout user
router.get('/auth/logout', (req, res) => {
    req.logout(function(err) {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

module.exports = router;