/* eslint-disable */
import moment from 'moment';
import { downloadFiledata } from '@/api/index.js';

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time, 10);
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time *= 1000;
        }
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
    };
    const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value];
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });
    return timeStr;
}

export function formatTime(time, option) {
    time = +time * 1000;
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
        return '刚刚';
    }
    if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前';
    }
    if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前';
    }
    if (diff < 3600 * 24 * 2) {
        return '1天前';
    }
    if (option) {
        return parseTime(time, option);
    }
    return (
        d.getMonth() +
        1 +
        '月' +
        d.getDate() +
        '日' +
        d.getHours() +
        '时' +
        d.getMinutes() +
        '分'
    );
}

// 格式化时间
export function getQueryObject(url) {
    url = url == null ? window.location.href : url;
    const search = url.substring(url.lastIndexOf('?') + 1);
    const obj = {};
    const reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1);
        let val = decodeURIComponent($2);
        val = String(val);
        obj[name] = val;
        return rs;
    });
    return obj;
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
    let len = 0;
    for (let i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/gi) != null) {
            len += 1;
        } else {
            len += 0.5;
        }
    }
    return Math.floor(len);
}

export function cleanArray(actual) {
    const newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

export function param(json) {
    if (!json) return '';
    return cleanArray(
        Object.keys(json).map((key) => {
            if (json[key] === undefined) return '';
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        }),
    ).join('&');
}

export function param2Obj(url) {
    const search = url.split('?')[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
        '"}',
    );
}

export function html2Text(val) {
    const div = document.createElement('div');
    div.innerHTML = val;
    return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
    /* Merges two  objects,
       giving the last one precedence */

    if (typeof target !== 'object') {
        target = {};
    }
    if (Array.isArray(source)) {
        return source.slice();
    }
    Object.keys(source).forEach((property) => {
        const sourceProperty = source[property];
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty);
        } else {
            target[property] = sourceProperty;
        }
    });
    return target;
}

export function toggleClass(element, className) {
    if (!element || !className) {
        return;
    }
    let classString = element.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += '' + className;
    } else {
        classString = classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length);
    }
    element.className = classString;
}

export const pickerOptions = [{
    text: '今天',
    onClick(picker) {
        const end = new Date();
        const start = new Date(new Date().toDateString());
        end.setTime(start.getTime());
        picker.$emit('pick', [start, end]);
    },
},
{
    text: '最近一周',
    onClick(picker) {
        const end = new Date(new Date().toDateString());
        const start = new Date();
        start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', [start, end]);
    },
},
{
    text: '最近一个月',
    onClick(picker) {
        const end = new Date(new Date().toDateString());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        picker.$emit('pick', [start, end]);
    },
},
{
    text: '最近三个月',
    onClick(picker) {
        const end = new Date(new Date().toDateString());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        picker.$emit('pick', [start, end]);
    },
},
];

export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90;
    }
    return new Date(new Date().toDateString());
}

export function debounce(func, wait, immediate) {
    let timeout;
    let args;
    let context;
    let timestamp;
    let result;

    const later = () => {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp;

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) {
                    context = null;
                    args = null;
                }
            }
        }
    };

    return (...args) => {
        context = this;
        timestamp = +new Date();
        const callNow = immediate && !timeout;
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = null;
            args = null;
        }

        return result;
    };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone');
    }
    const targetObj = source.constructor === Array ? [] : {};
    Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys]);
        } else {
            targetObj[keys] = source[keys];
        }
    });
    return targetObj;
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr));
}

export function createUniqueString() {
    const timestamp = +new Date() + '';
    const randomNum = parseInt((1 + Math.random()) * 65536, 10) + '';
    return (+(randomNum + timestamp)).toString(32);
}

