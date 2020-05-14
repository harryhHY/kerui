const app = getApp();
let {api,apifrom} = app;
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
  geth5host(){
    swan.request({
      url: `${apifrom}/home/listn/settings`,
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        host: "https://quanjingjiaju.com",
        c: 114
      },
      success: res => {
        let { menu } = res.data.params;
        this.setData({
          currentId:menu
        })
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  onLoad(options) {
    console.log(options.src);
    if (options.src != undefined) {
      this.setData({
        currentId:options.src
      })
    } else {
      this.geth5host();
    }
    console.log(this.data.currentId);
    this.setNavigationBarColor();
  }
});
