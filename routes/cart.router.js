const cartRouter = require("express").Router();

const cartController = require("../controllers/cart.controller");

const { validateJWT, validateNumbersIsGreaterThanZero, validateNumbersIsNotFloat } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

cartRouter.post("/add-new-product",
    validateJWT,
    (req, res, next) => {
        const { productId, quantity } = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Product Id", fieldValue: productId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "Quantity", fieldValue: quantity, dataType: "number", isRequiredValue: false },
        ], res, next);
    },
    (req, res, next) => validateNumbersIsGreaterThanZero([req.body.quantity], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Greater Than Zero ) !!"]),
    (req, res, next) => validateNumbersIsNotFloat([req.body.quantity], res, next, ["Sorry, Please Send Valid Quantity( Number Must Be Not Float ) !!"]),
    cartController.postNewProduct
);

cartRouter.get("/all-products-inside-the-cart", cartController.getAllProductsInsideTheCart);

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