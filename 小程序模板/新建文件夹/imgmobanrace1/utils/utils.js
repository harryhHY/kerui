//整数留下2位
let money = value => {
    if (!value) return "0.00";
    value = Math.round(parseFloat(value) * 100) / 100;
    let xsd = value.toString().split(".");
    if (xsd.length == 1) {
      value = value.toString() + ".00";
      return value;
    }
    return value
  }
  
  //千位转化
  let Thousand = value => {
    if (Number.isSafeInteger(value)) {     
      if (!value) {
        return "0.00";
      } else {
        if (Number.isInteger(value)) {        
          let Tvalue = (value || 0)
            .toString()
            .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); //千位分隔符        
          return Tvalue;
        }
      }
    }
  }
  //千元留2
  let ThousandMoney = value => {
    if (value) {
      let numstring = String(value)
      if (/[^0-9\.]/.test(numstring)) {
        return "invalid value";
      }
      numstring = numstring.replace(/^(\d*)$/, "$1.");
      numstring = (numstring + "00").replace(/(\d*\.\d\d)\d*/, "$1");
      numstring = numstring.replace(".", ",");
      var re = /(\d)(\d{3},)/;
      while (re.test(numstring)) {
        numstring = numstring.replace(re, "$1,$2");
      }
      numstring = numstring.replace(/,(\d\d)$/, ".$1");
      let ThValue = numstring.replace(/^\./, "0.")
      return ThValue
    }
  }
  //时间戳转换
  let formDate = value => {
    if (isFinite(value) && Number.isSafeInteger(value)) {
      let date = new Date(value * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours().length <= 1 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    } else {
      let date = new Date(value)
      let Timestamp = Date.parse(date)
      return Timestamp
    }
  }
  
  export {
    money,
    ThousandMoney,
    formDate,
    Thousand
  }
  
  