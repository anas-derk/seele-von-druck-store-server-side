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

module.exports = {
    getAllTemplates,
}