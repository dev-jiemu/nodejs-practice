const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const chatSchema = new Schema({
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room',
    },
    user: {
        type: String,
        required: true,
    },
    chat: String, // 채팅 또는 이미지 둘중 하나만 저장하면 되서 required 필요없음 ㅇㅇ
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('Chat', chatSchema)