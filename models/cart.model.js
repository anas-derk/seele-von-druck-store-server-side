// Import Cart Model Object

const { cartModel, productModel, userModel } = require("../models/all.models");

const { getSuitableTranslations } = require("../global/functions");

async function addNewProduct(authorizationId, productInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const product = await productModel.findOne({ name: productInfo.name, category: productInfo.category });
            if (!product) {
                if (product.template) {
                    if (!(await templateModel.findById(product.template))) {
                        return {
                            msg: getSuitableTranslations("Sorry, This Template Is Not Exist !!", language),
                            error: true,
                            data: {},
                        }
                    }
                }
                const category = await categoryModel.findById(productInfo.category);
                if (category) {
                    await (new productModel(productInfo)).save();
                    return {
                        msg: getSuitableTranslations("Adding New Product Process Has Been Successfuly !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Product Is Already Exist !!", language),
                error: true,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
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