// Import Global Password Model And Admin Model Object

const { globalPasswordModel, adminModel } = require("./all.models");

// require cryptoJs module for password encrypting

const cryptoJS = require("crypto-js");

async function getPasswordForBussinessEmail(email, language){
    try{
        const { getSuitableTranslations } = require("../global/functions");
        const user = await globalPasswordModel.findOne({ email });
        if (user) {
            return {
                msg: getSuitableTranslations("Get Password For Bussiness Email Process Has Been Successfully !!", language),
                error: false,
                data: cryptoJS.AES.decrypt(user.password, process.env.secretKey).toString(cryptoJS.enc.Utf8),
            }
        }
        return {
            msg: getSuitableTranslations("Sorry, Email Incorrect !!", language),
            error: true,
            data: {},
        }
    }
    catch(err){
        throw Error(err);
    }
}

async function changeBussinessEmailPassword(authorizationId, email, password, newPassword, language) {
    try {
        const { getSuitableTranslations } = require("../global/functions");
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            if (admin.isSuperAdmin) {
                const user = await globalPasswordModel.findOne({ email });
                if (user) {
                    if (cryptoJS.AES.decrypt(user.password, process.env.secretKey).toString(cryptoJS.enc.Utf8) === password) {
                        await globalPasswordModel.updateOne({ password: cryptoJS.AES.encrypt(newPassword, process.env.secretKey).toString() });
                        return {
                            msg: getSuitableTranslations("Changing Bussiness Email Password Process Has Been Successfully !!", language),
                            error: false,
                            data: {},
                        }
                    }
                    return {
                        msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                        error: true,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, Email Or Password Incorrect !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, Permission Denied !!", language),
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
    getPasswordForBussinessEmail,
    changeBussinessEmailPassword,
}