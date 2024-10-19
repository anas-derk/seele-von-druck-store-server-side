// Import Brand Model Object

const { getSuitableTranslations } = require("../global/functions");

const { brandModel, adminModel } = require("../models/all.models");

async function addNewBrand(authorizationId, brandInfo, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            await (new brandModel(brandInfo)).save();
            return {
                msg: getSuitableTranslations("Adding New Brand Process Has Been Successfuly !!", language),
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

async function getLastSevenBrands(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Last Seven Brands Process Has Been Successfully !!", language),
            error: false,
            data: await brandModel.find(filters).limit(7),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getBrandsCount(filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get Brands Count Process Has Been Successfully !!", language),
            error: false,
            data: await brandModel.countDocuments(filters),
        }
    }
    catch (err) {
        throw Error(err);
    }
}

async function getAllBrandsInsideThePage(pageNumber, pageSize, filters, language) {
    try {
        return {
            msg: getSuitableTranslations("Get All Brands Inside The Page: {{pageNumber}} Process Has Been Successfully !!", language, { pageNumber }),
            error: false,
            data: await brandModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize),
        };
    }
    catch (err) {
        throw Error(err);
    }
}

async function deleteBrand(authorizationId, brandId, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const brandInfo = await brandModel.findOneAndDelete({
                _id: brandId,
            });
            if (brandInfo) {
                return {
                    error: false,
                    msg: getSuitableTranslations("Deleting Brand Process Has Been Successfuly !!", language),
                    data: {
                        deletedBrandPath: brandInfo.imagePath,
                    },
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Brand Is Not Exist !!", language),
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

async function updateBrandInfo(authorizationId, brandId, newBrandTitle, language) {
    try {
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const brandInfo = await brandModel.findOneAndUpdate({ _id: brandId }, { title: newBrandTitle });
            if (brandInfo) {
                return {
                    msg: getSuitableTranslations("Updating Brand Info Process Has Been Successfuly !!", language),
                    error: false,
                    data: {},
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Brand Is Not Exist !!", language),
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

async function changeBrandImage(authorizationId, brandId, newBrandImagePath, language) {
    try{
        const admin = await adminModel.findById(authorizationId);
        if (admin){
            const brand = await brandModel.findOneAndUpdate({ _id: brandId }, { imagePath: newBrandImagePath });
            if (brand) {
                return {
                    msg: getSuitableTranslations("Updating Brand Image Process Has Been Successfully !!", language),
                    error: false,
                    data: { deletedBrandImagePath: brand.imagePath }
                }
            }
            return {
                msg: getSuitableTranslations("Sorry, This Brand Is Not Exist !!", language),
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
    addNewBrand,
    getLastSevenBrands,
    getBrandsCount,
    getAllBrandsInsideThePage,
    deleteBrand,
    updateBrandInfo,
    changeBrandImage,
}