const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    username: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    }
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema);