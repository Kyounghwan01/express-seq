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

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.comments = require("./comment.model.js")(sequelize, Sequelize);
db.tttttt = require("./tttttt.model.js")(sequelize, Sequelize);
db.tag = require("./tag.model.js")(sequelize, Sequelize);

db.companies = require("./company.model.js")(sequelize, Sequelize);
db.landings = require("./landing.model.js")(sequelize, Sequelize);
db.landingImages = require("./landingImage.model.js")(sequelize, Sequelize);
db.landingButtons = require("./landingButton.model.js")(sequelize, Sequelize);

db.companies.hasMany(db.landings, { as: "landings" });
db.landings.belongsTo(db.companies, {
  foreignKey: "companyId",
  as: "companies",
});

db.landings.hasMany(db.landingImages, { as: "landingImages" });
db.landingImages.belongsTo(db.landings, {
  foreignKey: "landingUuid",
  as: "landings",
});

db.landingImages.hasMany(db.landingButtons, { as: "landingButtons" });
db.landingButtons.belongsTo(db.landingImages, {
  foreignKey: "landingImageId",
  as: "landingImages",
});

db.tutorials.hasMany(db.comments, { as: "comments" });
// key값 다르면 생성 안됨
db.comments.belongsTo(db.tutorials, {
  foreignKey: "tutorialId",
  as: "tutorials",
});

// // comments에 toturialId 가 들어감

db.tutorials.hasOne(db.tttttt);
db.tttttt.belongsTo(db.tutorials);

db.tag.belongsToMany(db.tutorials, {
  through: "tutorial_tag",
  as: "tutorials",
  foreignKey: "tag_id",
});
db.tutorials.belongsToMany(db.tag, {
  through: "tutorial_tag",
  as: "tags",
  foreignKey: "tutorial_id",
});

db.images = require("./image.model.js")(sequelize, Sequelize);

module.exports = db;
