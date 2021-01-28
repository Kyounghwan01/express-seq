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
      },
      position_y: {
        allowNull: false,
        type: Sequelize.FLOAT(4, 1),
      },
      width: {
        allowNull: false,
        type: Sequelize.FLOAT(4, 1),
      },
      height: {
        allowNull: false,
        type: Sequelize.FLOAT(4, 1),
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      text: {
        type: Sequelize.STRING,
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
