const { getResponseObject, getSuitableTranslations } = require("../global/functions");

const categoriesManagmentFunctions = require("../models/categories.model");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "categoryId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postNewCategory(req, res) {
    try{
        const { categoryName } = req.body;
        const result = await categoriesManagmentFunctions.addNewCategory(req.data._id, categoryName, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllCategories(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getAllCategories(getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getCategoryInfo(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getCategoryInfo(req.params.categoryId, req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getCategoriesCount(req, res) {
    try {
        res.json(await categoriesManagmentFunctions.getCategoriesCount(getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllCategoriesInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await categoriesManagmentFunctions.getAllCategoriesInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteCategory(req, res) {
    try{
        const result = await categoriesManagmentFunctions.deleteCategory(req.data._id, req.params.categoryId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putCategory(req, res) {
    try{
        const result = await categoriesManagmentFunctions.updateCategory(req.data._id, req.params.categoryId, req.body.newCategoryName, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                res.status(401).json(result);
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    postNewCategory,
    getAllCategories,
    getCategoriesCount,
    getAllCategoriesInsideThePage,
    getCategoryInfo,
    deleteCategory,
    putCategory,
}