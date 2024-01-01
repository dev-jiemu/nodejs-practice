const Sequelize = require('sequelize')

class User extends Sequelize.Model {
    static initiate(sequelize) {
        User.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: {
                type: Sequelize.ENUM('local', 'kakao'),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true, //createAt, updateAt, deletedAt column
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        })
    }

    static associate(db) {
        db.User.hasMany(db.Post) // 1:N
        db.User.belongsToMany(db.User, { // following
            foreignKey: 'followingId',
            as: 'Followers',
            through: 'Follow',
        })
        db.User.belongsToMany(db.User, { // follower
            foreignKey: 'followerId',
            as: 'Followings',
            through: 'Follow',
        })
    }
}

module.exports = User