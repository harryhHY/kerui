/**
 * @file demo component for input
 * @author swan
 */

let app = getApp();
let api = app.api;
Page({
    data: {
        autoFocus: true,
        height: 1,
        focus: true,
        flag: false,
        form_info: ''
    },
    onLoad(e) {},
    onShow() {
        this.setData({
            autoFocus: true
        });
        // 打点操作
        // var openParams = app.globalData.openParams;
        // if (openParams) {
        //     swan.reportAnalytics('pageshow', {
        //         fr: openParams,
        //         type: 'component',
        //         name: 'input',
        //     });
        // }
    },
    formSubmit: function(e) {
        let formData = e.detail.value;
        console.log('form发生了submit事件，携带数据为：', formData);
        let checkPhone = /^1[3456789]\d{9}$/;
        if (formData.tel == '') {
            swan.showToast({
                title: '手机号不能为空',
                icon: "none"
            })
        } else if (!checkPhone.test(formData.tel)) {
            swan.showToast({
                title: '手机号格式不正确',
                icon: "none"
            })
        } else {
            this.setData({
                form_info: ""
            })
            swan.request({
                url: api + "/home/listn/gustbook_add",
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                data: {
                    c: 78,
                    nickname: formData.nickname,
                    tel: formData.tel,
                    content: formData.content
                },
                success: res => {
                    console.log((res.data));
                    if (res.data.code == 0) {
                        swan.showToast({
                            title: '提交成功',
                        })
                    } else {
                        swan.showToast({
                            title: '提交失败',
                            icon: "none"
                        })
                    }
                },
                fail: err => {
                    console.log('错误码：' + err.errCode);
                    console.log('错误信息：' + err.errMsg);
                }
            });
        }
    },
    formReset() {
        console.log('form表单reset');
    },
});