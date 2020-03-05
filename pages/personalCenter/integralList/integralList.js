// pages/integral/integral.js
const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pointList: '',
    hasNext: 'false',
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.integralList()
    common.uvpv('', '积分记录页') //页面访问uv信息
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.integralList()
  },

  /**
   * 
   *积分记录
   */
  integralList() {
    let that = this;
    let pageNum = that.data.pageNum;
    let status = that.data.status;

    common.requestPosts(api.integralList+ app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {

      let pointList = that.data.pointList;
      let hasNext = that.data.hasNext;
      if (pointList == '') {
        that.setData({
          pointList: res.data.data.pointList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            pointList: pointList.concat(res.data.data.pointList),
            hasNext: res.data.data.hasNext
          })
        }
      }

    })
  },


})