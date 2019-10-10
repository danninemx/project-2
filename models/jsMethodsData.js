module.exports = function(sequelize, DataTypes) {
    var jsMethodsData = sequelize.define("jsMethodsData", {
      method: DataTypes.STRING,
      descriptions: DataTypes.STRING
    });
    return jsMethodsData;
  };