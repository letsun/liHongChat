// pages/delicious/delicious.js

var api = require("../../utils/api.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: ['美味菜谱','美味视频'],
    flag: 0,
    isPlay: false,
    is: false,
  },

  tapFunb() {
    this.setData({
      is: true,
    })
  },

  tabFunc(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      flag: id,
    })
  },

  playTap() {
    this.setData({
      isPlay: true,
    })
    var videoContextCurrent = wx.createVideoContext('video');
    videoContextCurrent.play();
  },

  fullscreenTap() {
    VideoContext.stop()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})