// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  personalData() {
    wx.navigateTo({
      url: '../personalCenter/personalData/personalData?type=' + 0,
    })
  },

  personal() {
    wx.reLaunch({
      url: '../personalCenter/personal/personal',
    })
  }


})