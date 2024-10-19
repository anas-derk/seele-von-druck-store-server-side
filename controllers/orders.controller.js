const { getResponseObject, sendReceiveOrderEmail, sendUpdateOrderEmail, getSuitableTranslations } = require("../global/functions");

const ordersManagmentFunctions = require("../models/orders.model");

const { post } = require("axios");

function getFiltersObject(filters) {
    let filtersObject = {};
    for (let objectKey in filters) {
        if (objectKey === "destination") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "orderNumber") filtersObject[objectKey] = Number(filters[objectKey]);
        if (objectKey === "checkoutStatus") {
            if (filters["destination"] === "admin"){
                filtersObject[objectKey] = Number(filters[objectKey])
            }
        }
        if (objectKey === "_id") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "status") filtersObject[objectKey] = filters[objectKey];
        if (objectKey === "customerName") filtersObject[`billing_address.given_name`] = filters[objectKey];
        if (objectKey === "email") filtersObject[`billing_address.email`] = filters[objectKey];
        if (objectKey === "customerId") {
            if (filters["destination"] === "admin") {
                filtersObject[objectKey] = filters[objectKey];
            }
        }
        if (objectKey === "isDeleted") {
            if (filters[objectKey] === "yes") {
                filtersObject[objectKey] = true;
            }
            else filtersObject[objectKey] = false;
        }
    }
    return filtersObject;
}

function getFiltersObjectForUpdateOrder(acceptableData) {
    let filterdData = {};
    if (acceptableData.status) filterdData.status = acceptableData.status;
    if (acceptableData.orderAmount) filterdData.orderAmount = acceptableData.orderAmount;
    return filterdData;

}

async function getOrdersCount(req, res) {
    try{
        res.json(await ordersManagmentFunctions.getOrdersCount(req.data._id, getFiltersObject(req.query), req.query.language));
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getAllOrdersInsideThePage(req, res) {
    try{
        const filters = req.query;
        res.json(await ordersManagmentFunctions.getAllOrdersInsideThePage(req.data._id, filters.pageNumber, filters.pageSize, getFiltersObject(filters), filters.language));
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function getOrderDetails(req, res) {
    try{
        res.json(await ordersManagmentFunctions.getOrderDetails(req.params.orderId, req.query.language));
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postNewOrder(req, res) {
    try{
        const result = await ordersManagmentFunctions.createNewOrder(req.body, req.query.language);
        if (!result.error) {
            if (req.body.checkoutStatus === "Checkout Successfull") {
                await sendReceiveOrderEmail(result.data.billingAddress.email, result.data, result.data.language);
            }
            return res.json({
                ...result,
                data: {
                    orderId: result.data.orderId,
                    orderNumber: result.data.orderNumber
                }
            });
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postNewPaymentOrder(req, res) {
    try{
        const orderData = req.body;
        if (req?.data._id){
            orderData.userId = req.data._id;
        }
        const result = await ordersManagmentFunctions.createNewOrder(orderData, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This User Is Not Exist !!") {
                return res.status(401).json(result);
            }
            return res.json(result);
        }
        else {
            if (orderData.paymentGateway === "tap") {
                const response = await post(`${process.env.TAP_PAYMENT_GATEWAY_BASE_API_URL}/charges`, {
                    amount: result.data.orderAmount,
                    currency: "USD",
                    receipt: {
                        email: true,
                        sms: false
                    },
                    customer: {
                        first_name: orderData.billingAddress.firstName,
                        last_name: orderData.billingAddress.lastName,
                        email: orderData.billingAddress.email
                    },
                    source: {
                        id: "src_all"
                    },
                    reference: {
                        transaction: result.data.orderId,
                        order: result.data.orderNumber,
                    },
                    redirect: {
                        url: `${process.env.NODE_ENV === "test" ? "http://localhost:3000" : "https://ubuyblues.com"}/confirmation/${result.data._id}`
                    },
                    post: {
                        url: `https://api.ubuyblues.com/orders/handle-checkout-complete/${result.data._id}`
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${process.env.TAP_PAYMENT_GATEWAY_SECRET_KEY}`
                    }
                });
                return res.json(getResponseObject(getSuitableTranslations("Creating New Payment Order By Tap Process Has Been Successfully !!", language), false, response.data));
            }
        }
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function postCheckoutComplete(req, res) {
    try{
        const result = await ordersManagmentFunctions.changeCheckoutStatusToSuccessfull(req.params.orderId, req.query.language);
        res.json(result);
        if (!result.error) {
            await sendReceiveOrderEmail(result.data.billingAddress.email, result.data, "ar");
        }
    }
    catch(err) {
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putOrder(req, res) {
    try{
        const { status, orderAmount } = req.body;
        const result = await ordersManagmentFunctions.updateOrder(req.data._id, req.params.orderId, getFiltersObjectForUpdateOrder({ status, orderAmount }), req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        if (req.query.isSendEmailToTheCustomer) {
            if (status === "shipping" || status === "completed") {
                result.data.status = status;
                await sendUpdateOrderEmail(result.data.billingAddress.email, result.data, result.data.language);
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function putOrderProduct(req, res) {
    try{
        const result = await ordersManagmentFunctions.updateOrderProduct(req.data._id, req.params.orderId, req.params.productId, req.body, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteOrder(req, res) {
    try{
        const result = await ordersManagmentFunctions.deleteOrder(req.data._id, req.params.orderId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
                return res.status(401).json(result);
            }
        }
        res.json(result);
    }
    catch(err){
        res.status(500).json(getResponseObject(getSuitableTranslations("Internal Server Error !!", req.query.language), true, {}));
    }
}

async function deleteProductFromOrder(req, res) {
    try{
        const { orderId, productId } = req.params;
        const result = await ordersManagmentFunctions.deleteProductFromOrder(req.data._id, orderId, productId, req.query.language);
        if (result.error) {
            if (result.msg === "Sorry, This Admin Is Not Exist !!") {
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
    getAllOrdersInsideThePage,
    getFiltersObject,
    getOrdersCount,
    getOrderDetails,
    postNewOrder,
    postNewPaymentOrder,
    postCheckoutComplete,
    putOrder,
    putOrderProduct,
    deleteOrder,
    deleteProductFromOrder,
}