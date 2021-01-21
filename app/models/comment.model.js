module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comment",
    {
      name: {
        type: DataTypes.STRING,
      },
      text: {
        type: DataTypes.STRING,
      },
    },
    { charset: "utf8", collate: "utf8_general_ci" }
  );

  return Comment;
};
