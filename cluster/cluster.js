// cluster : 싱글 프로세스로 동작하는 노드가 CPU 코어를 전부 사용할 수 있게 해줌.

const cluster = require('cluster')
const http = require('http')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
    console.log(`마스터 프로세스 아이디: ${process.pid}`)

    for (let i = 0; i < numCPUs; i += 1) {
        cluster.fork()
    }

    // 워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`)
        console.log('code', code, 'signal', signal)
        cluster.fork() // 워커프로세스가 종료될때마다 하나씩 다시 켬
    });
} else {
    // 워커들이 포트에서 대기
    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write('<h1>Hello Node!</h1>')
        res.end('<p>Hello Cluster!</p>')
        setTimeout(() => {
            process.exit(1)
        }, 1000) // 워커가 존재하는지 확인하기 위해서 1초마다 종료처리함
    }).listen(8086)

    console.log(`${process.pid}번 워커 실행`)

}

