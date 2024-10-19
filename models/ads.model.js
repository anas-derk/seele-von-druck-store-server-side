// Import Product Model Object

const { getSuitableTranslations } = require("../global/functions");

const { adModel, adminModel } = require("../models/all.models");

async function addNewAd(authorizationId, adsInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const textAdsCount = await adModel.countDocuments({ type: adsInfo.type });
            if (textAdsCount >= 10) {
                return {
                    msg: getSuitableTranslations("Sorry, Can't Add New Text Ad Because Arrive To Max Limits For Text Ads Count ( Limits: 10 ) !!", language),
                    error: true,
                    data: {},
                }
            }
            await (new adModel(adsInfo)).save();
            return {
                msg: getSuitableTranslations("Adding New Text Ad Process Has Been Successfully !!", language),
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
    catch (err) {
        throw Error(err);
    }
}

async function getAllAds(filters, language) {
    try{
        return {
            msg: getSuitableTranslations("Get All Ads Process Has Been Successfully !!", language),
            error: false,
            data: await adModel.find(filters),
        }
    }
    catch(err) {
        throw Error(err);
    }
}

async function deleteAd(authorizationId, adId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const adInfo = await adModel.findOneAndDelete({
                _id: adId,
            });
            if (adInfo) {
                return {
                    msg: getSuitableTranslations("Deleting Ad Process Has Been Successfuly !!", language),
                    error: false,
                    data: adInfo.type === "image" ? {
                        deletedAdImagePath: adInfo.imagePath,
                    } : {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
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

async function updateAdImage(authorizationId, adId, newAdImagePath, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const adInfo = await adModel.findOneAndUpdate({ _id: adId }, { imagePath: newAdImagePath });
            if (adInfo) {
                return {
                    msg: getSuitableTranslations("Change Ad Image Process Has Been Successfully !!", language),
                    error: false,
                    data: {
                        oldAdImagePath: adInfo.imagePath,
                        newAdImagePath
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
                error: true,
                data: adInfo.imagePath,
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

async function updateTextAdContent(authorizationId, adId, newTextAdContent, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const adInfo = await adModel.findOneAndUpdate({ _id: adId }, { content: newTextAdContent });
            if (adInfo) {
                if (adInfo.type === "text") {
                    return {
                        msg:  getSuitableTranslations("Updating Text Ad Content Process Has Been Successfuly !!", language),
                        error: false,
                        data: {},
                    }
                }
                return {
                    msg: getSuitableTranslations("Sorry, Type Of Ad Is Not Text !!", language),
                    error: true,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Ad Is Not Exist !!", language),
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
    addNewAd,
    getAllAds,
    deleteAd,
    updateAdImage,
    updateTextAdContent
}