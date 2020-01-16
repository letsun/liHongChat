// pages/lottery/lottery.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    joinList: '',
    hasNext: 'false',
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.joinList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.joinList()
  },


  joinList() {
    let that = this;
    let pageNum = that.data.pageNum;

    common.requestPosts(api.joinList+ app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let joinList = that.data.joinList;
      let hasNext = that.data.hasNext;
      if (joinList == '') {
        that.setData({
          joinList: res.data.data.joinList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            joinList: joinList.concat(res.data.data.joinList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },


})