// 字符串长度超过时进行限制
export function wordCount({
    string,
    max = 250,
    strictness = false
}) {
    // 限制文本域字数为250
    const restrictLength = string => {
        if (!string) {
            return false;
        }
        let used_length = 0,
            max_length = max,
            canUseLength = 0,
            maxString = '',
            charArray = string.split(''),
            addNum = 1,
            findCharLength = strword => {
                let charNum = 1;
                if (!strictness) {
                    return 2;
                }
                // 字母+数字
                if (/[A-Za-z0-9]/.test(strword)) {
                    charNum = 1;
                }
                // 中文字符
                else if (/^[\u4e00-\u9fa5]$/.test(strword)) {
                    charNum = 2;
                }
                // 全角字符
                else if (/[\uFF00-\uFFFF]/.test(strword)) {
                    charNum = 2;
                }
                // 半角字符
                else if (/[\u0020-\u007e]/.test(strword)) {
                    charNum = 1;
                }
                return charNum;
            };
        for (let i = 0; i < charArray.length; i++) {
            if (findCharLength(charArray[i]) == 1 && addNum == 1) {
                addNum += 1;
            } else if (findCharLength(charArray[i]) == 1 && addNum == 2) {
                addNum = 1;
                used_length += 1;
            } else if (findCharLength(charArray[i]) == 2) {
                used_length += 1;
            }
            if (used_length <= max_length) {
                maxString += charArray[i];
            }
        }
        if (used_length < max_length) {
            maxString = '';
        }
        canUseLength = max_length - used_length;
        return {
            usedLength: used_length,
            canUseLength,
            maxLength: max_length,
            maxString,
        };
    };

    const {
        canUseLength = max, usedLength = 0, maxLength = max, maxString = '',
    } = restrictLength(string);
    return {
        canUseLength,
        usedLength,
        maxLength,
        maxString,
    };
}

// 判断浏览器
const u = window.navigator.userAgent;
export const UA = {
    weChat: u.indexOf('MicroMessenger') > -1, // 微信
    wechatdevtools: u.indexOf('wechatdevtools') > -1, // 微信开发工具
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, // 是否iPad
    webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
};

// 已过去多少时间
export function getDateDiff(dateTimeStamp) {
    dateTimeStamp = +new Date(dateTimeStamp);
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let halfamonth = day * 15;
    let month = day * 30;
    let now = +new Date();
    let diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;
    let result = "";
    if (monthC >= 1) {
        let date = new Date(dateTimeStamp);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let h = date.getHours();
        let mi = date.getMinutes();
        if (Number(mi) < 10) {
            mi = '0' + mi;
        }
        // result=y+"-"+m+"-"+d+" "+h+":"+mi;
        result = y + "-" + m + "-" + d;
    } else if (weekC >= 1) {
        result = "" + parseInt(weekC) + " 周前";
    } else if (dayC >= 1) {
        result = "" + parseInt(dayC) + " 天前";
    } else if (hourC >= 1) {
        result = "" + parseInt(hourC) + " 小时前";
    } else if (minC >= 1) {
        result = "" + parseInt(minC) + " 分钟前";
    } else {
        result = "刚刚";
    }
    return result;
}

