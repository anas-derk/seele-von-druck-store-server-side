const { getResponseObject, handleResizeImagesAndConvertFormatToWebp, getSuitableTranslations } = require("../global/functions");

const adsOPerationsManagmentFunctions = require("../models/ads.model");

const { unlinkSync } = require("fs");

async function postNewTextAd(req, res) {
    try{
        const result = await adsOPerationsManagmentFunctions.addNewAd(req.data._id, { content: req.body.content, type: "text" }, req.query.language);
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

async function postNewImageAd(req, res) {
    try{
        const outputImageFilePath = `assets/images/ads/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await adsOPerationsManagmentFunctions.addNewAd(req.data._id, {
            ...Object.assign({}, req.body),
            imagePath: outputImageFilePath,
            type: "image"
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

async function getAllAds(req, res) {
    try{
        res.json(await adsOPerationsManagmentFunctions.getAllAds(req.query.language));
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteAd(req, res) {
    try {
        const result = await adsOPerationsManagmentFunctions.deleteAd(req.data._id, req.params.adId, req.query.language);
        if(!result.error && result.data?.deletedAdImagePath) {
            unlinkSync(result.data.deletedAdImagePath);
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

async function putAdImage(req, res) {
    try {
        const outputImageFilePath = `assets/images/ads/${Math.random()}_${Date.now()}__${req.file.originalname.replaceAll(" ", "_").replace(/\.[^/.]+$/, ".webp")}`;
        await handleResizeImagesAndConvertFormatToWebp([req.file.buffer], [outputImageFilePath]);
        const result = await adsOPerationsManagmentFunctions.updateAdImage(req.data._id, req.params.adId, outputImageFilePath, req.query.language);
        if (!result.error) {
            unlinkSync(result.data.oldAdImagePath);
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

async function putTextAdContent(req, res) {
    try{
        const result = await adsOPerationsManagmentFunctions.updateTextAdContent(req.data._id, req.params.adId, req.body.content, req.query.language);
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

module.exports = {
    postNewTextAd,
    postNewImageAd,
    getAllAds,
    deleteAd,
    putAdImage,
    putTextAdContent
}