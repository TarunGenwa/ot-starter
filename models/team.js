module.exports = (sequelize, DataTypes) => {
    const Team = sequelize.define('team', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4 ,       
            primaryKey: true 
        },    
        name: {
            type: DataTypes.STRING
        }    
        })

        Team.associate = (models) => {
            Team.belongsToMany(models.user, { through: 'team_user' })
        }
    return Team
}