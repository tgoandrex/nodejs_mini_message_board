const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }]
});

// Hash password using passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose);

// Optionally, you can exclude password from being sent in queries
userSchema.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.password;  // Do not include password field
    return obj;
};

module.exports = mongoose.model('User', userSchema);