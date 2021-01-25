module.exports = (sequelize, Sequelize) => {
  const LandingImage = sequelize.define(
    "landingImage",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      data: {
        allowNull: false,
        type: Sequelize.BLOB,
      },
      bottomButton: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: true,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );

  return LandingImage;
};
