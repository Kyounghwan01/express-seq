const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.companies = require("./company.model.js")(sequelize, Sequelize);
db.landings = require("./landing.model.js")(sequelize, Sequelize);
db.landingImages = require("./landingImage.model.js")(sequelize, Sequelize);
db.landingButtons = require("./landingButton.model.js")(sequelize, Sequelize);

db.companies.hasMany(db.landings, { as: "landings" });
db.landings.belongsTo(db.companies, {
  foreignKey: "companyId",
  as: "companies",
});

db.landings.hasMany(db.landingImages, {
  as: "landingImages",
  foreignKey: "landingUuid",
  onDelete: "cascade",
  hooks: true,
});
db.landingImages.belongsTo(db.landings, {
  foreignKey: "landingUuid",
  as: "landings",
  onDelete: "cascade",
  hooks: true,
});

db.landingImages.hasMany(db.landingButtons, {
  foreignKey: "landingImageId",
  onDelete: "cascade",
  hooks: true,
  as: "landingButtons",
});
db.landingButtons.belongsTo(db.landingImages, {
  foreignKey: "landingImageId",
  as: "landingImages",
  onDelete: "cascade",
  hooks: true,
});

db.images = require("./image.model.js")(sequelize, Sequelize);

module.exports = db;
