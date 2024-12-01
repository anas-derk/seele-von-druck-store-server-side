// Import Cart Model Object

const { cartModel, productModel, userModel } = require("../models/all.models");

const { getSuitableTranslations } = require("../global/functions");

async function addNewProduct(authorizationId, productInfo, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo){
            const product = await productModel.findById(productInfo.productId);
            if (product) {
                if (await cartModel.findOne({ product: productInfo.productId })) {
                    return {
                        msg: getSuitableTranslations("Sorry, This Product Is Already Exist Inside The Cart For This User !!", language),
                        error: true,
                        data: {},
                    }
                }
                await (new cartModel(productInfo)).save();
                return {
                    msg: getSuitableTranslations("Adding New Product Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllProducts(authorizationId, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo){
            return {
                msg: getSuitableTranslations("Get All Products Inside The Cart Process Has Been Successfully !!", language),
                error: false,
                data: await cartModel.find({ userId: authorizationId }).populate("product"),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteProduct(authorizationId, productId, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo){
            const product = await cartModel.findOneAndDelete({ product: productId });
            if (product) {
                return {
                    msg: getSuitableTranslations("Deleting Product From User Cart Process Has Been Successfuly !!", language),
                    error: false,
                    data: {
                        designFiles: product.designFiles,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function updateProduct(authorizationId, productId, newData, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo){
            const product = await cartModel.findOneAndUpdate({ product: productId }, newData);
            if (product) {
                return {
                    msg: getSuitableTranslations("Updating Product Info Inside The Cart Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Not Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This User Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

module.exports = {
    addNewProduct,
    getAllProducts,
    deleteProduct,
    updateProduct,
}