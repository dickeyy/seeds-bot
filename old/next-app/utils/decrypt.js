const CryptoJS = require("crypto-js");

function decrypt(data, pass) {
    var bytes  = CryptoJS.AES.decrypt(data, pass);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}

// Exports
exports.decrypt = decrypt