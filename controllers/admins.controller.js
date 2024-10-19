const { getResponseObject, getSuitableTranslations } = require("../global/functions");

const adminsOPerationsManagmentFunctions = require("../models/admins.model");

const { sign } = require("jsonwebtoken");

async function getAdminLogin(req, res) {
    try{
        const { email, password, language } = req.query;
        const result = await adminsOPerationsManagmentFunctions.adminLogin(email.trim().toLowerCase(), password, language);
        if (!result.error) {
            res.json({
                ...result,
                data: {
                    token: sign(result.data, process.env.secretKey, {
                        expiresIn: "7d",
                    }),
                }
            });
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAdminUserInfo(req, res) {
    try{
        res.json(await adminsOPerationsManagmentFunctions.getAdminUserInfo(req.data._id, req.query.language));
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "firstName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "lastName") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "email") filtersObject[objectKey] = filters[objectKey];
    }
    return filtersObject;
}

async function getAdminsCount(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.getAdminsCount(req.data._id, getFiltersObject(req.query), req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Merchant Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllAdminsInsideThePage(req, res) {
    try{
        const filters = req.query;
        const result = await adminsOPerationsManagmentFunctions.getAllAdminsInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Merchant Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postAddNewAdmin(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.addNewAdmin(req.data._id, req.body, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putAdminInfo(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.updateAdminInfo(req.data._id, req.params.adminId, req.body, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteAdmin(req, res) {
    try{
        const result = await adminsOPerationsManagmentFunctions.deleteAdmin(req.data._id, req.params.adminId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, Permission Denied !!" || result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

module.exports = {
    getAdminLogin,
    getAdminUserInfo,
    getAdminsCount,
    getAllAdminsInsideThePage,
    postAddNewAdmin,
    putAdminInfo,
    deleteAdmin
}