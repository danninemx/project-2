module.exports = function(sequelize, DataTypes) {
    var cssData = sequelize.define("cssData", {
      properties: DataTypes.STRING,
      definitions: DataTypes.STRING
    });
    return cssData;
  };