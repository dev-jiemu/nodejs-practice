const WebSocket = require('ws')

module.exports = (server) => {
    const wss = new WebSocket.WebSocketServer({server})

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress // 클라이언트 IP 파악
        console.log('새로운 클라이언트 접속', ip)
        ws.on('message', (message) => { // 클라이언트로부터 메시지 수신 시
            console.log(message.toString())
        })

        ws.on('error', (error) => {
            console.error(error)
        })

        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip)
            clearInterval(ws.interval)
        })
        
        ws.interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.')
            }
        }, 3000) // 3초마다 클라이언트로 메세지 전송함
    })
}