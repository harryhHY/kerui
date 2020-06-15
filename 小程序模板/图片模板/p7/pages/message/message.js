const app = getApp();
let api = app.api;
let message = app.message;
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
    bindInput: "",
    email: "",
    emailflag: false,
    animationData: "",
    nicknamevalue: "",
    focus: true,
    h5flag: false
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
  nickname(e) {
    let { value } = e.detail;
    this.setData({
      nicknamevalue: value
    });
  },
  gettype() {
    swan.request({
      url: "http://www.y53jc.cn/home/listn/guestbook_type",
      header: {
        "content-type": "application/json"
      },
      method: "POST",
      dataType: "json",
      responseType: "text",
      data: {
        // c: 74
        // tel: email, //电话号码
        // content: bindInput, //内容
        // nickname: nicknamevalue //昵称
      },
      success: res => {
        let { type, url } = res.data.params;
        console.log(type, url);
        if (type == 0) {
          this.setData({
            h5flag: true
          });
        } else {
          this.setData({
            h5flag: false
          });
          swan.navigateTo({
            url: `/pages/web/web?src=${url}`
          });
        }
      },
      fail: err => {
        console.log("错误码：" + err.errCode);
        console.log("错误信息：" + err.errMsg);
      }
    });
  },
  searchFocus(e) {
    this.setData({
      focus: true
    });
  },
  email(e) {
    // let emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;//验证邮箱
    let emailReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/; //验证手机号
    let data = e.detail.value;
    let testflag = emailReg.test(data);
    this.setData({
      email: data
    });
    if (testflag) {
      this.setData({
        emailflag: true
      });
    }
  },
  bindInput(e) {
    this.setData({
      bindInput: e.detail.value
    });
  },
  submit(e) {
    let { icon } = e.currentTarget.dataset;
    let { emailflag, email, bindInput } = this.data;
    if (email != "") {
      if (emailflag) {
        if (bindInput != "") {
          let { email, bindInput, nicknamevalue } = this.data;
          // console.log(email, bindInput, emailflag, nicknamevalue);
          swan.request({
            url: api + "/home/listn/gustbook_add",
            header: {
              "content-type": "application/json"
            },
            method: "POST",
            dataType: "json",
            responseType: "text",
            data: {
              c: 74,
              tel: email, //电话号码
              content: bindInput, //内容
              nickname: nicknamevalue //昵称
            },
            success: res => {
              if (res.data.code == 0) {
                swan.showToast({
                  title: "咨询反馈已提交,请耐心等待",
                  icon,
                  mask: false, // 此属性设置为true不能打断toast
                  success: res => {
                    console.log("showToast success", res);
                  },
                  fail: err => {
                    console.log("showToast fail", err);
                  }
                });
                this.setData({
                  email: "",
                  bindInput: "",
                  nicknamevalue: "",
                  emailflag: false
                });
              }
            },
            fail: err => {
              console.log("错误码：" + err.errCode);
              console.log("错误信息：" + err.errMsg);
            }
          });
        } else {
          swan.showToast({
            title: "咨询内容不能为空",
            icon,
            mask: false, // 此属性设置为true不能打断toast
            success: res => {
              console.log("showToast success", res);
            },
            fail: err => {
              console.log("showToast fail", err);
            }
          });
        }
      } else {
        swan.showToast({
          title: "请输入正确的手机号码",
          icon,
          mask: false, // 此属性设置为true不能打断toast
          success: res => {
            console.log("showToast success", res);
          },
          fail: err => {
            console.log("showToast fail", err);
          }
        });
        this.setData({
          email: ""
        });
      }
    } else {
      swan.showToast({
        title: "您的手机号码不能为空",
        icon,
        mask: false, // 此属性设置为true不能打断toast
        success: res => {
          console.log("showToast success", res);
        },
        fail: err => {
          console.log("showToast fail", err);
        }
      });
    }
  },
  onLoad(options) {
    this.currentId = options.src;
    this.setData({
      currentId: options.src
    });
    console.log(options.src);
    this.setNavigationBarColor();
    this.gettype();
  }
});
