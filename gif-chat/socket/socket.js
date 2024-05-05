const WebSocket = require('ws')
const SocketIO = require('socket.io')
module.exports = (server) => {
    //const wss = new WebSocket.WebSocketServer({server})
    const io = SocketIO(server, {path: '/socket.io'})

    // wss.on('connection', (ws, req) => {
    //     const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    //
    //     ws.on('message', (message) => {
    //         console.log(message.toString())
    //     })
    //
    //     ws.on('error', (error) => {
    //         console.error(error)
    //     })
    //
    //     ws.on('close', () => {
    //         clearInterval(ws.interval)
    //     })
    //
    //     ws.interval = setInterval(() => {
    //         if (ws.readyState === ws.OPEN) {
    //             ws.send('서버에서 클라이언트로 메시지를 보냅니다.')
    //         }
    //     }, 3000)
    // })

    // https://inpa.tistory.com/entry/SOCKET-%F0%9F%93%9A-SocketIO-%EC%82%AC%EC%9A%A9-%ED%95%B4%EB%B3%B4%EA%B8%B0
    io.on('connection', (socket) => {
        const req = socket.request
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip)

        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제', ip, socket.id)
            clearInterval(socket.interval)
        })

        socket.on('error', (error) => {
            console.error(error)
        })

        socket.on('reply', (data) => {
            console.log(data)
        })

        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO') // emit(이벤트 이름, 전송 데이터)
        }, 3000)
    })

}