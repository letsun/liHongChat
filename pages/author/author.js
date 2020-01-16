const RdWXBizDataCrypt = require('../../utils/WXBizDataCrypt.js');
const common = require("../../utils/common.js");
const api = require("../../utils/api.js");
const app = getApp();
Page({

    data: {

    },

    onLoad: function () {
        const that = this;

        console.log(app)
    },

    goHome(){
        const that = this;
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1]; //当前页面
        let prevPage = pages[pages.length - 2]; //上个页面
        wx.navigateBack({
            delta: 1,
        });
    },

    bindgetuserinfo: function (res) {
        const that = this;
        if (res.detail.userInfo != null) {
            app.globalData.headImg = res.detail.userInfo.avatarUrl;
            app.globalData.nickName = res.detail.userInfo.nickName;
            app.globalData.sex = res.detail.userInfo.gender;
            var appId = 'wx92ddcbce04fc34b6';
            var encryptedData = res.detail.encryptedData;
            var iv = res.detail.iv;
            var pc = new RdWXBizDataCrypt(appId, app.globalData.idData.sessionKey);
            var data = pc.decryptData(encryptedData, iv);
            app.globalData.idData.unionId = data.unionId;

            common.requestPost(api.register, {
                headImg: app.globalData.headImg,
                nickName: app.globalData.nickName,
                sex	: app.globalData.sex,
                unionId: app.globalData.idData.unionId,
                xcxOpenid: app.globalData.idData.openid,
            }, reg => {

                if (reg.data.code == 200) {
                  app.globalData.memberId = reg.data.data.memId;
                  
                    setTimeout(function () {
                        that.goHome();
                    },500)

                }
            })

        } else {
            wx.showToast({
                title: '亲,我拿不到你的头像与昵称呢',
                icon: 'none',
            });

            setTimeout(function () {
                that.goHome();
            },1500)

        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})