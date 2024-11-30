const { getResponseObject, handleResizeImagesAndConvertFormatToWebp, getSuitableTranslations } = require("../global/functions");

const cartOperationsManagmentFunctions = require("../models/cart.model");

const { unlinkSync } = require("fs");

async function postNewProduct(req, res) {
    try {
        const productImages = Object.assign({}, req.files);
        let files = [productImages.productImage[0].buffer], outputImageFilePaths = [`assets/images/cart/${Math.random()}_${Date.now()}__${productImages.productImage[0].originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`];
        productImages.galleryImages.forEach((file) => {
            files.push(file.buffer);
            outputImageFilePaths.push(`assets/images/products/${Math.random()}_${Date.now()}__${file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`)
        });
        await handleResizeImagesAndConvertFormatToWebp(files, outputImageFilePaths);
        const { language } = req.query;
        const result = await cartOperationsManagmentFunctions.addNewProduct(req.data._id, {
            ...{ name, price, description, template, category, discount, tax, quantity } = Object.assign({}, req.body),
            imagePath: outputImageFilePaths[0],
            galleryImagesPaths: outputImageFilePaths.slice(1),
        }, language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllProductsInsideTheCart(req, res) {
    try {
        res.json(await cartOperationsManagmentFunctions.getAllProductsInsideTheCart(queryObject.pageNumber, queryObject.pageSize, filtersAndSortDetailsObject.filtersObject, sortDetailsObject, queryObject.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteProduct(req, res) {
    try {
        const result = await cartOperationsManagmentFunctions.deleteProduct(req.data._id, req.params.productId, req.query.language);
        if(!result.error) {
            unlinkSync(result.data.deletedProductImagePath);
            for (let productImagePath of result.data.galleryImagePathsForDeletedProduct) {
                unlinkSync(productImagePath);
            }
        }
        else {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
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
        const result = await cartOperationsManagmentFunctions.updateProduct(req.data._id, req.params.productId, { name, price, quantity, country, description, category, discount, tax, startDiscountPeriod, endDiscountPeriod, discountInOfferPeriod, offerDescription } = req.body, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
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
    getAllProductsInsideTheCart,
    deleteProduct,
    putProduct,
}