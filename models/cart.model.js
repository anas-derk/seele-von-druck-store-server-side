// Import Cart Model Object

const { cartModel, productModel, userModel } = require("../models/all.models");

const { getSuitableTranslations } = require("../global/functions");

async function addNewProduct(authorizationId, productInfo, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo){
            const product = await productModel.findById(productInfo.productId);
            if (product) {
                await (new cartModel({
                    userId: authorizationId,
                    product: productInfo.productId,
                    quantity: productInfo.quantity,
                    designFiles: productInfo.designFiles,
                    ...(productInfo.type && {type: productInfo.type}),
                    ...(productInfo.width && {width: productInfo.width}),
                    ...(productInfo.height && {height: productInfo.height}),
                    ...(productInfo.typeQuantity && {height: productInfo.typeQuantity}),
                    ...(productInfo.quantityPrice && {height: productInfo.quantityPrice}),
                })).save();
                return {
                    msg: getSuitableTranslations("Adding New Product To Cart For This User Process Has Been Successfuly !!", language),
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
                msg: getSuitableTranslations("Get All Products Inside The Cart For This User Process Has Been Successfully !!", language),
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

async function deleteProduct(authorizationId, cartId, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo){
            const product = await cartModel.findOneAndDelete({ _id: cartId });
            if (product) {
                return {
                    msg: getSuitableTranslations("Deleting Product From Cart For This User Process Has Been Successfuly !!", language),
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

async function updateProduct(authorizationId, cartId, newData, language) {
    try {
        const userInfo = await userModel.findById(authorizationId);
        if (userInfo){
            const product = await cartModel.findOneAndUpdate({ _id: cartId }, newData);
            if (product) {
                return {
                    msg: getSuitableTranslations("Updating Product Info Inside The Cart For This User Process Has Been Successfully !!", language),
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