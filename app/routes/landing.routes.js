module.exports = (app) => {
  const { resolve } = require("path");
  const db = require("../models");
  const Image = db.images;
  const landing = require("../controllers/landing.controller.js");
  const upload = require("../middleware/upload");
  const fs = require("fs");

  var router = require("express").Router();

  router.post(
    "/",
    landing.createOrSearchCompany,
    landing.createLanding,
    landing.createLandingImage,
    landing.createLandingButton
  );

  router.get("/", landing.getLandings);

  router.get("/:id", landing.getLandingById);

  router.get("/company", landing.getCompanies);

  router.post("/upload", upload, async (req, res, next) => {
    try {
      const imgData = fs
        .readFileSync(`app${req.file.path.split("app")[1]}`)
        .toString("base64");

      const ress = await Image.create({
        path: imgData,
      });

      res.json({
        success: true,
        path: imgData,
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  });

  app.use("/api/landings", router);
};
