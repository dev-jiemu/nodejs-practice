const SocketIO = require('socket.io')
const { removeRoom } = require('./services')

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, {path: '/socker.id'})
    app.set('io', io) // io setting
    const room = io.of('/room')
    const chat = io.of('/chat')

    // char 네임스페이스에 웹소켓이 연결될때마다 실행되는 미들웨어
    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next)
    chat.use(wrap(sessionMiddleware))

    // room에 연결되었을때
    room.on('connecton', (socket) => {
        console.log('room 네임스페이스 접속')
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제')
        })
    })

    // chat에 연결되었을 때
    chat.on('connection', (socket) => {
        socket.on('join', (data) => {
            socket.join(data)

            // 입장메세지
            socket.to(data).emit('join', {
                user: 'system',
                char: `${socket.request.session.color}님이 입장하셨습니다.`
            })
        })

        socket.on('disconnect', async () => {
            console.log('chat 네임스페이스 접속 해제')

            const { referer } = socket.request.headers
            const roomId = new URL(referer).pathname.split('/').at(-1)
            const currentRoom = chat.adapter.rooms.get(roomId)
            const userCount = currentRoom?.size || 0

            if (userCount === 0) {
                await removeRoom(roomId)
                room.emit('removeRoom', roomId)
                console.log('방 제거 요청 성공')
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${socket.request.session.color}님이 퇴장하셨습니다.`
                })
            }
        })
    })
}