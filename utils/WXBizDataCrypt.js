var crypto = require('cryptojs.js').Crypto;

function RdWXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

RdWXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode ：使用 CryptoJS 中 Crypto.util.base64ToBytes()进行 base64解码
  var encryptedData = crypto.util.base64ToBytes(encryptedData)
  var key = crypto.util.base64ToBytes(this.sessionKey);
  var iv = crypto.util.base64ToBytes(iv);

  // 对称解密使用的算法为 AES-128-CBC，数据采用PKCS#7填充
  var mode = new crypto.mode.CBC(crypto.pad.pkcs7);

  try {
    // 解密
    var bytes = crypto.AES.decrypt(encryptedData, key, {
      asBpytes: true,
      iv: iv,
      mode: mode
    });

    var decryptResult = JSON.parse(bytes);
    return decryptResult;
  } catch (err) {
    
  }

  // if (decryptResult.watermark.appid !== this.appId) {
    
  // }
  
  
}

module.exports = RdWXBizDataCrypt
