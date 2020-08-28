const app = getApp();
let {api,apifrom,c} = app;
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
    video_Src: ""
  },
  //动态设置title
  setNavigationBarTitle(e) {
    swan.request({
      url: api + "/home/listn/m_detail",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        id: this.currentId
      },
      success: res => {
        let news_title = res.data.params.news_title

        let newTitle = `${news_title}-猛虎视频`
        if (!newTitle) {
          swan.showToast({
            title: `${news_title}-猛虎视频`
          });
          return;
        }
        swan.setNavigationBarTitle({
          title: newTitle
        });

      },
      fail: err => {
        // console.log("错误码：" + err.errCode);
        // console.log("错误信息：" + err.errMsg);
      }
    });
  },
  onShow() {
    swan.request({
      url: api + "/home/listn/m_detail",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        id: this.currentId
      },
      success: res => {
        let {
          news_title
        } = res.data.params

        swan.setPageInfo({
          title: '猛虎视频，视频合集大分享。',
          keywords: '猛虎视频，精品视频，石榴视频',
          description: '猛虎视频，视频合集大分享。',
          articleTitle: `${news_title}-猛虎视频`,
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
        //   this.setData({
        //     detailImg: res.data.params.news_img,
        //     title: res.data.params.news_title,
        //     timer: res.data.params.news_time,
        //     htmlSnip: res.data.params.news_content,
        //     apimg: api
        //   });
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  onLoad(options) {
    this.currentId = options.id;
    this.setData({
      currentId: options.id
    });
    console.log(this.currentId);
    this.getDetail();
    this.setNavigationBarTitle()
    this.setNavigationBarColor();
    //video
    const videoContext = swan.createVideoContext("myVideo");
    console.log(videoContext);
    this.videoContext = videoContext;
  },
  //获取详情
  getDetail() {
    swan.request({
      url: api + "/home/listn/m_detail",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        id: this.currentId
      },
      success: res => {
        console.log(res.data);
        this.setData({
          video_Src: res.data.params.news_scontent,
          detailImg: res.data.params.news_img,
          title: res.data.params.news_title,
          timer: res.data.params.news_time,
          htmlSnip: res.data.params.news_content,
          apimg: api
        });
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  }
});