const cartRouter = require("express").Router();

const cartController = require("../controllers/cart.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat, validateIsExistErrorInFiles } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const multer = require("multer");

cartRouter.post("/add-new-product",
    validateJWT,
    multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) {
                return cb(null, true);
            }
            if (
                file.mimetype !== "image/jpeg" &&
                file.mimetype !== "image/png" &&
                file.mimetype !== "image/webp"
            ){
                req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG and PNG Or WEBP files are allowed !!";
                return cb(null, false);
            }
            cb(null, true);
        }
    }).fields([
        { name: "designImages", maxCount: 10 },
    ]),
    validateIsExistErrorInFiles,
    (req, res, next) => {
        const { productId, quantity } = Object.assign({}, req.body);
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Quantity", fieldValue: quantity, dataType: "number", isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([ ...{ quantity } = Object.assign({}, req.body)], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([ ...{ quantity } = Object.assign({}, req.body)], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Not Float ) !!"]),
    cartController.postNewProduct
);

cartRouter.get("/all-products", cartController.getAllProducts);

cartRouter.delete("/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    cartController.deleteProduct
);

cartRouter.put("/:productId",
    validateJWT,
    (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: req.params.productId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "New Quantity", fieldValue: req.body.quantity, dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    cartController.putProduct
);

module.exports = cartRouter;