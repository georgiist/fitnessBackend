module.exports = app => {
  const fitnessController = require("../controllers/fitness.controller.js");

  let router = require("express").Router();

  router.post("/sendEmail", fitnessController.sendEmail);

  app.use("/api", router);
};
