const previousProjectsRouter = require("express").Router();

const previousProjectsController = require("../controllers/previous_projects.controller");

const { validateJWT, validateIsExistErrorInFiles } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const multer = require("multer");

previousProjectsRouter.post("/add-new-project",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No File Uploaded, Please Upload The File";
                return cb(null, false);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp"
            ){
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("projectImg"),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Project Description", fieldValue: (Object.assign({}, req.body)).description, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    previousProjectsController.postNewPreviousProduct
);

previousProjectsRouter.get("/previous-projects-count", previousProjectsController.getPreviousProductsCount);

previousProjectsRouter.get("/all-previous-projects-inside-the-page",
    (req, res, next) => {
        const { pageNumber, pageSize } = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    previousProjectsController.getAllPreviousProjectsInsideThePage
);

previousProjectsRouter.delete("/:projectId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Project Id", fieldValue: req.params.brandId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    previousProjectsController.deletePreviousProject
);

previousProjectsRouter.put("/:projectId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Project Id", fieldValue: req.params.projectId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "New Project Description", fieldValue: req.body.newProjectDescription, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    previousProjectsController.putPreviousProjectInfo
);

previousProjectsRouter.put("/change-project-image/:projectId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Project Id", fieldValue: req.params.projectId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                req.uploadError = "Sorry, No Files Uploaded, Please Upload The Files";
                return cb(null, false);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp"
            ){
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).single("projectImage"),
    validateIsExistErrorInFiles,
    previousProjectsController.putPreviousProjectImage
);

module.exports = previousProjectsRouter;