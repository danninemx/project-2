module.exports = function(sequelize, DataTypes) {
  var guide = sequelize.define("guide", {
      chapterId: DataTypes.INTEGER,
      chapter: DataTypes.STRING,
      lessonId: DataTypes.INTEGER,
      lesson: DataTypes.STRING,
      paragraph: DataTypes.INTEGER,
      content: DataTypes.STRING
    }, { // Do not look for createdAt or UpdatedAt
      timestamps: false 
  });
    return guide;
  };
  