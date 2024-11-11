const templatesRouter = require("express").Router();

const templatesController = require("../controllers/templates.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

templatesRouter.get("/all-templates", validateJWT, templatesController.getAllTemplates);

templatesRouter.put("/:templateId", validateJWT, templatesController.putTemplate);

module.exports = templatesRouter;