const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500 // Limit the length of the message
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    username: {
        type: mongoose.Schema.Types.String,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);