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

module.exports = mongoose.model('Room', roomSchema);