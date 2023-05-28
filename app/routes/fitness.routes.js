module.exports = (app) => {
  const fitnessController = require("../controllers/fitness.controller.js");

  let router = require("express").Router();

  router.post("/sendEmail", fitnessController.sendEmail);
  router.post("/login", fitnessController.login);
  router.post("/signUp", fitnessController.signUp);
  router.post("/getUserData", fitnessController.getUserData);
  router.get("/getProgramRequests", fitnessController.getProgramRequests);
  router.get("/getRequestData/:id", fitnessController.getRequestData);
  router.post("/createRequest", fitnessController.createRequest);
  router.post("/createRequest", fitnessController.createRequest);
  router.post("/addNewProgram", fitnessController.addNewProgram);

  app.use("/api", router);
};
