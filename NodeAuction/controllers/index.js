const { Op } = require('sequelize')
const { Good, Auction, User } = require('../models')

exports.renderMain = async (req, res, next) => {
    try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        const goods = await Good.findAll({
            where: {SoldId: null, createdAt:{[Op.gte]: yesterday}}
        })

        res.render('main', {
            title: 'NodeAuction',
            goods,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.renderJoin = (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction',
    })
}

exports.renderGood = (req, res) => {
    res.render('good', { title: '상품 등록 - NodeAuction' })
}

exports.createGood = async (req, res, next) => {
    try {
        const { name, price } = req.body
        await Good.create({
            OwnerId: req.user.id,
            name,
            img: req.file.filename,
            price,
        })
        res.redirect('/')
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.renderAuction = async (req, res, next) => {
    try {
        const [good, auction] = await Promise.all([
            Good.findOne({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'Owner',
                },
            }),
            Auction.findAll({
                where: { GoodId: req.params.id },
                include: { model: User },
                order: [['bid', 'ASC']],
            }),
        ])

        res.render('auction', {
            title: `${good.name} - NodeAuction`,
            good,
            auction,
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}

exports.bid = async (req, res, next) => {
    try {
        const { bid, msg } = req.body;
        const good = await Good.findOne({
            where: { id: req.params.id },
            include: { model: Auction },
            order: [[{ model: Auction }, 'bid', 'DESC']],
        })

        if (!good) {
            return res.status(404).send('해당 상품은 존재하지 않습니다.')
        }
        if (good.price >= bid) {
            return res.status(403).send('시작 가격보다 높게 입찰해야 합니다.')
        }
        if (new Date(good.createdAt).valueOf() + (24 * 60 * 60 * 1000) < new Date()) {
            return res.status(403).send('경매가 이미 종료되었습니다')
        }
        if (good.Auctions[0]?.bid >= bid) {
            return res.status(403).send('이전 입찰가보다 높아야 합니다')
        }

        const result = await Auction.create({
            bid,
            msg,
            UserId: req.user.id,
            GoodId: req.params.id,
        })

        req.app.get('io').to(req.params.id).emit('bid', {   // 실시간으로 입찰 내역 전송
            bid: result.bid,
            msg: result.msg,
            nick: req.user.nick,
        })

        return res.send('ok')
    } catch (error) {
        console.error(error)
        return next(error)
    }
}