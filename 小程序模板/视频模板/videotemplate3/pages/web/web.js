const app = getApp();
let {api,apifrom,c} = app;
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
  onshow() {
  },
  onLoad(options) {
    this.currentId = options.src;
    this.setData({
      currentId: options.src
    });
    console.log(options.src);
    this.setNavigationBarColor();
  }
});
