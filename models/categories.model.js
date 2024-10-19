// Import Category And Admin Model Object

const { categoryModel, adminModel, productModel } = require("../models/all.models");

const { getSuitableTranslations } = require("../global/functions");

async function addNewCategory(authorizationId, categoryName, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findOne({ name: categoryName });
            if (category) {
                return {
                    msg: getSuitableTranslations("Sorry, This Cateogry Is Already Exist !!", language),
                    error: true,
                    data: {},
                }
            }
            await (new categoryModel({
                name: categoryName,
            })).save();
            return {
                msg: getSuitableTranslations("Adding New Category Process Has Been Successfuly !!", language),
                error: false,
                data: {},
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function getAllCategories(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Categories Process Has Been Successfully !!", language),
            error: false,
            data: await categoryModel.find(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoryInfo(categoryId, language) {
    try {
        const categoryInfo = await categoryModel.findById(categoryId);
        if (categoryInfo) {
            return {
                msg: getSuitableTranslations("Get Category Info Process Has Been Successfuly !!", language),
                error: false,
                data: categoryInfo,
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getCategoriesCount(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Categories Count Process Has Been Successfully !!", language),
            error: false,
            data: await categoryModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllCategoriesInsideThePage(pageNumber, pageSize, filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Categories Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: await categoryModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteCategory(authorizationId, categoryId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findOneAndDelete({
                _id: categoryId,
            });
            if (category) {
                await productModel.updateMany({ categoryId }, { category: "uncategorized" });
                return {
                    msg: getSuitableTranslations("Deleting Category Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
                error: true,
                data: {},
            };
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

async function updateCategory(authorizationId, categoryId, newCategoryName, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const category = await categoryModel.findOneAndUpdate( { _id: categoryId }, { name: newCategoryName });
            if (category) {
                return {
                    msg: getSuitableTranslations("Updating Category Info Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                };
            }
            return {
                msg: getSuitableTranslations("Sorry, This Category Is Not Exist !!", language),
                error: true,
                data: {},
            };
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
    addNewCategory,
    getAllCategories,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    getCategoryInfo,
    deleteCategory,
    updateCategory,
}