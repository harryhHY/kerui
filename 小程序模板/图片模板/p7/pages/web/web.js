const app = getApp();
let {api,apifrom} = app;
Page({
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
    swan.setPageInfo({
      title: "奇兵电竞，专业电竞",
      keywords: "奇兵电竞,王者电竞,DOTA电竞",
      description: "奇兵电竞，专业电竞",
      articleTitle: "奇兵电竞-专业电竞",
      releaseDate: "2019-01-02 12:01:30",
      image: [
        "https://mbs1.bdstatic.com/searchbox/mappconsole/image/20200331/b259c343-84d6-44fb-8472-a3bbc3dcd1c1.png",
      ],
      success: res => {
        console.log("setPageInfo success");
      },
      fail: err => {
        console.log("setPageInfo fail", err);
      }
    });
  },
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
        host: "https://maidianer.com",
        c: 123
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
  }
});
