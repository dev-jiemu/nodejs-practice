const Room = require('../schemas/room')
const Chat = require('../schemas/chat')

exports.renderMain = async (req, res, next) => {
    try {
        const rooms = await Room.find({})
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.renderRoom = (req, res) => {
    res.render('room', {title: 'GIF 채팅방 생성'})
}