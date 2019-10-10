module.exports = function (sequelize, DataTypes) {
  var guide = sequelize.define("guide", {
    chapterId: DataTypes.INTEGER(5),
    chapter: DataTypes.STRING(50),
    lessonId: DataTypes.INTEGER(5),
    lesson: DataTypes.STRING(100),
    paragraph: DataTypes.INTEGER(5),
    content: DataTypes.STRING(2000)
  }, { // Do not look for createdAt or UpdatedAt
      timestamps: false
    });
  return guide;
};
