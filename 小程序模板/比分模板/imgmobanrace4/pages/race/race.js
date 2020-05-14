const app = getApp();
let {
  apifrom,
  api
} = app;
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
    switchDuration: 500, //滑动动画时长
    autoPlayInterval: 2000, //自动切换时间间隔
    indicator_dots: true, //swiper指示器
    indicator_color: "#ffffff", //指示点颜色
    indicator_active_color: "#000000", //选中的指示点颜色
    Bannerautoplay: true, //自动播放
    tabs: [{
        name: "1",
        label: "足球"
      },
      {
        name: "2",
        label: "篮球"
      }
    ],
    dateList: [{
        title: "今天",
        daytype: 0,
        name: "1"
      },
      {
        title: "明天",
        daytype: 1,
        name: "2"
      },
      {
        title: "后天",
        daytype: 2,
        name: "3"
      }
    ],
    itemBanners: [
      //轮播图片
      {
        id: 1,
        pic: "../../images/banner_one.jpg",
        url: "https://www.baidu.com/"
      }
    ],
    content: "1",
    content1: "1",
    activeName: "1",
    activeName1: "1",
    today: "",
    todayList: [],
    p: 1,
    is_banner: false,
    is_video: false,
    showlodingtitle: false,
    showHttploading: false
  },
  onShow() {
    swan.setPageInfo({
      title: '夜色直播,夜间比分直播',
      keywords: '夜色直播,篮球直播,足球直播',
      description: '夜色直播,各类赛事直播',
      articleTitle: '夜色直播,各类赛事直播',
      releaseDate: "2019-01-02 12:01:30",
      image: [
        "https://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg",
        "https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg"
      ],
      video: [{
        url: "https://www.baidu.com/mx/v12.mp4",
        duration: "100",
        image: "https://smartprogram.baidu.com/docs/img/image-scaleToFill.png"
      }],
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
  showHttploading(flag) {
    this.setData({
      showHttploading: flag
    })
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
  gotovideo(e) {
    let {
      is_video
    } = this.data;
    let {
      item
    } = e.currentTarget.dataset;
    if (is_video) {
      let item1 = JSON.stringify(item);
      swan.navigateTo({
        url: `/pages/videodetail/videodetail?item=${item1}`
      });
    }
  },
  onReachBottom(e) {
    let {
      p,
      today,
      content
    } = this.data;
    let page = ++p;
    this.setData({
      p: page
    });
    this.getList(content, today, page);
  },
  goWebView(e) {
    let src = e.currentTarget.dataset.src;
    if (this.data.is_banner == true) {
      swan.navigateTo({
        url: `/pages/bannerweb/bannerweb?src=${src}`
      });
    }
  },
  changeday(e) {
    let {
      daytype
    } = e.currentTarget.dataset;
    this.getdate(daytype);
    let {
      today,
      activeName,
      p
    } = this.data;
    let pipi = 1;
    if (p != 1) {
      this.setData({
        p: pipi
      });
    }
    this.getList(activeName, today, pipi);
  },
  tabstwo(e) {
    let {
      name
    } = e.detail;
    this.setData({
      content1: name,
      activeName1: name
    });
  },
  tabsOne(e) {
    this.getdate(0);
    let {
      today,
      p
    } = this.data;
    let {
      name
    } = e.detail;
    this.setData({
      content: name,
      activeName: name,
      content1: "1",
      activeName1: "1"
    });
    let pipi = 1;
    if (p != 1) {
      this.setData({
        p: pipi
      });
    }
    this.getList(name, today, pipi);
  },
  getList(type, date, p = 1) {
    this.showHttploading(true)
    swan.request({
      url: `${api}/inter`,
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        type,
        date,
        p
      },
      success: res => {
        this.showHttploading(false)
        let {
          data
        } = res.data.params;
        let {
          todayList,
          p
        } = this.data;
        if (p == 1) {
          this.setData({
            todayList: data
          });
        } else {
          let datalist = todayList;
          let list = datalist.concat(data);
          this.setData({
            todayList: list
          });
        }
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  geth5host() {
    this.showHttploading(true)
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
        c: 121
      },
      success: res => {
        let {
          is_banner,
          is_video
        } = res.data.params;
        if (is_banner == 1) {
          this.setData({
            is_banner: true
          });
        }
        if (is_video == 1) {
          this.setData({
            is_video: true
          });
        }
        this.showHttploading(false)
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  handleTap1(e) {
    let {
      clientX,
      clientY,
      pageX,
      pageY
    } = e.changedTouches[0];
    if (clientY == pageY) {
      this.setData({
        showlodingtitle: true
      });
      let that = this;
      setTimeout(function () {
        swan.stopPullDownRefresh();
        swan.hideLoading();
        that.setData({
          showlodingtitle: false
        });
      }, 1500);
    }
  },
  //下拉刷新
  onPullDownRefresh() {
    swan.showLoading({
      title: "正在刷新页面...",
      mask: false, // 一般设置这个值为false
      success: res => {
        console.log("showLoading success", res);
        this.setData({
          showlodingtitle: true
        });
      },
      fail: err => {
        console.log("showLoading fail", err);
      }
    });
    this.getList();
    let that = this;
    setTimeout(function () {
      swan.stopPullDownRefresh();
      swan.hideLoading();
      that.setData({
        showlodingtitle: false
      });
    }, 1000);
  },
  onLoad(options) {
    this.currentId = options.src;
    // this.setData({
    //   currentId: options.src
    // });
    // console.log(options.src);
    this.setNavigationBarColor();
    this.getdate(0);
    this.geth5host();
    let {
      today,
      content,
      p
    } = this.data;
    this.getList(content, today, p);
  }
});