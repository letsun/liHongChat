const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    lotteryList: '',
    hasNext: 'false',
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.lotteryList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.lotteryList()
  },


  lotteryList() {
    let that = this;
    let pageNum = that.data.pageNum;
    common.requestPosts(api.lotteryList + app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let lotteryList = that.data.lotteryList;
      let hasNext = that.data.hasNext;
      if (lotteryList == '') {
        that.setData({
          lotteryList: res.data.data.lotteryList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            lotteryList: lotteryList.concat(res.data.data.lotteryList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },


})