// 日期格式化
export function formatDate(dateString, model, isNow = false) {
    if (!!isNow) return '至今';
    const date = !!dateString ? moment(dateString, ['YYYY-MM-DD HH:mm', 'x', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD']).toArray() : moment(dateString).toArray();
    if (model === 2) {
        return moment(date).format('M-D H:mm');
    } else if (model === 3) {
        return moment(date).format('YYYY-M-D H:mm');
    } else if (model === 4) {
        return moment(date).format('YYYY');
    } else if (model === 5) {
        return `${moment(date).format('MM')}月${moment(date).format('DD')}日 ${moment(date).format('HH')}:${moment(date).format('mm')}`;
    } else if (model === 6) {
        return `${moment(date).format('YYYY')}年${moment(date).format('MM')}月${moment(date).format('DD')}日 ${moment(date).format('HH')}:${moment(date).format('mm')}`;
    } else if (model === 7) {
        return `${moment(date).format('YYYY')}.${moment(date).format('M')}.${moment(date).format('D')}`;
    } else if (model === 8) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    } else if (model === 9) {
        return moment(date).format('YYYY-MM-DD');
    } else if (model === 10) {
        return moment(date).format('YYYY-MM');
    }

    return moment(date).format('YYYY/MM/DD H:mm:ss');
}

// 字符串长度超过之后用省略号代替
export function stringClip(string, maxLeng = 10) {
    const tempString = String(string);
    let newString = tempString;
    if (tempString.length > maxLeng) {
        newString = `${string.substring(0, maxLeng)}...`;
    }
    return newString;
}

// 数字转中文格式
export function numToChinese(num, mode) {
    if (typeof (num) === 'number') {
        switch (mode) {
            // 百
            case 1:
                return `${(num / 100).toFixed(1)}百`;
            // 千
            case 2:
                return `${(num / 1000).toFixed(1)}千`;
            // 万
            case 3:
                return `${(num / 10000).toFixed(1)}万`;
            // 百万
            case 4:
                return `${(num / 1000000).toFixed(2)}百万`;
            // 千万
            case 5:
                return `${(num / 10000000).toFixed(2)}千万`;
            // 亿
            case 6:
                return `${(num / 100000000).toFixed(2)}亿`;
            default:
                if (num > 100000000) {
                    return `${(num / 100000000).toFixed(2)}亿`;
                } else if (num > 10000000) {
                    return `${(num / 10000000).toFixed(2)}千万`;
                } else if (num > 1000000) {
                    return `${(num / 1000000).toFixed(2)}百万`;
                } else if (num > 10000) {
                    return `${(num / 10000).toFixed(1)}万`;
                }
                return num;
        }
    } else {
        return num;
    }
}

// 序列化传参
export function serializeParam(paramObj) {
    let str = "";
    let serialize = function (obj) {
        for (let n in obj) {
            if (Object.prototype.toString.call(obj[n]) === "[object Object]") {
                serialize(obj[n]);
            } else if (Object.prototype.toString.call(obj[n]) === "[object Array]") {
                for (let m in obj[n]) {
                    str += n + "=" + obj[n][m] + "&";
                }
            } else {
                str += n + "=" + obj[n] + "&";
            }
        }
    }
    serialize(paramObj);
    return str;
}

export const dateTimeRange = {
    // 今日
    thisDay() {
        const startDateTime = `${moment().format('YYYY-MM-DD')} 00:00:00`;
        const endDateTime = `${moment().format('YYYY-MM-DD')} 23:59:59`;
        return [startDateTime, endDateTime];
    },
    // 本周（星期天开始 ~ 当前时间）
    thisWeek() {
        const startDate = `${moment().week(moment().week()).startOf('week').format('YYYY-MM-DD')} 00:00:00`;
        const endDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        return [startDate, endDateTime];
    },
    // 本月（月初 ~ 当前时间）
    thisMonth() {
        const startDate = `${moment().month(moment().month()).startOf('month').format('YYYY-MM-DD')} 00:00:00`;
        const endDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        return [startDate, endDateTime];
    },
    // 本年（年初 ~ 当前时间）
    thisYear() {
        const startDate = `${moment().year(moment().year()).startOf('year').format('YYYY-MM-DD')} 00:00:00`;
        const endDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        return [startDate, endDateTime];
    },
};

// 1231546 ->  1,231,546.00
export function formatNumber(num, accuracy = 2) {
    num = num.toFixed(accuracy);
    num += '';
    const separator = ',';
    const x = num.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + separator + '$2');
    }
    return x1 + x2;
}

