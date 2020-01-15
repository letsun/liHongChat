const app = getApp()
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

const RdWXBizDataCrypt = require('../../../utils/WXBizDataCrypt.js')

//index.js


Page({
  data: {
    // motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },


  onShow() {
    var that = this;
    wx.login({
      success: res => {
        //获取openid
        common.requestPost(api.getOpenidByCode, {
          code: res.code
        }, reg => {
          app.globalData.idData = reg.data.result;
          var sessionKey = reg.data.result.sessionKey;

          // wx.getUserInfo({
          //   success: res2 => {
          //     var appId = 'wx92ddcbce04fc34b6'
          //     var encryptedData = res2.encryptedData;
          //     var iv = res2.iv;
          //     var pc = new RdWXBizDataCrypt(appId, sessionKey)
          //     var data = pc.decryptData(encryptedData, iv);
          //     console.log('data', data);


          //     wx.switchTab({
          //       url: '../../activityHome/index/index',
          //     })
          //   }
          // })

        })

      }
    })
  },


  nav() {

    wx.switchTab({
      url: '../../activityHome/home/home',
    })
  },



  // onLoad: function() {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse) {
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         console.log(res)
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})