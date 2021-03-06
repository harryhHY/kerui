/**
 * @file index.js
 * @author swan
 */
const app = getApp();
let number = 30;
let {
  api,apifrom,c
} = app;
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
    logoList: [{
        id: 1,
        imgsrc: "../../images/logo.png",
        classname: "img1",
      },
      {
        id: 2,
        imgsrc: "../../images/logo1.png",
        classname: "img2",
      },
    ],
    itemBanners: [
      //轮播图片
      {
        id: 1,
        pic: "../../images/banner_one.jpg",
        url: "https://www.baidu.com/",
      },
      {
        id: 2,
        pic: "../../images/banner_two.jpg",
        url: "https://www.baidu.com/",
      },
      // {
      //   id: 3,
      //   pic: "../../images/banner_three.jpg",
      //   url:"https://www.baidu.com/"
      // }
    ],
    is_banner: false,
    page: 1,
    showHttploading: false,
    total: 0,
    last_page: 1,
  },
  geth5host() {
    return new Promise((resolve, reject) => {
      swan.request({
        url: `${apifrom}/home/listn/settings`,
        header: {
          "content-type": "application/json",
        },
        method: "POST",
        dataType: "json",
        responseType: "text",
        data: {
          host: apifrom,
          c,
        },
        success: (res) => {
          this.showHttploading(false);
          let {
            is_banner,
            is_video,
            banners
          } = res.data.params;
          if (is_banner == 1) {
            this.setData({
              is_banner: true,
              itemBanners: banners,
            });
          }

          if (is_video == 1) {
            this.setData({
              is_video: true,
            });
          }
          resolve(true);
        },
        fail: (err) => {
          reject(err);
          console.log("错误码：" + err.errCode);
          console.log("错误信息：" + err.errMsg);
        },
      });
    });
  },
  changeData(e) {
    //新热切换
    let changeNum = e.currentTarget.dataset.changeNum;
    if (changeNum != this.data.changetype) {
      this.setData({
        items: this.data.items.reverse(),
        changetype: changeNum,
      });
    }
  },
  goWebView(e) {
    let src = e.currentTarget.dataset.src;
    if (this.data.is_banner == true) {
      swan.navigateTo({
        url: `/pages/bannerweb/bannerweb?src=${src}`,
      });
    }
  },
  //分享
  openShare() {
    swan.openShare({
      title: "库博体育",
      content: "库博体育",
      path: "/pages/openShare/openShare?key=value",
      imageUrl: "../../images/logo.png",
      success: (res) => {
        swan.showToast({
          title: "分享成功",
        });
        console.log("openShare success", res);
      },
      fail: (err) => {
        console.log("openShare fail", err);
      },
    });
  },
  //点赞
  praise(e) {
    let id = e.currentTarget.dataset.id;
    swan.request({
      url: `${api}/home/listn/favourite`,
      header: {
        "content-type": "application/json",
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        id,
      },
      success: (res) => {
        let {
          code,
          msg,
          parms
        } = res.data;
        if (code == 0 && msg == "成功") {
          swan.showToast({
            title: msg,
            icon: "none",
            mask: false,
            success: (res) => {
              this.getList();
            },
            fail: (err) => {
              console.log("showToast fail", err);
            },
          });
        } else if (code == 0 && msg == "取消成功") {
          swan.showToast({
            title: msg,
            icon: "none",
            mask: false,
            success: (res) => {
              this.getList();
            },
            fail: (err) => {
              console.log("showToast fail", err);
            },
          });
        }
      },
      fail: (err) => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      },
    });
  },
  navigateTo(e) {
    this.id = e.currentTarget.dataset.id;
    console.log(this.id);
    swan.navigateTo({
      url: `/pages/detail/detail?id=${this.id}`,
    });
  },
  tapHandle(e) {
    // console.log(id);
  },
  onShow() {
    swan.setPageInfo({
      title:'锐纳电竞，电竞俱乐部。',
      keywords:'锐纳电竞，score电竞，神游电竞',
      description:'锐纳电竞，电竞俱乐部。',
      articleTitle: '锐纳电竞',
      releaseDate: "2019-01-02 12:01:30",
      image: [
        "https://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg",
        "https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg",
      ],
      video: [{
        url: "https://www.baidu.com/mx/v12.mp4",
        duration: "100",
        image: "https://smartprogram.baidu.com/docs/img/image-scaleToFill.png",
      }, ],
      visit: {
        pv: "1000",
        uv: "100",
        sessionDuration: "130",
      },
      likes: "75",
      comments: "13",
      collects: "23",
      shares: "8",
      followers: "35",
      success: (res) => {
        console.log("setPageInfo success");
      },
      fail: (err) => {
        console.log("setPageInfo fail", err);
      },
    });
  },
  onLoad() {
    // 监听页面加载的生命周期函数
    console.log("页面即将渲染", this);
    console.log(getCurrentPages());
    this.setData({
      page: 1,
    });
    this.geth5host().then((res) => {
      this.getList();
      // this.getList(content, today, p);
    });
  },
  onTabClick(e) {
    console.log(e.detail.name);
    this.setData({
      activeName: e.detail.name,
    });
  },
  showHttploading(flag) {
    this.setData({
      showHttploading: flag,
    });
  },
  // 首页数据列表
  getList(p = 1) {
    this.showHttploading(true);
    console.log(api);
    let {
      page
    } = this.data;
    swan.request({
      url: api + "/home/listn/m_list_v2",
      header: {
        "content-type": "application/json",
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        c,
        p: page, //第几页
        n: this.number, //每页条数
      },
      success: (res) => {
        this.showHttploading(false);
        let newsArr = [];
        // newsArr.push(res.data.params.data[0].news_title);
        // newsArr.push(res.data.params.data[1].news_title);
        // newsArr.push(res.data.params.data[2].news_title);
        // newsArr.push(res.data.params.data[3].news_title);
        // newsArr.push(res.data.params.data[4].news_title);

        console.log(res.data);
        let data = res.data.params;
        let {
          is_banner,
          total,
          last_page
        } = data;
        if (is_banner == 1) {
          // bannerList.push(data.banner);
          this.setData({
            itemBanners: res.data.params.banner,
            is_banner: true,
          });
        }
        this.setData({
          last_page,
          total: total,
          items: res.data.params.data,
          itemNews: newsArr,
          apimg: api,
        });
        console.log(this.data.itemBanners);
      },
      fail: (err) => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      },
    });
  },
  //下拉刷新
  onPullDownRefresh() {
    this.showHttploading(true);
    swan.showLoading({
      title: "正在刷新页面...",
      mask: false, // 一般设置这个值为false
      success: (res) => {
        console.log("showLoading success", res);
      },
      fail: (err) => {
        console.log("showLoading fail", err);
      },
    });
    this.getList();
    this.setData({
      page: 1,
    });
    setTimeout(function () {
      this.showHttploading(false);
      swan.stopPullDownRefresh();
      swan.hideLoading();
    }, 1000);
  },
  //加载更多
  onReachBottom(e) {
    // this.showHttploading(true);
    console.log("onReachBottom");
    //请求分页数据
    number += 30;
    let {
      page,
      last_page,
      total
    } = this.data;
    console.log(last_page, page);
    if (total > 10 && last_page >= 1 && page < last_page) {
      let machpage = ++page;
      let n = total - 10;
      swan.showLoading({
        title: "正在加载...",
        mask: false, // 一般设置这个值为false
        success: (res) => {
          this.showHttploading(false);
          console.log("showLoading success", res);
          swan.request({
            url: api + "/home/listn/m_list_v2",
            header: {
              "content-type": "application/json",
            },
            method: "POST",
            dataType: "json",
            responseType: "text",
            data: {
              c,
              p: machpage, //第几页
              n: n, //每页条数
            },
            success: (res) => {
              this.showHttploading(false);
              let newsArr = [];
              let {
                data
              } = res.data.params;
              let {
                is_banner
              } = data;
              if (is_banner == 1) {
                this.setData({
                  itemBanners: res.data.params.banner,
                });
              }
              if (data != false) {
                let {
                  items
                } = this.data;
                let {
                  data
                } = res.data.params;
                for (let i = 0; i < data.length; i++) {
                  items.push(data[i]);
                }
                // items.push(data[0])
                console.log(items);
                this.setData({
                  page: machpage,
                  items: items,
                  itemNews: newsArr,
                  apimg: api,
                });
              }
            },
            fail: (err) => {
              this.showHttploading(false);
              console.log("错误码：" + err.errCode);
              console.log("错误信息：" + err.errMsg);
            },
          });
        },
        fail: (err) => {
          console.log("showLoading fail", err);
        },
      });
    } else {
      swan.showToast({
        title: "已经到底了",
        icon: "none",
        mask: false,
        success: (res) => {
          // this.setData({'disabled': false});
        },
        fail: (err) => {
          console.log("showToast fail", err);
        },
      });
    }

    setTimeout(function () {
      swan.hideLoading();
    }, 2000);
  },
});