// 毫秒数 -> hh:mm:ss
export function toTimeByMsec(mss = Number) {
    let hours = Math.abs(parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    let minutes = Math.abs(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
    let seconds = Math.abs((mss % (1000 * 60)) / 1000);
    if (Number(hours) < 10) hours = `0${hours}`;
    if (Number(minutes) < 10) minutes = `0${minutes}`;
    if (Number(seconds) < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
}

export function downloadFile(url, filename) {
    /**
    * 下载文件
    * 原理：通过获取文件内容转译为二进制，传给创建a标签下载
    * @param url  文件地址url
    * @param filename 下载保存的名字
    */
    var downloadFileBya = function (fileName, content) {
        var aLink = document.createElement('a');
        var blob = new Blob([content]);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        if (fileName) {
            aLink.download = fileName;
        }
        aLink.target = "_blank";
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
    }

    // 拿文件的名字
    var fileNameFromHeader = function (disposition) {
        if (disposition) {
            let index = disposition.lastIndexOf("\/");
            return decodeURIComponent(disposition.substring(index + 1, disposition.length));
        }
        return "undefine_file";
    }

    // 拿到文件内容的二进制
    downloadFiledata(url).then(res => {
        // console.log(res)
        // if (res.code == 200) {
        //   // res数据的返回是什么，有待商榷
        var donwloadName = filename != undefined ? filename : fileNameFromHeader(url);
        downloadFileBya(donwloadName, res);
        //   } else {
        //     this.$message.error("请求下载文件错误，请求错误码：" + res.code);
        //     return false;
        //   }

    })

}

export function downloadFile2(url, filename) {
    /**
  * 下载文件
  * 原理：通过获取文件内容转译为二进制，传给创建a标签下载
  * @param url  文件地址url
  * @param filename 下载保存的名字
  */
    var downloadFileBya = function (fileName, content) {
        var aLink = document.createElement('a');
        var blob = new Blob([content]);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, true);
        if (fileName) {
            aLink.download = fileName;
        }
        aLink.target = "_blank";
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
    }
    // 拿文件的名字
    var fileNameFromHeader = function (disposition) {
        if (disposition) {
            let index = disposition.lastIndexOf("\/");
            return decodeURIComponent(disposition.substring(index + 1, disposition.length));
        }
        return "undefine_file";
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.responseType = "blob";
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (this.status == 200) {
            // var blob = this.response;
            var donwloadName = filename != undefined ? filename : fileNameFromHeader(xhr.responseURL);
            downloadFileBya(donwloadName, xhr.response);
        } else {
            console.error("请求下载文件错误，请求错误码：" + this.status);
            return false;
        }
    }
    xhr.send();
}

// 获取当前时分秒
export function getNowTime(time) {
    const hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    const min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    const sec = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    const thisMoment = hours + ':' + min + ':' + sec;
    return thisMoment;
}

// 获取昨天，今天，明天
export function getToday(dates) {
    var dd = new Date();
    var n = dates || 0;
    dd.setDate(dd.getDate() + n);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    var day = y + "-" + m + "-" + d;
    return day;
    getDate(dates); //dates为数字类型，0代表今日,-1代表昨日，1代表明日，返回yyyy-mm-dd格式字符串，dates不传默认代表今日
}

// 获取上周，本周，下周
// type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
// getMonday("s",1)  //得到下周一的yyyy-mm-dd格式日期
// getMonday("e",1)  //得到下周日的yyyy-mm-dd格式日期
export function getThisMonday(type, dates) {
    var now = new Date();
    var nowTime = now.getTime();
    var day = now.getDay();
    var longTime = 24 * 60 * 60 * 1000;
    var n = longTime * 7 * (dates || 0);
    if (type == "s") {
        var dd = nowTime - (day - 1) * longTime + n;
    };
    if (type == "e") {
        var dd = nowTime + (7 - day) * longTime + n;
    };
    dd = new Date(dd);
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    var day = y + "-" + m + "-" + d;
    return day;
}

// 获取上月，本月，下月
// getMonth(type,months)  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，months为数字类型，不传或0代表本月，-1代表上月，1代表下月
// getMonth("s",1)  //得到下月第一天的yyyy-mm-dd格式日期
// getMonth("e",1)  //得到下月最后一天的yyyy-mm-dd格式日期
export function getThisMonth(type, months) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    if (Math.abs(months) > 12) {
        months = months % 12;
    };
    if (months != 0) {
        if (month + months > 12) {
            year++;
            month = (month + months) % 12;
        } else if (month + months < 1) {
            year--;
            month = 12 + month + months;
        } else {
            month = month + months;
        };
    };
    month = month < 10 ? "0" + month : month;
    var date = d.getDate();
    var firstday = year + "-" + month + "-" + "01";
    var lastday = "";
    if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
        lastday = year + "-" + month + "-" + 31;
    } else if (month == "02") {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
            lastday = year + "-" + month + "-" + 29;
        } else {
            lastday = year + "-" + month + "-" + 28;
        };
    } else {
        lastday = year + "-" + month + "-" + 30;
    };
    var day = "";
    if (type == "s") {
        day = firstday;
    } else {
        day = lastday;
    };
    return day;
};

// 获取今年，明年，去年，结束日期
// getYear(type,dates)  //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
// getYear("s",1)  //得到明年第一天的yyyy-mm-dd格式日期
// getYear("e",1)  //得到明年最后一天的yyyy-mm-dd格式日期
export function getThisYear(type, dates) {
    var dd = new Date();
    var n = dates || 0;
    var year = dd.getFullYear() + Number(n);
    if (type == "s") {
        var day = year + "-01-01";
    };
    if (type == "e") {
        var day = year + "-12-31";
    };
    if (!type) {
        var day = year + "-01-01/" + year + "-12-31";
    };
    return day;
};

// 毫秒数转年月日
export function getFullYmd(times) {
    const date = new Date(times);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const newMonth = month < 10 ? '0' + month : month;
    const day = date.getDate();
    const newDay = day < 10 ? '0' + day : day;
    return year + "-" + newMonth + "-" + newDay;
}

// 复制text
export function copyText(text){
    const id = +new Date();
    var tag = document.createElement('input');
    tag.setAttribute('id', id);
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById(id).select();
    document.execCommand('copy');
    document.getElementById(id).remove();
}
