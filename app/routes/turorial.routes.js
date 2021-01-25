module.exports = (app) => {
  const tutorials = require("../controllers/tutorial.controller.js");
  const landing = require("../controllers/landing.controller.js");

  var router = require("express").Router();

  router.post("/company", landing.createCompany);

  router.get("/company", landing.getCompanies);

  // Create a new Tutorial
  router.post("/", tutorials.create);

  // Retrieve all Tutorials
  router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
  router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
  router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
  router.delete("/", tutorials.deleteAll);

  router.post("/tu", tutorials.createTutorial);

  router.post("/com", tutorials.createComment);

  router.get("/tu/:id", tutorials.findTutorialById);

  router.get("/com/:id", tutorials.findCommentById);

  router.get("/tesss/q", tutorials.findAlls);

  app.use("/api/tutorials", router);
};
