const Message = require('../model/Message');
const Room = require('../model/Room');
const User = require('../model/User');

const getAllRooms = async () => {
    return await Room.find({});
}

const getRoom = async (roomId) => {
    return await Room.findById(roomId);
}

const createRoom = async (title, password, username) => {
    let room;

    if(password) {
        room = await Room.create({ title, password, hasPassword: true, username });
        await room.save();

        const user = await User.findOne({ username });
        user.rooms.push(room._id);
        await user.save();
    } else {
        room = await Room.create({ title, username });
        await room.save();

        const user = await User.findOne({ username });
        user.rooms.push(room._id);
        await user.save();
    }

    return room;
}

const updateRoom = async (id, newTitle) => {
    await Room.findByIdAndUpdate(id, { title: newTitle });
};

const deleteRoom = async (id, username) => {
    const room = await Room.findById(id);
    
    if(!room) {
        throw new Error('Room not found');
    }

    const messages = await Message.find({ room: id });
    const messageIds = messages.map((message) => message._id);

    await Message.deleteMany({ room: id });

    await User.updateMany({ messages: { $in: messageIds } }, { $pull: { messages: { $in: messageIds } } });
    
    await Room.findByIdAndDelete(id);

    const user = await User.findOne({ username });
    user.rooms.pull(id);
    await user.save();
};

module.exports = { getAllRooms, getRoom, createRoom, updateRoom, deleteRoom };