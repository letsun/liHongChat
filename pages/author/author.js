const RdWXBizDataCrypt = require('../../utils/WXBizDataCrypt.js');
const common = require("../../utils/common.js");
const api = require("../../utils/api.js");
const app = getApp();
Page({

  data: {

  },

  onLoad: function() {
    const that = this;

    console.log(app)
  },

  goHome() {
    const that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1]; //当前页面
    let prevPage = pages[pages.length - 2]; //上个页面
    wx.navigateBack({
      delta: 1,
    });
  },



  bindgetuserinfo: function(res) {
    console.log(res)
    let that = this;
    that.setData({
      userInfo: res.detail.userInfo
    })

    if (res.detail.userInfo != null) {
      app.globalData.headImg = res.detail.userInfo.avatarUrl;
      app.globalData.nickName = res.detail.userInfo.nickName;
      app.globalData.sex = res.detail.userInfo.gender;
      var appId = 'wx92ddcbce04fc34b6';
      var encryptedData = res.detail.encryptedData;
      var iv = res.detail.iv;
      var pc = new RdWXBizDataCrypt(appId, app.globalData.idData.sessionKey);
      var data = pc.decryptData(encryptedData, iv);
      console.log(data)
      app.globalData.idData.unionId = data.unionId;

    } else {
      wx.showToast({
        title: '亲,我拿不到你的头像与昵称呢',
        icon: 'none',
      });

      // setTimeout(function () {
      //     that.goHome();
      // },1500)

    }
  },


  //获取手机号码
  getPhoneNumber(e) {
    let that = this;
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)

    // app.globalData.sex = res.detail.userInfo.gender;

    if (e.detail.errMsg != 'getPhoneNumber:fail user deny') {

      common.requestPost(api.decrypt, {
        sessionKey: app.globalData.idData.sessionKey,
        encryptData: e.detail.encryptedData,
        ivData: e.detail.iv,
        openid: app.globalData.idData.openid
      }, reg => {

        if (reg.data.code == 200) {
          let data = JSON.parse(reg.data.data)
          app.globalData.mobile = data.phoneNumber
          that.reginfo()
        }
      })
    }

  },


  //注册用户信息
  reginfo() {
    let that = this;
    common.requestPost(api.reginfo, {
      headImg: app.globalData.headImg,
      nickName: app.globalData.nickName,
      sex: app.globalData.sex,
      unionId: app.globalData.idData.unionId,
      xcxOpenid: app.globalData.idData.openid,
      mobile: app.globalData.mobile
    }, reg => {

      if (reg.data.code == 200) {
        app.globalData.memberId = reg.data.data.memId;

        that.userInfo()

      }
    })
  },


  //获取用户信息
  userInfo() {
    let that = this;
    common.requestPost(api.userInfo + app.globalData.memberId, {}, res => {
      that.setData({
        userInfo: res.data.data
      })

      //0 为没填写资料 1为已填写资料
      if (that.data.userInfo.memName == '') {
        wx.navigateTo({
          url: '../login/login',
        })
      } else {
        setTimeout(function () {
          that.goHome();
        }, 500)
        // wx.navigateTo({
        //   url: '../personalCenter/personalData/personalData?type=' + 0,
        // })

      }







    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})