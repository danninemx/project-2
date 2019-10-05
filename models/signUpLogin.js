module.exports = function(sequelize, DataTypes){
    var Users = sequelize.define("users",{
        email: DataTypes.STRING,
        password: DataTypes.STRING

    },
    {
        freezeTableName: true
    })
    return Users;
}