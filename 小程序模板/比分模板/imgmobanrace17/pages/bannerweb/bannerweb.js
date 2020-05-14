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
  onshow() {
    swan.setPageInfo({
      title: '山猫比分，体育赛事比分。',
      keywords: '即时比分 足球比分 篮球比分 网球比分',
      description: '山猫比分，体育赛事比分。',
      articleTitle: '山猫比分',
      releaseDate: "2019-01-02 12:01:30",
      image: [
        "https://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg",
        "https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg"
      ],
      video: [
        {
          url: "https://www.baidu.com/mx/v12.mp4",
          duration: "100",
          image: "https://smartprogram.baidu.com/docs/img/image-scaleToFill.png"
        }
      ],
      visit: {
        pv: "1000",
        uv: "100",
        sessionDuration: "130"
      },
      likes: "75",
      comments: "13",
      collects: "23",
      shares: "8",
      followers: "35",
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
        host: apifrom,
        c: 140
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
