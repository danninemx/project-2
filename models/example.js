module.exports = function(sequelize, DataTypes) {
  var html = sequelize.define("html", {
    tag: DataTypes.STRING,
    description: DataTypes.TEXT
  });
  return html;
};
