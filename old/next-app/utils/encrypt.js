const CryptoJS = require("crypto-js");

function encrypt(data, pass) {
    var encryptedData = CryptoJS.AES.encrypt(data, pass).toString();
    return encryptedData;
}

// Exports
exports.encrypt = encrypt