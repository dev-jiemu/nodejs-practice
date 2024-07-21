const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const { renderMain, renderRoom, createRoom, enterRoom, sendChat, sendGif, removeRoom } = require('../controllers')

const router = express.Router()
// router.get('/', (req, res) => {
//     res.render('index')
// })

router.get('/', renderMain)
router.get('/room', renderRoom)
router.post('/room', createRoom)
router.get('/room/:id', enterRoom)
router.delete('/room/:id', removeRoom)
router.post('/room/:id/chat', sendChat)

try {
    fs.readdirSync('uploads')
} catch (err) {
    console.log('uploads 폴더가 없어 생성합니다.')
    fs.rmdirSync('uploads')
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/')
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname)
            done(null, path.basename(file.originalname, ext) + Date.now() + ext)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})
router.post('/room/:id/gif', upload.single('gif'), sendGif)

module.exports = router