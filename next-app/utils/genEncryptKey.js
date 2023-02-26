const CryptoJS = require("crypto-js");

// Generate an encryption key
function genEncryptKey() {
    var hashBase = CryptoJS.lib.WordArray.random(128 / 8);
  
    var hash1 = CryptoJS.SHA3(hashBase).toString();
    var hash2 = CryptoJS.SHA3(hash1).toString();
    var encryptKey = CryptoJS.SHA512(hash2).toString();
  
    return encryptKey;
}

// Export genEncryptKey
exports.genEncryptKey = genEncryptKey