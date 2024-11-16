const Message = require('../model/Message');
const User = require('../model/User');
const Room = require('../model/Room');

const getMessages = async (roomTitle) => {
    const room = await Room.findOne({ title: roomTitle });
    if (!room) return [];
    
    return await Message.find({ room: room._id }).sort({ createdAt: -1 });
};

const getMessage = async (messageId) => {
    const message = await Message.findById(messageId).populate('room');
    if (!message || !message.room) {
        throw new Error('Message or associated room not found');
    }
    return message;
}

const createMessage = async (text, username, roomTitle) => {
    const room = await Room.findOne({ title: roomTitle });
    const message = new Message({ text, username, room: room._id });
    
    await message.save();
    room.messages.push(message._id);
    await room.save();

    const user = await User.findOne({ username });
    user.messages.push(message._id);
    await user.save();

    return message;
};

const updateMessage = async (id, newText) => {
    await Message.findByIdAndUpdate(id, { text: newText });
};

const deleteMessage = async (id, username, roomId) => {
    await Message.findByIdAndDelete(id);
    
    const room = await Room.findOne({ _id: roomId });
    room.messages.pull(id);
    await room.save();
    
    const user = await User.findOne({ username });
    user.messages.pull(id);
    await user.save();
};

module.exports = { getMessages, getMessage, createMessage, updateMessage, deleteMessage };