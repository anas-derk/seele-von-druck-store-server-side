const { getResponseObject, getSuitableTranslations } = require("../global/functions");

const templatesOPerationsManagmentFunctions = require("../models/templates.model.js");

async function getAllTemplates(req, res) {
    try{
        const result = await templatesOPerationsManagmentFunctions.getAllTemplates(req.data._id, req.query.language);
        if (result.error) {
            return res.status(401).json(result);
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    getAllTemplates
}