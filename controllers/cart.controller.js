const { getResponseObject, handleResizeImagesAndConvertFormatToWebp, getSuitableTranslations } = require("../global/functions");

const cartOperationsManagmentFunctions = require("../models/cart.model");

const { unlinkSync } = require("fs");

async function postNewProduct(req, res) {
    try {
        const productImages = Object.assign({}, req.files);
        let files = [], outputImageFilePaths = [];
        if (productImages?.designImages?.length > 0) {
            productImages.designImages.forEach((file) => {
                files.push(file.buffer);
                outputImageFilePaths.push(`assets/images/cart/${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`)
            });
            await handleResizeImagesAndConvertFormatToWebp(files, outputImageFilePaths);
        }
        const result = await cartOperationsManagmentFunctions.addNewProduct(req.data._id, {
            ...{ productId, quantity } = Object.assign({}, req.body),
            designFiles: outputImageFilePaths,
        }, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllProducts(req, res) {
    try {
        res.json(await cartOperationsManagmentFunctions.getAllProducts(req.data._id, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteProduct(req, res) {
    try {
        const result = await cartOperationsManagmentFunctions.deleteProduct(req.data._id, req.params.cartId, req.query.language);
        if(!result.error) {
            for (let designFile of result.data.designFiles) {
                unlinkSync(designFile);
            }
        }
        else {
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putProduct(req, res) {
    try {
        const result = await cartOperationsManagmentFunctions.updateProduct(req.data._id, req.params.cartId, { quantity } = req.body, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postNewProduct,
    getAllProducts,
    deleteProduct,
    putProduct,
}