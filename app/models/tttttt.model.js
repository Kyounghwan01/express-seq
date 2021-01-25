module.exports = (sequelize, DataTypes) => {
  const Ttttttt = sequelize.define(
    "tttttt",
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

  return Ttttttt;
};
