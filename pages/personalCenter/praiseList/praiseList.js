const app = getApp();
const common = require("../../../utils/common.js")
const api = require("../../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    dianzList: '',
    hasNext: 'false',
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.dianzList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    that.setData({
      pageNum: that.data.pageNum + 1
    })

    that.dianzList()
  },


  dianzList() {
    let that = this;
    let pageNum = that.data.pageNum;

    common.requestPosts(api.dianzList + app.globalData.memberId, {
      pageNum: pageNum,
    }, res => {
      let dianzList = that.data.dianzList;
      let hasNext = that.data.hasNext;
      if (dianzList == '') {
        that.setData({
          dianzList: res.data.data.dianzList,
          hasNext: res.data.data.hasNext
        })
      } else {
        if (hasNext == "true") {
          that.setData({
            dianzList: dianzList.concat(res.data.data.dianzList),
            hasNext: res.data.data.hasNext
          })
        }
      }
    })
  },

  //详情
  deliciousDetail(e) {
 
    let objid = e.currentTarget.dataset.objid;
    if (e.currentTarget.dataset.objtype == 2) {

      var objtype = 1 ;
      wx.navigateTo({
        url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
      })
    } else if (e.currentTarget.dataset.objtype == 1) {
      var objtype = 0;
      wx.navigateTo({
        url: '../../delicious/deliciousDetail/deliciousDetail?objid=' + objid + '&objtype=' + objtype,
      })
    } else if (e.currentTarget.dataset.objtype == 0) {
      wx.switchTab({
        url: '../../delicious/deliciousList/deliciousList' 
      })
    }


  },


})