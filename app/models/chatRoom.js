import { Schema, model, models } from 'mongoose';

const ChatRoomSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    message: {
        type: String,
        required: true
    }
});

const ChatRoom = mongoose.model('Room', ChatRoomSchema);

module.exports = ChatRoom;
