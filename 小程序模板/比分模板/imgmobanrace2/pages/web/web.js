const app = getApp();
let api = app.api;
Page({
  setNavigationBarColor() {
    swan.setNavigationBarColor({
      frontColor: "#ffffff",
      animation: {
        duration: 500,
        timingFunc: "linear"
      },
      success: res => {
        console.log("setNavigationBarColor success");
      },
      fail: err => {
        console.log("setNavigationBarColor fail", err);
      }
    });
  },
  data: {
    currentId: "",
    detailImg: "",
    title: "",
    timer: "2019-12-14",
    logo: "../../images/logo.png",
    logo1: "../../images/logo1.png",
    htmlSnip: "",
    apimg: ""
  },
  onshow() {},
  onLoad(options) {
    console.log(options.src);
    if (options.src != undefined) {
      this.currentId = options.src;
    } else {
      this.currentId = "http://www.y53jc.cn/home/listn/gustbook_add";
    }
    this.setData({
      currentId: this.currentId
    });
    console.log(this.data.currentId);
    this.setNavigationBarColor();
  }
});
