const app = getApp();
let api = app.api;
let favouriteState ='';
Page({
  data: {
    currentId: "",
    detailImg: "",
    title: "",
    timer: "2019-12-14",
    logo: "../../images/logo.png",
    logo1: "../../images/logo1.png",
    islike: "../../images/like.png",
    // likebg: "../../images/likebg.png",
    items:[],
    apimg: ""
  },
    //获取点赞，点赞 取消点赞
    favourite(){
      swan.request({
        url: api + "/home/listn/favourite",
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
          console.log(res);
          if(res.data.params.type == 0){
            this.setData({
              islike:"../../images/like.png"
            });
          }else{
            this.setData({
              islike:"../../images/likebg.png"
            });
          }
          swan.showLoading({
            title: res.data.msg,
            mask: false, // 一般设置这个值为false
            success: res => {
              console.log(res);
            },
            fail: err => {
              console.log("showLoading fail", err);
            }
          });
          setTimeout(() => {
            swan.hideLoading();
          }, 1000);
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
        favouriteState = res.data.params.news_user_favourite;
        if(favouriteState == 1){
          this.setData({
            islike:"../../images/like.png"
          });
        }else{
          this.setData({
            islike:"../../images/likebg.png"
          });
        }
        this.setData({
          items:res.data.params.news_pics,
          title: res.data.params.news_title,
        });
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
        // console.log(res.data);
        swan.setPageInfo({
          title: res.data.params.news_title + "-奇兵电竞，专业电竞",
          keywords: "奇兵电竞,王者电竞,DOTA电竞",
          description: res.data.params.news_title + "-奇兵电竞，专业电竞",
          articleTitle: res.data.params.news_title + "-奇兵电竞，专业电竞",
          releaseDate: "2019-01-02 12:01:30",
          image: [
            "https://mbs1.bdstatic.com/searchbox/mappconsole/image/20200331/b259c343-84d6-44fb-8472-a3bbc3dcd1c1.png",
          ],
          success: res => {
            console.log("setPageInfo success");
          },
          fail: err => {
            console.log("setPageInfo fail", err);
          }
        });
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
   //分享
   openShare() {
    swan.openShare({
        title: '奇兵电竞',
        content: '世界很复杂，奇兵电竞更懂你',
        path: '/pages/openShare/openShare?key=value',
        imageUrl: 'https://mbs1.bdstatic.com/searchbox/mappconsole/image/20200331/b259c343-84d6-44fb-8472-a3bbc3dcd1c1.png',
        success: res => {
            swan.showToast({
                title: '分享成功'
            });
            console.log('openShare success', res);
        },
        fail: err => {
            console.log('openShare fail', err);
        }
    });
  }
});
