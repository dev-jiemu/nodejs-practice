const express = require('express')

const { verifyToken } = require('../middlewares')
const { createToken, tokenTest } = require('../controllers/v1')

const router = express.Router()

// v1/token POST
router.post('/token', createToken)

// v1/test GET
router.get('/test', verifyToken, tokenTest)

module.exports = router