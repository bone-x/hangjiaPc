/**
 * Localforage2
 * 扩展本地存储库localforage添加加密特性
 * 注：
 *    getItem，setItem操作都是异步的，返回Promise
 *    只对数据类型【String，Object，Array】进行加密；不满足的数据类型，以字符串的格式存储
 * 参考文档：
 *    https://localforage.docschina.org
 *    https://cryptojs.gitbook.io/docs/#documentation
 * 用例：
 *  Localforage2.setItem('token', { a: 123, b: 3423 });
      .then((saveVal) => {
        // 存储成功，存储值saveVal（已加密）
        getItem('token');
          .then((val) => {
            // 取值成功，存储值val（已解密）
            console.log(val);
          })
          .catch((err) => {
            // 取值失败
          });
      })
      .catch((err) => {
        // 存储失败
      })
 */

import CryptoJS from 'crypto-js';
import localforage from 'localforage';

localforage.config({
  name: 'hqjy-hangjia-',
  storeName: 'cms',
});

/**
 * 字符串转16进制
 * @param {String} str 待转换字符串
 * @returns {String} 16进制字符串
 */
const stringToHex = (str) => {
  const parseStr = `${str}`;
  let val = '';
  let i = 0;
  const len = parseStr.length;
  for (; i < len; i += 1) {
    if (val === '') val = parseStr.charCodeAt(i).toString(16);
    else val += parseStr.charCodeAt(i).toString(16);
  }
  return val;
};

/**
 * 字符串长度限制，不足则补充字符
 * @param {String} str 待处理字符串
 * @param {Number} length 最大长度
 * @param {String} char 补充字符
 */
const lengthToMax = (str, length = 16, char = 'k') => {
  let res = `${str}`;
  const len = res.length;
  if (len > length) res = res.substring(0, length);
  else {
    let i = 0;
    for (; i < length - len; i += 1) res += char;
  }
  return res;
};

// 密钥（16位16进制）
const cryptoKey = CryptoJS.enc.Utf8.parse(lengthToMax(stringToHex('HQJY-HANGJIA-CMS')));
// 偏移量（16位16进制）
const cryptoIv = CryptoJS.enc.Utf8.parse(lengthToMax(stringToHex(300338)));


/**
 * main class
 */
class Localforage2 {
  /**
   * 对字符串进行加密
   * @param {String} word 待加密的字符串
   * @returns {String}
   */
  static encrypt(word = String) {
    let str;
    const wordTpye = Object.prototype.toString.call(word);

    if (wordTpye === '[object Object]' || wordTpye === '[object Array]') {
      try {
        str = JSON.stringify(word);
      } catch (e) {
        console.error(e);
      }
    } else {
      str = `${word}`;
    }

    const srcs = CryptoJS.enc.Utf8.parse(str);
    const encrypted = CryptoJS.AES.encrypt(srcs, cryptoKey, {
      iv: cryptoIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.ciphertext.toString().toUpperCase();
  }

  /**
   * 对字符串进行解密
   * @param {String} word 待解密的字符串
   * @returns {String}
   */
  static decrypt(word = String) {
    const wordStr = `${word}`;
    const encryptedHexStr = CryptoJS.enc.Hex.parse(wordStr);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decryptRes = CryptoJS.AES.decrypt(srcs, cryptoKey, {
      iv: cryptoIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptedStr = decryptRes.toString(CryptoJS.enc.Utf8);
    let res = decryptedStr.toString();

    try {
      res = JSON.parse(res);
    } catch (e) {
      console.error('decrypt JSON.parse err:', res);
    }

    return res;
  }

  /**
   * 异步存储数据到本地缓存（优先级：indexedDB > webSQL > localStorage）
   * @param {String} key 键
   * @param {Any} value 值
   * @returns {Promise}
   *    then {String} 接收到成功存储后加密字符串
   */
  static setItem(key = String, value) {
    return localforage.setItem(this.encrypt(key), this.encrypt(value));
  }

  /**
   * 异步获取存储的数据
   * @param {String} key 键
   * @returns {Promise}
   *    then {String} 接收到成功获取的数据（已解密）
   */
  static getItem(key = String) {
    const encryptKey = this.encrypt(key);
    return new Promise((resolve, reject) => {
      localforage
        .getItem(encryptKey)
        .then((val) => {
          resolve(this.decrypt(val));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default Localforage2;
