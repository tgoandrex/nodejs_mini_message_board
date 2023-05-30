const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    user: String
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema);