const app = getApp()
let api = app.api;
Page({
    setNavigationBarColor() {
        swan.setNavigationBarColor({
            frontColor: '#ffffff',
            animation: {
                duration: 500,
                timingFunc: 'linear'
            },
            success: res => {
                console.log('setNavigationBarColor success');
            },
            fail: err => {
                console.log('setNavigationBarColor fail', err);
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
        htmlSnip: '',
        apimg: "",
        video_Src:"",
    },
    onShow() {
      swan.setPageInfo({
        title: '风情直播,不一样的直播',
        keywords: '风情直播，香蕉直播，水果直播',
        description: '奶茶直播，有故事的直播。',
        articleTitle: '风情直播-小姐姐直播',
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
    onLoad(options) {
        this.currentId = options.id;
        this.setData({
            currentId: options.id,
        });
        console.log(this.currentId);
        this.getDetail();
        this.setNavigationBarColor();
        //video
        const videoContext = swan.createVideoContext('myVideo');
        console.log(videoContext);
        this.videoContext = videoContext;
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