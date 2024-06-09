const SockerIO = require('socket.io')

module.exports = (server, app) => {
    const io = SockerIO(server, {path: '/socker.id'})
    app.set('io', io) // io setting

    const room = io.of('/room')
    const chat = io.of('/chat')

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
        })

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제')
        })

        // 방에서 나갈땐 leave(id) 호출함
    })
}