module.exports = (app) => {
  const landing = require("../controllers/landing.controller.js");

  var router = require("express").Router();

  router.post("/", landing.createLanding);

  router.get("/", landing.getLandings);

  router.get("/company", landing.getCompanies);

  app.use("/api/landings", router);
};
