module.exports = app => {
  const fitnessController = require("../controllers/fitness.controller.js");

  let router = require("express").Router();

  router.post("/sendEmail", fitnessController.sendEmail);
  router.post("/login", fitnessController.login);
  router.post("/signUp", fitnessController.signUp);

  app.use("/api", router);
};
