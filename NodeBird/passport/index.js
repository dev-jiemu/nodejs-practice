const passport = require('passport')
const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const User = require('../models/user')

module.exports = () => {
    // 로그인시 실행
    // req.session 객체에 어떤 데이터를 저장할지 정함
    passport.serializeUser((user, done) => {
        done(null, user.id) // (error 객체, 저장하고 싶은 데이터)
    })
}

// passport.session 미들웨어가 호출하는 메서드: 호출할때마다 유저가 있는지 검사함
passport.deserializeUser((id, done) => {
    User.findOne({
        where: { id },
        include: [
            {model: User, attributes: ['id', 'nick'], as: 'Followers'}, // 팔로잉, 팔로워 목록도 조회
            {model: User, attributes: ['id', 'nick'], as: 'Followings'},
        ]
    })
        .then(user => done(null, user))
        .catch(err => done(err))
})

local()
kakao()