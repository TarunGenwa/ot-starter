module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user',{
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4 ,       
            primaryKey: true 
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.INTEGER,
        }
    })

    User.associate = (models) => {
        User.belongsTo(models.team, {through: 'team_user'})
    }

    return User
}