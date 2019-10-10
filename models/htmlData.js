module.exports = function(sequelize, DataTypes) {
    var HtmlData = sequelize.define("HtmlData", {
      tag: DataTypes.STRING,
      script: DataTypes.STRING
    });
    return HtmlData;
  };