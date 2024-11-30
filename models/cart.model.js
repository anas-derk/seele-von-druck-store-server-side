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

async function getAllProductsInsideTheCart(pageNumber, pageSize, filters, sortDetailsObject, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Products Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: {
                productsCount: await productModel.countDocuments(),
                products: await productModel.find(filters).sort(sortDetailsObject).skip((pageNumber - 1) * pageSize).limit(pageSize).populate({
                    path: "category",
                    populate: { path: "template" }
                }),
                currentDate: new Date()
            },
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteProduct(authorizationId, productId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const productInfo = await productModel.findOneAndDelete({
                _id: productId,
            });
            if (productInfo) {
                return {
                    msg: getSuitableTranslations("Deleting Product Process Has Been Successfuly !!", language),
                    error: false,
                    data: {
                        deletedProductImagePath: productInfo.imagePath,
                        galleryImagePathsForDeletedProduct: productInfo.galleryImagesPaths,
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
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
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
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findById(newData.categoryId);
            if (category) {
                newData.category = category.name;
            }
            const product = await productModel.findOneAndUpdate({ _id: productId }, newData);
            if (product) {
                return {
                    msg: getSuitableTranslations("Updating Product Info Process Has Been Successfully !!", language),
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
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
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
    getAllProductsInsideTheCart,
    deleteProduct,
    updateProduct,
}