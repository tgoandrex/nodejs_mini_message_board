const passport = require('passport');
const User = require('../model/User');

// Create Passport local strategy
passport.use(User.createStrategy());

// Serialize and deserialize user
passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, {
            id: user.id,
            username: user.username
        });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

module.exports = passport;