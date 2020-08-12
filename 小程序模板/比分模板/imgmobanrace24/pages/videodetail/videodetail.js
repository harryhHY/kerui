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
    matchId: "",
    playflag: false,
    item1: [],
    video_Src: "",
    logoList: [
      {
        id: 1,
        imgsrc: "../../images/logo.png",
        classname: "img1"
      },
      {
        id: 2,
        imgsrc: "../../images/logo1.png",
        classname: "img2"
      }
    ]
  },
  onShow() {
    swan.setPageInfo({
      title: '006直播，体育直播。',
      keywords: '体育直播、篮球赛事、即时比分、006直播',
      description: '006直播，体育直播。',
      articleTitle: '006直播',
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
        // console.log("setPageInfo success");
      },
      fail: err => {
        console.log("setPageInfo fail", err);
      }
    });
  },
  getdataList() {
    let { item1 } = this.data;
    let id = item1[0].matchId;
    swan.request({
      url: `${api}/inter_url`,
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        id
      },
      success: res => {
        let { params } = res.data;
        let { murl } = res.data.params;
        if (params != false) {
          console.log(murl);
          this.setData({
            playflag: true,
            video_Src: murl
          });
        }
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  onLoad(options) {
    let { item } = options;
    let item1 = [];
    item1.push(JSON.parse(item));
    console.log(item1);
    this.setData({
      item1
    });
    this.getdataList();
    // console.log(this.data.playflag);
  }
});
