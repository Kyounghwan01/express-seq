module.exports = (app) => {
  const landing = require("../controllers/landing.controller.js");
  const landingUpdate = require("../controllers/landingUpdate.controller.js");
  const upload = require("../middleware/upload");
  const fs = require("fs");
  const fsPromise = require("fs").promises;

  var router = require("express").Router();

  router.post(
    "/",
    landing.checkvalidation,
    landing.createOrSearchCompany,
    landing.createLanding,
    landing.createLandingImage,
    landing.createLandingButton
  );

  router.get("/", landing.getLandings);

  router.get("/landing/:id", landing.getLandingById);

  router.get("/company", landing.getCompanies);

  router.post("/upload", upload, async (req, res) => {
    try {
      const imgData = fs
        .readFileSync(`app${req.file.path.split("app")[1]}`)
        .toString("base64");

      res.json({
        success: true,
        path: imgData,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    } finally {
      await fsPromise.unlink(`app${req.file.path.split("app")[1]}`);
    }
  });

  router.delete("/:id", landing.deleteLandingById);

  router.put(
    "/:id",
    landing.createOrSearchCompany,
    landingUpdate.updateLanding,
    landingUpdate.updateLandingImage,
    landingUpdate.updateLandingButton
  );

  app.use("/api/landings", router);
};
