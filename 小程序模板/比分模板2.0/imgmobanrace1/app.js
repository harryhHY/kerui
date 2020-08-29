/**
 * @file app.js
 * @author swan
 */

/* globals swan */
App({
  apifrom: "https://z5mh2.cn",
  api: "https://f9f7t.cn",
  c:114,
  onLaunch(options) {
    // do something when launch
    // 引导添加，参见文档： http://smartprogram.baidu.com/docs/design/component/guide_add/
    if (swan.canIUse("showFavoriteGuide")) {
      swan.showFavoriteGuide({
        type: "bar",
        content: "一键关注小程序",
        success(res) {
          console.log("关注成功：", res);
        },
        fail(err) {
          console.log("关注失败：", err);
        }
      });
    }
  },
  onShow(options) {
    // do something when show
  },
  onHide() {
    // do something when hide
  }
});
