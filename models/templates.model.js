// Import Template And Admin Model Object

const { getSuitableTranslations } = require("../global/functions");

const { templateModel, adminModel } = require("../models/all.models");

async function getAllTemplates(authorizationId, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            return {
                msg: getSuitableTranslations("Get All Templates Process Has Been Successfully !!", language),
                error: false,
                data: await templateModel.find(),
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

async function updateTemplate(authorizationId, templateId, newTemplateComponents, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const template = await templateModel.findOneAndUpdate({ _id: templateId }, { components: newTemplateComponents });
            if (template) {
                return {
                    msg: getSuitableTranslations("Update Template Process Has Been Successfully !!", language),
                    error: false,
                    data: {},
                }
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
    getAllTemplates,
    updateTemplate
}