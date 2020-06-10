// pages/personalCenter/winningList/winningList.js

const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imapath: app.globalData.imapath,
    pageNum: 1,
    lotteryList: '',
    loadingtext: '上拉加载更多'
  },

  onReady() {
    let that = this;
    that.lotteryList()
  },

  //上拉加载
  pullup() {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    if (that.data.hasNext == "true") {
      that.lotteryList()
    } else {
      that.setData({
        loadingtext: '没有更多数据了'
      })

    }

  },

  lotteryList() {
    let that = this;
    let pageNum = that.data.pageNum;
    common.requestPosts(api.lotteryList + app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let lotteryList = that.data.lotteryList;
      let hasNext = that.data.hasNext;

      let lotteryLista = res.data.data.lotteryList;

      for (var i in lotteryLista) {
        lotteryLista[i].lotteryTime = lotteryLista[i].lotteryTime.split(' ')[0]
      }


      if (lotteryList == '') {

        that.setData({
          lotteryList: lotteryLista,
          hasNext: res.data.data.hasNext
        })

        if (res.data.data.hasNext == "false") {
          that.setData({
            loadingtext: '没有更多数据了'
          })
        }
      } else {
        if (hasNext == "true") {
          that.setData({
            lotteryList: lotteryList.concat(lotteryLista),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },

  //跳转到中奖记录
  winning() {
    if (app.globalData.memberId > 0) {
      wx.navigateTo({
        url: '../../personalCenter/winning/winning',
      })
    } else {
      common.login()
    }
  },
})