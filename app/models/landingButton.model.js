module.exports = (sequelize, Sequelize) => {
  const LandingButton = sequelize.define(
    "landingButton",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      position_x: {
        allowNull: false,
        type: Sequelize.FLOAT(4, 1),
        validate: {
          notEmpty: true,
        },
      },
      position_y: {
        allowNull: false,
        type: Sequelize.FLOAT(4, 1),
        validate: {
          notEmpty: true,
        },
      },
      width: {
        allowNull: false,
        type: Sequelize.FLOAT(4, 1),
        validate: {
          notEmpty: true,
        },
      },
      height: {
        allowNull: false,
        type: Sequelize.FLOAT(4, 1),
        validate: {
          notEmpty: true,
        },
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
        },
      },
      text: {
        type: Sequelize.STRING,
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

  return LandingButton;
};
