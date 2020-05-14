const app = getApp()
let api = app.api;
Page({
    data: {
        currentId: "",
        detailImg: "",
        title: "",
        timer: "2019-12-14",
        logo: "../../images/logo.png",
        logo1: "../../images/logo1.png",
        htmlSnip: '',
        apimg: ""
    },
    onLoad(options) {
        this.currentId = options.id;
        this.setData({
            currentId: options.id,
        });
        console.log(this.currentId);
        this.getDetail();
    },
    onshow() {
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
            swan.setPageInfo({
              title: res.data.params.news_title + "-山猫体育直播",
              keywords: "山猫、山猫体育、山猫直播、体育直播、篮球直播、足球直播",
              description: res.data.params.news_title + "-山猫体育直播",
              articleTitle: res.data.params.news_title + "-山猫体育直播",
              releaseDate: "2019-01-02 12:01:30",
              image: [
                "https://c.hiphotos.baidu.com/forum/w%3D480/sign=73c62dda83b1cb133e693d1bed5456da/f33725109313b07e8dee163d02d7912396dd8cfe.jpg",
                "https://hiphotos.baidu.com/fex/%70%69%63/item/43a7d933c895d143e7b745607ef082025baf07ab.jpg"
              ],
              video: [
                {
                  url: "https://www.baidu.com/mx/v12.mp4",
                  duration: "100",
                  image:
                    "https://smartprogram.baidu.com/docs/img/image-scaleToFill.png"
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
    //获取详情
    getDetail() {
        swan.request({
            url: api + '/home/listn/m_detail',
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            data: {
                id: this.currentId
            },
            success: res => {
                console.log((res.data));
                this.setData({
                    detailImg: res.data.params.news_img,
                    title: res.data.params.news_title,
                    timer: res.data.params.news_time,
                    htmlSnip: res.data.params.news_content,
                    apimg: api
                });
            },
            fail: err => {
                console.log('错误码：' + err.errCode);
                console.log('错误信息：' + err.errMsg);
            }
        });
    },
});