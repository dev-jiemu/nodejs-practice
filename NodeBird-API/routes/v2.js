const express = require('express')

const { verifyToken, apiLimiter, corsWhenDomainMatches} = require('../middlewares')
const { createToken, tokenTest, getMyPosts, getPostByHashtag } = require('../controllers/v2')

const router = express.Router()

router.use(corsWhenDomainMatches) // CORS

// POST v2/token
router.post('/token', apiLimiter, createToken)

// POST v2/test
router.post('/test', apiLimiter, tokenTest)

// GET v2/posts/my
router.get('/posts/my', apiLimiter, verifyToken, getMyPosts)

// GET v2/posts/hashtag/:title
router.get('/posts/hashtag/:title', apiLimiter, verifyToken, getPostByHashtag)

module.exports = router