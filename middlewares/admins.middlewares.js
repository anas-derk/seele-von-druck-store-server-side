const { getResponseObject } = require("../global/functions");
const { verify } = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    verify(token, process.env.secretKey, async (err, decode) => {
        if (err) {
            return res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
        }
        req.data = decode;
        next();
    });
}

module.exports = {
    adminMiddleware,
}