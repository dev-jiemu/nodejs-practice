const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const { isLoggedIn, isNotLoggedIn } = require('../middlewares')
const { renderMain, renderJoin, renderGood, createGood, renderAuction, bid } = require('../controllers')

const router = express.Router()

router.use((req, res, next) => {
    res.locals.user = req.user
    next()
})

try {
    fs.readdirSync('uploads')
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
    fs.mkdirSync('uploads')
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/')
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname)
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext)
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})

router.get('/', renderMain)
router.get('/join', isNotLoggedIn, renderJoin)
router.post('/good', isLoggedIn, upload.single('img'), createGood)
router.get('/good', isLoggedIn, renderGood)

router.get('/good/:id', isLoggedIn, renderAuction)
router.get('/good/:id/bid', isLoggedIn, bid)

module.exports = router