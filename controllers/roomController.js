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

module.exports = {
    getAllRooms,
    getRoom,
    createRoom
};