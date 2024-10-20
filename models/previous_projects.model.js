// Import Brand Model Object

const { getSuitableTranslations } = require("../global/functions");

const { previousProjectModel, adminModel } = require("../models/all.models");

async function addNewPreviousProject(authorizationId, previousProjectInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            await (new previousProjectModel(previousProjectInfo)).save();
            return {
                msg: getSuitableTranslations("Adding New Previous Project Process Has Been Successfuly !!", language),
                error: false,
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

async function getPreviousProductsCount(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Previous Projects Count Process Has Been Successfully !!", language),
            error: false,
            data: await previousProjectModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllPreviousProjectsInsideThePage(pageNumber, pageSize, filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Previous Projects Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: await previousProjectModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function deletePreviousProject(authorizationId, projectId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const previousProjectInfo = await previousProjectModel.findOneAndDelete({
                _id: projectId,
            });
            if (previousProjectInfo) {
                return {
                    error: false,
                    msg: getSuitableTranslations("Deleting Previous Project Process Has Been Successfuly !!", language),
                    data: {
                        deletedPreviousProjectPath: previousProjectInfo.imagePath,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Previous Project Is Not Exist !!", language),
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

async function updatePreviousProjectInfo(authorizationId, projectId, newPreviousProjectDescription, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const previousProjectInfo = await previousProjectModel.findOneAndUpdate({ _id: projectId }, { description: newPreviousProjectDescription });
            if (previousProjectInfo) {
                return {
                    msg: getSuitableTranslations("Updating Previous Project Info Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Previous Project Is Not Exist !!", language),
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

async function changePreviousProjectImage(authorizationId, projectId, newPreviousProjectPath, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const previousProjectInfo = await previousProjectModel.findOneAndUpdate({ _id: projectId }, { imagePath: newPreviousProjectPath });
            if (previousProjectInfo) {
                return {
                    msg: getSuitableTranslations("Updating Previous Project Image Process Has Been Successfully !!", language),
                    error: false,
                    data: { deletedPreviousProjectPath: previousProjectInfo.imagePath }
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Previous Project Is Not Exist !!", language),
                error: true,
                data: {}
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, This Admin Is Not Exist !!", language),
            error: true,
            data: {},
        }
    }
    catch(err) {
        throw Error(err);
    }
}

module.exports = {
    addNewPreviousProject,
    getPreviousProductsCount,
    getAllPreviousProjectsInsideThePage,
    deletePreviousProject,
    updatePreviousProjectInfo,
    changePreviousProjectImage,
}