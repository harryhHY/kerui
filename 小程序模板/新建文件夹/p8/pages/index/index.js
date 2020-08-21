/**
 * @file index.js
 * @author swan
 */
const app = getApp();
let number = '';
let api = app.api;
const pages = getCurrentPages();

Page({
  data: {
    id: "",
    title: "",
    img: "",
    switchAutoPlayStatus: true,
    switchDuration: 500, //滑动动画时长
    autoPlayInterval: 2000, //自动切换时间间隔
    indicator_dots: true, //swiper指示器
    indicator_color: "#ffffff", //指示点颜色
    indicator_active_color: "#f70709", //选中的指示点颜色
    Bannerautoplay: true, //自动播放
    horn: "../../images/horn.gif",
    logo: "../../images/logo1.png",
    riqi: "../../images/ri.png",
    like: "../../images/like.png",
    itemNews: [],
    items: [],
    number: 15,
    apimg: "",
    p:1,
    tabs: [
      {
        name: "1",
        label: "推荐"
      },
      {
        name: "2",
        label: "好评"
      },
      {
        name: "3",
        label: "最新"
      }
    ],
    activeName: "1",
    order:"1",
    count:"",//点赞数
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
      // {
      //   id: 3,
      //   pic: "../../images/banner_three.jpg",
      //   url:"https://www.baidu.com/"
      // }
    ],
    is_banner: false,
    showlodingtitle: false
  },
  // pages[pages.length - 1].onload(),
  goWebView(e) {
    let src = e.currentTarget.dataset.src;
    console.log(src);
    
    if (this.data.is_banner == true) {
      swan.navigateTo({
        url: `/pages/bannerweb/bannerweb?src=${src}`
      });
    }
  },
  navigateTo(e) {
    this.id = e.currentTarget.dataset.id;
    console.log(this.id);
    swan.navigateTo({
      url: `/pages/detail/detail?id=${this.id}`
    });
  },
  tabsOne(e) {
    // this.getdate(0);
    let { p } = this.data;
    let { name } = e.detail;
    console.log(name);
    
    this.setData({
      order: name,
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
    this.getList(name , pipi);
  },
  onShow() {
    swan.setPageInfo({
      title: "奇兵电竞，专业电竞",
      keywords: "奇兵电竞,王者电竞,DOTA电竞",
      description: "奇兵电竞，专业电竞",
      articleTitle: "奇兵电竞-专业电竞",
      releaseDate: "2019-01-02 12:01:30",
      image: [
        "https://mbs1.bdstatic.com/searchbox/mappconsole/image/20200331/b259c343-84d6-44fb-8472-a3bbc3dcd1c1.png",
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
  onLoad() {
    // 监听页面加载的生命周期函数
    console.log("页面即将渲染", this);
    console.log(getCurrentPages());
    this.getList();
    // this.favourite();
  },
  ///下拉刷新
  handleTap1(e) {
    let { clientX, clientY, pageX, pageY } = e.changedTouches[0];
    if (clientY == pageY) {
      this.setData({
        showlodingtitle: true
      });
      let that = this;
      setTimeout(function() {
        swan.stopPullDownRefresh();
        swan.hideLoading();
        that.setData({
          showlodingtitle: false
        });
      }, 1500);
    }
  },
  //点赞
    // dianzan(e) {
    //   let currentId = e.currentTarget.dataset.id;
    //   this.favourite(currentId);
    //   this.getFavourite();
    // },
  // 首页数据列表
  getList(order , p = 1) {
    swan.showLoading({
      title: "页面数据加载中...",
      mask: false, // 一般设置这个值为false
      success: res => {
        console.log("showLoading success", res);
      },
      fail: err => {
        console.log("showLoading fail", err);
      }
    });
    swan.request({
      url: api + "/home/listn/m_list_v2",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        c: 141,
        order,
        p
      },
      success: res => {
        console.log(res.data);
        
        number =  res.data.params.total;
        console.log(number);
        let data = res.data.params.data;
        let { items, p } = this.data;
        if (p == 1) {
          this.setData({
            items: res.data.params.data,
            // itemNews: newsArr,
            apimg: api
          });
        } else {
          let datalist = items;
          let list = datalist.concat(data);
          this.setData({
            items: list
          });
        }
        //轮播图注释掉
        let { is_banner } = data;
        if (is_banner == 1) {
          // bannerList.push(data.banner);
          this.setData({
            itemBanners: res.data.params.banner,
            is_banner: true
          });
        }
        // console.log(this.data.itemBanners);
        swan.hideLoading();
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  onReachBottom(e) {
    let { p , order} = this.data;
    let page = ++p;
    // if(page >= number/10){
    //   page = Math.ceil(number/10)
    //   this
    // }
    console.log(page);
    
    this.setData({
      p: page
    });
    this.getList(order,page);
  },
  //下拉刷新
  onPullDownRefresh() {
    let {order} = this.data;
    this.setData({
      p:1
    });
    let p = 1;
    swan.showLoading({
      title: "正在刷新页面...",
      mask: false, // 一般设置这个值为false
      success: res => {
        console.log("showLoading success", res);
      },
      fail: err => {
        console.log("showLoading fail", err);
      }
    });
    swan.request({
      url: api + "/home/listn/m_list_v2",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        c: 141,
        order,
        p
      },
      success: res => {
        console.log(res.data);
          this.setData({
            items: res.data.params.data,
            // itemNews: newsArr,
            apimg: api
          });
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
    setTimeout(function() {
      swan.stopPullDownRefresh();
      swan.hideLoading();
    }, 1000);
  },
});
