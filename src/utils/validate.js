/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

export function validUsername(str) {
  const validMap = ['admin', 'editor'];
  return validMap.indexOf(str.trim()) >= 0;
}

/* 合法uri */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/* 小写字母 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


class ValidateType {
  // 校验手机
  static validatePhone(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入手机号码'));
    } else {
      const reg = /^$|^((13[0-9])|(14[0-9])|(15[^4,\D])|(16[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))\d{8}$/;
      const texterr = '手机号码格式不正确';
      if (!reg.test(value)) {
        callback(texterr);
      }
      callback();
    }
  }

  // 校验邮箱
  static validateEmail(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入邮箱'));
    } else {
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      const texterr = '邮箱格式不正确';
      if (!reg.test(value)) {
        callback(texterr);
      }
      callback();
    }
  }

  // 校验座机
  static validateTel(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入座机'));
    } else {
      const reg = /^\d{3,4}-?\d{7,9}$/;
      // let reg = /^\d{7,13}$/
      const texterr = '座机格式不正确';
      if (!reg.test(value)) {
        callback(texterr);
      }
      callback();
    }
  }

  // 校验qq
  static validateQQ(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入QQ'));
    } else {
      const reg = /[1-9][0-9]{4,14}/;
      const texterr = 'QQ格式不正确';
      if (!reg.test(value)) {
        callback(texterr);
      }
      callback();
    }
  }

  // 校验微信
  static validateweiXin(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入微信'));
    } else {
      const reg = /^[a-zA-Z0-9]([-_a-zA-Z0-9]{5,19})+$/;
      const texterr = '微信格式不正确';
      if (!reg.test(value)) {
        callback(texterr);
      }
      callback();
    }
  }

  // 校验密码长度为8-20位,字母区分大小写,
  static validatePassWord(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入密码'));
    } else {
      const reg = /^\S*([a-zA-Z]+\S*[0-9]+|[0-9]+\S*[a-zA-Z]+)\S*$/;
      const texterr = '密码长度为8-20位,字母区分大小写';
      if (value.length < 8) {
        callback(texterr);
      }
      if (!reg.test(value)) {
        callback(texterr);
      }
      callback();
    }
  }
}
export default ValidateType;
