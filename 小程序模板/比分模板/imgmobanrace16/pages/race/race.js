const app = getApp();
let {
  api,
  apifrom
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
    indicator_active_color: "#5032b4", //选中的指示点颜色
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
    content: "1",
    activeName: "1",
    today: "",
    todayList: [],
    buttonList: [{
        value: 0,
        text: "",
        default: "warn"
      },
      {
        value: 1,
        text: "",
        default: "default"
      },
      {
        value: 2,
        text: "",
        default: "default"
      }
    ],
    itemBanners: [
      //轮播图片
      {
        id: 1,
        pic: "../../images/banner_one.jpg",
        url: "https://www.baidu.com/"
      },
      {
        id: 2,
        pic: "../../images/banner_two.jpg",
        url: "https://www.baidu.com/"
      }
    ],
    p: 1,
    is_banner: false,
    is_video: false,
    showlodingtitle: false,
    showHttploading: false,
    changdate:0,
    showdata:true
  },
  onShow() {
    swan.setPageInfo({
      title: '球彩直播，体育直播，电竞直播',
      keywords: '球彩直播，体育直播，足球直播，篮球直播，电竞直播',
      description: '球彩直播，五大联赛体育直播',
      articleTitle: '球彩直播',
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
  getdate(num) {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + num * 1);
    let nowdate = new Date(newDate).toLocaleDateString().replace(/\//g, "-");
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
  changeday(e) {
    let {
      daytype,
      type
    } = e.currentTarget.dataset;
    this.getdate(daytype);
    let {
      today,
      content,
      buttonList,
      p
    } = this.data;
    for (let i = 0; i < 3; i++) {
      if (i == daytype) {
        buttonList[i].default = "warn";
      } else {
        buttonList[i].default = "default";
      }
    }
    let pipi = 1;
    if (p != 1) {
      this.setData({
        p: pipi
      });
    }
    this.getList(content, today, pipi);
    this.setData({
      buttonList,
      changdate:daytype
    });
  },
  changeButtonList() {
    let {
      buttonList
    } = this.data;
    let list = [];
    console.log(this.getdate(1))
    list.push("今天");
    list.push("明天");
    list.push("后天");
    for (let i = 0; i < 3; i++) {
      buttonList[i].text = list[i];
    }
    this.setData({
      buttonList
    });
    console.log(buttonList);
  },
  tabsOne(e) {
    let {
      buttonList
    } = this.data
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
      activeName: name
    });
    let pipi = 1;
    if (p != 1) {
      this.setData({
        p: pipi
      });
    }
    for (let i = 0; i < buttonList.length; i++) {
      if (i == 0) {
        buttonList[i].default = "warn";
      } else {
        buttonList[i].default = "default";
      }
    }
    this.setData({
      buttonList
    });
    console.log(buttonList)
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
        if(data!=false){
          this.setData({
            showdata:true
          })
        }else{
          this.setData({
            showdata:false
          })
        }
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
  goWebView(e) {
    let src = e.currentTarget.dataset.src;
    if (this.data.is_banner == true) {
      swan.navigateTo({
        url: `/pages/bannerweb/bannerweb?src=${src}`
      });
    }
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
        host: apifrom,
        c: 92
      },
      success: res => {
        this.showHttploading(false)
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
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  showHttploading(flag) {
    this.setData({
      showHttploading: flag
    })
  },
  onPullDownRefresh() {
    this.showHttploading(true)
    swan.showLoading({
      title: "正在刷新页面...",
      mask: false, // 一般设置这个值为false
      success: res => {
        console.log("showLoading success", res);
        this.setData({
          showlodingtitle: true
        });
        this.showHttploading(false)
      },
      fail: err => {
        this.showHttploading(false)
        console.log("showLoading fail", err);
      }
    });
    let {
      content,
      changdate
    } = this.data;
    let date = this.getdate(changdate)
    this.getList(content, date);
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
    this.changeButtonList();
    console.log(options.src);
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