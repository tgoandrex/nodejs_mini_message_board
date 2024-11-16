const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: false
    },
    hasPassword: {
        type: Boolean,
        default: false
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    username: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Password validation for private rooms (only if password exists)
roomSchema.pre('save', function(next) {
    if (this.password && this.password.length < 6) {
        return next(new Error('Password must be at least 6 characters long'));
    }
    next();
});

module.exports = mongoose.model('Room', roomSchema);