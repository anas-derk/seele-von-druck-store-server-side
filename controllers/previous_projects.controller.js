const { getResponseObject, handleResizeImagesAndConvertFormatToWebp, getSuitableTranslations } = require("../global/functions");

const previousProjectsManagmentFunctions = require("../models/previous_projects.model");

const { unlinkSync } = require("fs");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "storeId") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function postNewPreviousProduct(req, res) {
    try{
        const outputImageFilePath = `assets/images/previous-projects/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await previousProjectsManagmentFunctions.addNewPreviousProject(req.data._id, {
            ...{ title } = Object.assign({}, req.body),
            imagePath: outputImageFilePath,
        }, req.query.language);
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

async function getPreviousProductsCount(req, res) {
    try {
        res.json(await previousProjectsManagmentFunctions.getPreviousProductsCount(getFiltersObject(req.query), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllPreviousProjectsInsideThePage(req, res) {
    try {
        const filters = req.query;
        res.json(await previousProjectsManagmentFunctions.getAllPreviousProjectsInsideThePage(filters.pageNumber, filters.pageSize, getFiltersObject(filters), req.query.language));
    }
    catch (err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deletePreviousProject(req, res) {
    try{
        const result = await previousProjectsManagmentFunctions.deletePreviousProject(req.data._id, req.params.projectId, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedPreviousProjectPath);
        }
        else {
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

async function putPreviousProjectInfo(req, res) {
    try{
        const result = await previousProjectsManagmentFunctions.updatePreviousProjectInfo(req.data._id, req.params.projectId, req.body.newProjectDescription, req.query.language);
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

async function putPreviousProjectImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/previous-projects/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await previousProjectsManagmentFunctions.changePreviousProjectImage(req.data._id, req.params.projectId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.deletedPreviousProjectPath);
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

module.exports = {
    postNewPreviousProduct,
    getPreviousProductsCount,
    getAllPreviousProjectsInsideThePage,
    deletePreviousProject,
    putPreviousProjectInfo,
    putPreviousProjectImage,
}