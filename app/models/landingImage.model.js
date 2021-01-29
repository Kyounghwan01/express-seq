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
        validate: {
          notEmpty: true,
        },
      },
      data: {
        allowNull: false,
        type: Sequelize.BLOB("long"),
        validate: {
          notEmpty: true,
        },
      },
      bottomButton: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        validate: {
          notEmpty: true,
        },
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
