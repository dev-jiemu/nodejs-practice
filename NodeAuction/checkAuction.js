const { scheduleJob } = require('node-schedule')
const { Op } = require('sequelize')
const { Good, Auction, User, sequelize } = require('./models')

module.exports = async () => { // 트랜잭션 추가
    console.log('checkAuction')
    try {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const targets = await Good.findAll({
            where: { SoldId: null, createdAt: { [Op.lte]: yesterday }, },
        })

        for (const good of targets) {
            const t = await sequelize.transaction()
            const success = await Auction.findOne({
                where: { GoodId: good.id }, order: [['bid', 'DESC']], transaction: t,
            })

            await good.setSold(success.UserId)
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: { id: success.UserId },
                transaction: t,
            })
        }

        // 24시간이 지나지 않은 낙찰자 없는 경매들
        const ongoing = await Good.findAll({
            where: { SoldId: null, createdAt: { [Op.gte]: yesterday }, },
        })

        for (const good of ongoing) {
            const end = new Date(good.createdAt)
            end.setDate(end.getDate() + 1)

            const t = await sequelize.transaction()
            const job = scheduleJob(end, async() => {
                const success = await Auction.findOne({
                    where: { GoodId: good.id },
                    order: [['bid', 'DESC']],
                    transaction: t,
                })

                await good.setSold(success.UserId)
                await User.update({
                    money: sequelize.literal(`money - ${success.bid}`),
                }, {
                    where: { id: success.UserId },
                    transaction: t,
                })
            })

            job.on('error', (err) => {
                console.error('스케쥴링 에러 : ', err)
            })
            job.on('success', () => {
                console.log('스케쥴링 성공')
            })
        }
    } catch (err) {
        console.error(err)
    }
}