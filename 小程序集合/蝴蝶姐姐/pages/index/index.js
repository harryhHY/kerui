/**
 * @file index.js
 * @author swan
 */
const app = getApp();
let number = 30;
let api = app.api;
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
    changetype: 1,
    newimg: "../../images/new.png",
    hotimg: "../../images/hot.png",
    horn: "../../images/horn.gif",
    riqi: "../../images/ri.png",
    itemNews: [],
    items: [],
    number: 15,
    apimg: "",
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
    is_banner: false
  },
  changeData(e) {
    //新热切换
    let changeNum = e.currentTarget.dataset.changeNum;
    if (changeNum != this.data.changetype) {
      this.setData({
        items: this.data.items.reverse(),
        changetype: changeNum
      });
    }
  },
  goWebView(e) {
    let src = e.currentTarget.dataset.src;
    if (this.data.is_banner == true) {
      swan.navigateTo({
        url: `/pages/web/web?src=${src}`
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
  tapHandle(e) {
    // console.log(id);
  },
  onShow() {
    swan.setPageInfo({
      title: '蝴蝶姐姐，讲解赛事',
      keywords: '蝴蝶姐姐，体育直播，电竞直播',
      description: '蝴蝶姐姐，讲解赛事',
      articleTitle: '蝴蝶姐姐',
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
  onLoad() {
    // 监听页面加载的生命周期函数
    console.log("页面即将渲染", this);
    console.log(getCurrentPages());
    this.getList();
  },
  onTabClick(e) {
    console.log(e.detail.name);
    this.setData({
      activeName: e.detail.name
    });
  },
  // 首页数据列表
  getList() {
    swan.request({
      url: api + "/home/listn/m_list_v2",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        c: 140,
        p: 1, //第几页
        n: this.number //每页条数
      },
      success: res => {
        let newsArr = [];
        newsArr.push(res.data.params.data[0].news_title);
        newsArr.push(res.data.params.data[1].news_title);
        newsArr.push(res.data.params.data[2].news_title);
        newsArr.push(res.data.params.data[3].news_title);
        newsArr.push(res.data.params.data[4].news_title);

        console.log(res.data);
        let data = res.data.params;
        let { is_banner } = data;
        if (is_banner == 1) {
          // bannerList.push(data.banner);
          this.setData({
            itemBanners: res.data.params.banner,
            is_banner: true
          });
        }
        this.setData({
          items: res.data.params.data,
          itemNews: newsArr,
          apimg: api
        });
        console.log(this.data.itemBanners);
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  //下拉刷新
  onPullDownRefresh() {
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
    this.getList();
    setTimeout(function() {
      swan.stopPullDownRefresh();
      swan.hideLoading();
    }, 1000);
  },
  //加载更多
  onReachBottom(e) {
    console.log("onReachBottom");
    //请求分页数据
    number += 30;
    swan.showLoading({
      title: "正在加载...",
      mask: false, // 一般设置这个值为false
      success: res => {
        console.log("showLoading success", res);
        swan.request({
          url: api + "/home/listn/m_list_v2",
          header: {
            "content-type": "application/json"
          },
          method: "POST",
          dataType: "json",
          responseType: "text",
          data: {
            c: 140,
            p: 1, //第几页
            n: number //每页条数
          },
          success: res => {
            let newsArr = [];
            newsArr.push(res.data.params.data[0].news_title);
            newsArr.push(res.data.params.data[1].news_title);
            newsArr.push(res.data.params.data[2].news_title);
            newsArr.push(res.data.params.data[3].news_title);
            newsArr.push(res.data.params.data[4].news_title);

            console.log(res.data);
            let data = res.data.params;
            let { is_banner } = data;
            if (is_banner == 1) {
              // bannerList.push(data.banner);
              this.setData({
                itemBanners: res.data.params.banner
              });
            }
            this.setData({
              items: res.data.params.data,
              itemNews: newsArr,
              apimg: api
            });
            console.log(this.data.itemBanners);
          },
          fail: err => {
            console.log("错误码：" + err.errCode);
            console.log("错误信息：" + err.errMsg);
          }
        });
      },
      fail: err => {
        console.log("showLoading fail", err);
      }
    });
    setTimeout(function() {
      swan.hideLoading();
    }, 2000);
  }
});
