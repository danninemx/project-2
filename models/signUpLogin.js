module.exports = function(sequelize, DataTypes){
    var Users = sequelize.define("users",{
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        lastLessonId:{type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }

    },
    {
        freezeTableName: true
    })
    return Users;
}