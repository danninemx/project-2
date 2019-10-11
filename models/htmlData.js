module.exports = function(sequelize, DataTypes) {
    var HtmlData = sequelize.define("HtmlData", {
      tag: DataTypes.STRING,
      description: DataTypes.STRING
    });
    return HtmlData;
  };