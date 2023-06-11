const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../model/User');

// Create Passport local strategy
passport.use(User.createStrategy());

// Serialize and deserialize user
passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture
        });
    });
});
passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

// Register user
router.post('/auth/register', async (req, res) => {
    User.register({username: req.body.username}, req.body.password, (err) => {
        if(err) {
            res.render('register', {
                title: 'Register New Account',
                error: `Could not register. Error: ${err.message}`
            });
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/');
            });
        }
    });
});

// Login user
router.post('/auth/login', passport.authenticate('local', { failureRedirect: '/login'}), (req, res) => {
    res.redirect('/');
});
  

// Logout user
router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if(err) {
            console.log(err);
        }
        res.redirect('/');
    });
});

module.exports = router;