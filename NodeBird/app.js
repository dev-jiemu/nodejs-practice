const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')

dotenv.config()
const pageRouter = require('./routes/page')
const {precompile} = require("nunjucks");

const app = express()
app.set('port', process.env.PORT || 8081)
app.set('view engine', 'html')
nunjucks.configure('views', {
    express: app,
    watch: true,
})

app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}))

app.use('/', pageRouter)


// Not found
app.use((req, res, next) => {
    const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    err.status = 404;
    next(err)
})


// Internal Server Error
app.use((err, req, res, next) => {
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

app.listen(app.get('port'), () => {
    console.log(app.get('port', '번 포트에서 대기중'))
})