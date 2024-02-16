const express = require('express')

const { verifyToken } = require('../middlewares')
const { createToken, tokenTest, getMyPosts, getPostByHashtag } = require('../controllers/v1')

const router = express.Router()

// v1/token POST
router.post('/token', createToken)

// v1/test GET
router.get('/test', verifyToken, tokenTest)

// v1/posts/my GET
router.get('/posts/my', verifyToken, getMyPosts)

// v1/posts/hashtag/:title GET
router.get('/posts/hashtag/:title', verifyToken, getPostByHashtag)

module.exports = router