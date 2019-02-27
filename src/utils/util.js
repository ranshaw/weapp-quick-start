function getCurrentTime() {
  var keep = '';
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var f = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  // var rand = Math.round(Math.random() * 899 + 100);
  keep = y + '' + m + '' + d + '' + h + '' + f + '' + s;
  return keep;
}

function _formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(_formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(_formatNumber).join(':')
  );
}

function objLength(input) {
  var type = toString(input);
  var length = 0;
  if (type !== '[object Object]') {
    // throw "输入必须为对象{}！"
  } else {
    for (var key in input) {
      if (key !== 'number') {
        length++;
      }
    }
  }
  return length;
}
// 浮点型除法
function div(a, b) {
  let c;
  let d;
  let e = 0;
  let f = 0;
  try {
    e = a.toString().split('.')[1].length;
  } catch (g) {}
  try {
    f = b.toString().split('.')[1].length;
  } catch (g) {}
  return (
    (c = Number(a.toString().replace('.', ''))),
    (d = Number(b.toString().replace('.', ''))),
    mul(c / d, Math.pow(10, f - e))
  );
}
// 浮点型加法函数
function accAdd(arg1, arg2) {
  var r1, r2, m;
  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return ((arg1 * m + arg2 * m) / m).toFixed(2);
}
// 浮点型乘法
function mul(a, b) {
  var c = 0;
  var d = a.toString();
  var e = b.toString();
  try {
    c += d.split('.')[1].length;
  } catch (f) {}
  try {
    c += e.split('.')[1].length;
  } catch (f) {}
  return (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c);
}

// 遍历对象属性和值
function displayProp(obj) {
  var names = '';
  for (var name in obj) {
    names += name + obj[name];
  }
  return names;
}
// 去除字符串所有空格
function sTrim(text) {
  return text.replace(/\s/gi, '');
}
// 去除所有:
function replaceMaohao(txt) {
  return txt.replace(/:/gi, '');
}
// 转换星星分数
function convertStarArray(score) {
  // 1 全星,0 空星,2半星
  var arr = [];
  for (var i = 1; i <= 5; i++) {
    if (score >= i) {
      arr.push(1);
    } else if (score > i - 1 && score < i + 1) {
      arr.push(2);
    } else {
      arr.push(0);
    }
  }
  return arr;
}
// 函数节流
function throttle(fn, me, gapTime) {
  if (gapTime === null || gapTime === undefined) {
    gapTime = 2000;
  }

  let _lastTime = null;

  return function() {
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments);
      _lastTime = _nowTime;
    }
  };
}
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
// 倒计时
function countdownTimer(name = 'timer') {
  let { days, hours, minutes, seconds } = this.data;
  if (!days || !hours || !minutes || !seconds) {
    console.error('countdownTimer缺少必要的参数！');
    return;
  }
  clearInterval(getApp()[name]);
  getApp()[name] = setInterval(() => {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
    }
    this.setData({
      seconds: formatNumber(seconds),
    });
    if (seconds === 59) {
      minutes--;
      if (minutes < 0) {
        minutes = 59;
      }
      this.setData({
        minutes: formatNumber(minutes),
      });
    }
    if (minutes === 59 && seconds === 59) {
      hours--;
      if (hours < 0) {
        hours = 23;
      }
      this.setData({
        hours: formatNumber(hours),
      });
    }
    if (hours === 23 && minutes === 59 && seconds === 59) {
      days--;
      if (days < 0) {
        days = 0;
      }
      this.setData({
        days: formatNumber(days),
      });
    }
    if (
      formatNumber(seconds) === '00' &&
      formatNumber(minutes) === '00' &&
      formatNumber(hours) === '00' &&
      formatNumber(days) === '00'
    ) {
      clearInterval(getApp()[name]);
      this.setData({
        gameOver: true,
      });
    }
    this.triggerEvent('saveCountDown', { days, hours, minutes, seconds });
  }, 1000);
}
// 验证身份证号
function idCardValidate(idCard) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|x)$)/i.test(idCard);
}
/**
 * 计算两个时间相差的时间，格式为天，时分秒
 *
 * @param {String} diffTime 时间相差的毫秒数
 * @param {*} start 开始时间
 * @param {*} end   结束时间
 * @returns
 */
function timeDiff(diffTime, start, end) {
  // 需这种格式 "2017/08/28 04:56:38"
  var dateBegin = new Date(start);
  var dateEnd = new Date(end);
  var dateDiff = dateEnd.getTime() - dateBegin.getTime();
  if (diffTime) {
    dateDiff = diffTime;
  }
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
  var leave1 = dateDiff % (24 * 3600 * 1000);
  var hours = Math.floor(leave1 / (3600 * 1000));

  var leave2 = leave1 % (3600 * 1000);
  var minutes = Math.floor(leave2 / (60 * 1000));

  var leave3 = leave2 % (60 * 1000);
  var seconds = Math.round(leave3 / 1000);
  console.log(' 相差 ' + dayDiff + '天 ' + hours + '小时 ' + minutes + ' 分钟' + seconds + ' 秒');
  return {
    days: formatNumber(dayDiff),
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
}
/**
 * 将一维数组转为二维数组
 *
 * @param {Array} listData
 * @param {Number} lineNum
 * @returns
 */
function transformArr(listData, lineNum) {
  let listArr = [];
  let cloneList = [...listData];
  for (let i = 0; i < Math.ceil(listData.length / lineNum); i++) {
    let mergeArr = [];
    cloneList.splice(0, lineNum).forEach(v => {
      mergeArr = mergeArr.concat(v);
    });
    listArr.push(mergeArr);
  }
  return listArr;
}
module.exports = {
  getCurrentTime,
  objLength,
  displayProp,
  sTrim,
  replaceMaohao,
  div,
  mul,
  accAdd,
  convertStarArray,
  formatTime,
  throttle,
  countdownTimer,
  timeDiff,
  idCardValidate,
  transformArr,
};
