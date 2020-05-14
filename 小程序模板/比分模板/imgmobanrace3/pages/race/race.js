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
    apimg: "",
    tabs: [
      {
        name: "1",
        label: "足球"
      },
      {
        name: "2",
        label: "篮球"
      }
    ],
    content: "1",
    activeName: "1",
    today: "",
    todayList: []
  },
  onShow() {
    swan.setPageInfo({
      title: "球彩直播",
      keywords: "球彩、球彩直播",
      description: "球彩直播，一款真正的体育直播资讯信息",
      articleTitle:
        "球彩直播娱乐资讯,球彩直播,球彩直播娱乐，球彩，球彩直播，球彩直播足球，球彩直播篮球，球彩直播资讯",
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
  getdate(num) {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + num * 1);
    let nowdate = new Date(newDate).toLocaleDateString().replace(/\//g, "-");
    console.log(nowdate);
    this.setData({
      today: nowdate
    });
    return nowdate;
  },
  changeday(e) {
    let { daytype } = e.currentTarget.dataset;
    this.getdate(daytype);
    let { today, content } = this.data;
    this.getList(content, today);
  },
  tabsOne(e) {
    this.getdate(0);
    let { today } = this.data;
    let { name } = e.detail;
    this.setData({
      content: name,
      activeName: name
    });
    this.getList(name, today);
  },
  getList(type, date) {
    swan.request({
      url: `https://www.0s0zv.cn/inter`,
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        type,
        date
      },
      success: res => {
        let { data } = res.data.params;
        this.setData({
          todayList: data
        });
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  onLoad(options) {
    this.currentId = options.src;
    this.setData({
      currentId: options.src
    });
    console.log(options.src);
    this.setNavigationBarColor();
    this.getdate(0);
    let { today, content } = this.data;
    this.getList(content, today);
  }
});
